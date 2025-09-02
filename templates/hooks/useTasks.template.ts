/**
 * TEMPLATE: Task Management Data Hook
 * 
 * A reusable React hook for managing task data with caching, error handling,
 * and optimistic updates. This hook provides a consistent interface for
 * task operations across your application.
 * 
 * CUSTOMIZATION GUIDE:
 * 1. Update data fetching functions to match your API/data source
 * 2. Modify caching strategy based on your requirements
 * 3. Customize error handling for your user experience
 * 4. Add new operations specific to your domain
 * 
 * FEATURES:
 * - Automatic caching with configurable TTL
 * - Error handling with graceful degradation
 * - Optimistic updates for better UX
 * - Loading states and refresh controls
 * - Flexible filtering and sorting
 */

import { useCallback, useMemo } from "react";
import { useCachedPromise, usePromise } from "@raycast/utils";
import { showToast, Toast } from "@raycast/api";

// TEMPLATE: Replace with your types and utilities
import { Task, TaskData, TaskStatus, TaskPriority, GetTasksOptions } from "../types";
import { readTasks, writeTask, deleteTask, createTask } from "../utils/api";
import { filterTasks, sortTasks, validateTask } from "../utils/helpers";

// ============================================================================
// HOOK INTERFACES
// ============================================================================

interface UseTasksOptions extends GetTasksOptions {
  /** Enable automatic refresh */
  autoRefresh?: boolean;
  /** Cache time-to-live in milliseconds */
  cacheTTL?: number;
  /** Enable optimistic updates */
  optimistic?: boolean;
  /** Custom error handler */
  onError?: (error: Error) => void;
  /** Custom success handler */
  onSuccess?: (data: TaskData) => void;
}

interface UseTasksReturn {
  // Data
  tasks: Task[];
  taskData: TaskData | null;
  
  // Loading states
  isLoading: boolean;
  isRefreshing: boolean;
  
  // Error state
  error: Error | null;
  
  // Actions
  refresh: () => void;
  revalidate: () => void;
  
  // Task operations
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  createTask: (taskData: Omit<Task, "id">) => Promise<Task>;
  updateTaskStatus: (taskId: string, status: TaskStatus) => Promise<void>;
  
  // Filtered data
  getTasksByStatus: (status: TaskStatus) => Task[];
  getTasksByPriority: (priority: TaskPriority) => Task[];
  searchTasks: (query: string) => Task[];
  
  // Statistics
  getTaskCounts: () => Record<TaskStatus, number>;
  getPriorityDistribution: () => Record<TaskPriority, number>;
}

// ============================================================================
// MAIN HOOK
// ============================================================================

/**
 * Task Management Hook
 * 
 * TEMPLATE: This implementation uses Raycast's useCachedPromise
 * Adapt for your framework:
 * 
 * React Query Example:
 * const { data, isLoading, error, refetch } = useQuery({
 *   queryKey: ['tasks', options],
 *   queryFn: () => fetchTasks(options),
 *   staleTime: cacheTTL,
 *   onError: handleError,
 * });
 * 
 * SWR Example:
 * const { data, error, isLoading, mutate } = useSWR(
 *   ['tasks', options],
 *   () => fetchTasks(options),
 *   { refreshInterval: autoRefresh ? 30000 : 0 }
 * );
 */
export function useTasks(options: UseTasksOptions = {}): UseTasksReturn {
  const {
    projectRoot,
    status,
    autoRefresh = false,
    cacheTTL = 30000,
    optimistic = true,
    onError,
    onSuccess,
    ...filterOptions
  } = options;

  // ============================================================================
  // ERROR HANDLING
  // ============================================================================

  const handleError = useCallback(async (error: Error) => {
    console.error("Task management error:", error);

    // Custom error handler
    if (onError) {
      onError(error);
      return;
    }

    // Default error handling with user-friendly messages
    let message = "Failed to load tasks";
    
    if (error.message.includes("not found")) {
      message = "TaskMaster project not found. Please check your project root path.";
    } else if (error.message.includes("permission")) {
      message = "Permission denied. Please check file permissions.";
    } else if (error.message.includes("network")) {
      message = "Network error. Please check your connection.";
    }

    await showToast({
      style: Toast.Style.Failure,
      title: "Task Loading Failed",
      message,
    });
  }, [onError]);

  // ============================================================================
  // DATA FETCHING
  // ============================================================================

  const {
    data: taskData,
    isLoading,
    error,
    revalidate,
  } = useCachedPromise(
    async (root: string) => {
      try {
        if (!root || root.trim() === "") {
          throw new Error("Project root not configured. Please set the project root path in preferences.");
        }

        console.log(`Loading tasks from: ${root}`);
        const data = await readTasks(root, filterOptions);
        
        if (onSuccess) {
          onSuccess(data);
        }

        return data;
      } catch (error) {
        await handleError(error instanceof Error ? error : new Error(String(error)));
        throw error;
      }
    },
    [projectRoot || ""],
    {
      keepPreviousData: true,
      initialData: null,
      onError: () => {}, // Error handling is done in the async function
      // TEMPLATE: Adjust caching options for your needs
      execute: Boolean(projectRoot),
    }
  );

  // ============================================================================
  // DERIVED DATA
  // ============================================================================

  const tasks = useMemo(() => {
    if (!taskData?.tasks) return [];
    
    let filteredTasks = taskData.tasks;
    
    // Apply status filter
    if (status) {
      filteredTasks = filterTasks(filteredTasks, { status });
    }
    
    // Apply additional filters
    filteredTasks = filterTasks(filteredTasks, filterOptions);
    
    // Apply default sorting
    return sortTasks(filteredTasks, { by: "priority", order: "desc" });
  }, [taskData, status, filterOptions]);

  // ============================================================================
  // TASK OPERATIONS
  // ============================================================================

  const updateTask = useCallback(async (taskId: string, updates: Partial<Task>) => {
    if (!projectRoot) throw new Error("Project root not configured");
    
    try {
      // Validation
      const existingTask = tasks.find(t => t.id === taskId);
      if (!existingTask) {
        throw new Error(`Task ${taskId} not found`);
      }

      const updatedTask = { ...existingTask, ...updates };
      if (!validateTask(updatedTask)) {
        throw new Error("Invalid task data");
      }

      // Optimistic update
      if (optimistic && taskData) {
        // TEMPLATE: Implement optimistic update logic
        // Update local state immediately, then revalidate
      }

      await writeTask(projectRoot, taskId, updates);
      await revalidate();

      await showToast({
        style: Toast.Style.Success,
        title: "Task Updated",
        message: `Task "${updatedTask.title}" has been updated`,
      });
    } catch (error) {
      await handleError(error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  }, [projectRoot, tasks, optimistic, taskData, revalidate, handleError]);

  const deleteTaskById = useCallback(async (taskId: string) => {
    if (!projectRoot) throw new Error("Project root not configured");
    
    try {
      const taskToDelete = tasks.find(t => t.id === taskId);
      if (!taskToDelete) {
        throw new Error(`Task ${taskId} not found`);
      }

      await deleteTask(projectRoot, taskId);
      await revalidate();

      await showToast({
        style: Toast.Style.Success,
        title: "Task Deleted",
        message: `Task "${taskToDelete.title}" has been deleted`,
      });
    } catch (error) {
      await handleError(error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  }, [projectRoot, tasks, revalidate, handleError]);

  const createNewTask = useCallback(async (newTaskData: Omit<Task, "id">) => {
    if (!projectRoot) throw new Error("Project root not configured");
    
    try {
      if (!validateTask({ ...newTaskData, id: "temp" })) {
        throw new Error("Invalid task data");
      }

      const createdTask = await createTask(projectRoot, newTaskData);
      await revalidate();

      await showToast({
        style: Toast.Style.Success,
        title: "Task Created",
        message: `Task "${createdTask.title}" has been created`,
      });

      return createdTask;
    } catch (error) {
      await handleError(error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  }, [projectRoot, revalidate, handleError]);

  const updateTaskStatus = useCallback(async (taskId: string, newStatus: TaskStatus) => {
    return updateTask(taskId, { status: newStatus });
  }, [updateTask]);

  // ============================================================================
  // FILTERING AND SEARCH
  // ============================================================================

  const getTasksByStatus = useCallback((targetStatus: TaskStatus) => {
    return tasks.filter(task => task.status === targetStatus);
  }, [tasks]);

  const getTasksByPriority = useCallback((targetPriority: TaskPriority) => {
    return tasks.filter(task => task.priority === targetPriority);
  }, [tasks]);

  const searchTasks = useCallback((query: string) => {
    if (!query.trim()) return tasks;
    
    const lowercaseQuery = query.toLowerCase();
    return tasks.filter(task => 
      task.title.toLowerCase().includes(lowercaseQuery) ||
      task.description.toLowerCase().includes(lowercaseQuery) ||
      task.id.includes(query)
    );
  }, [tasks]);

  // ============================================================================
  // STATISTICS
  // ============================================================================

  const getTaskCounts = useCallback(() => {
    const counts = tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {} as Record<TaskStatus, number>);

    // Ensure all statuses are represented
    const allStatuses: TaskStatus[] = ["pending", "in-progress", "review", "done", "deferred", "cancelled"];
    allStatuses.forEach(status => {
      if (!(status in counts)) {
        counts[status] = 0;
      }
    });

    return counts;
  }, [tasks]);

  const getPriorityDistribution = useCallback(() => {
    const distribution = tasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    }, {} as Record<TaskPriority, number>);

    // Ensure all priorities are represented
    const allPriorities: TaskPriority[] = ["high", "medium", "low"];
    allPriorities.forEach(priority => {
      if (!(priority in distribution)) {
        distribution[priority] = 0;
      }
    });

    return distribution;
  }, [tasks]);

  // ============================================================================
  // RETURN VALUES
  // ============================================================================

  return {
    // Data
    tasks,
    taskData,
    
    // Loading states
    isLoading,
    isRefreshing: isLoading && Boolean(taskData),
    
    // Error state
    error: error || null,
    
    // Actions
    refresh: revalidate,
    revalidate,
    
    // Task operations
    updateTask,
    deleteTask: deleteTaskById,
    createTask: createNewTask,
    updateTaskStatus,
    
    // Filtered data
    getTasksByStatus,
    getTasksByPriority,
    searchTasks,
    
    // Statistics
    getTaskCounts,
    getPriorityDistribution,
  };
}

// ============================================================================
// SPECIALIZED HOOKS
// ============================================================================

/**
 * Hook for a single task with real-time updates
 */
export function useTask(taskId: string, projectRoot?: string) {
  const { tasks, isLoading, error, updateTask, deleteTask } = useTasks({ projectRoot });
  
  const task = useMemo(() => {
    return tasks.find(t => t.id === taskId) || null;
  }, [tasks, taskId]);

  return {
    task,
    isLoading,
    error,
    updateTask: (updates: Partial<Task>) => updateTask(taskId, updates),
    deleteTask: () => deleteTask(taskId),
    exists: Boolean(task),
  };
}

/**
 * Hook for task filtering with URL state sync
 */
export function useTaskFilters(initialFilters?: Partial<GetTasksOptions>) {
  // TEMPLATE: Implement URL state synchronization
  // const [filters, setFilters] = useSearchParams(initialFilters);
  
  // For now, use simple state
  const [filters, setFilters] = useState(initialFilters || {});
  
  const { tasks, isLoading, error } = useTasks(filters);

  const updateFilter = useCallback((key: keyof GetTasksOptions, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const hasActiveFilters = useMemo(() => {
    return Object.keys(filters).length > 0;
  }, [filters]);

  return {
    tasks,
    isLoading,
    error,
    filters,
    updateFilter,
    clearFilters,
    hasActiveFilters,
  };
}

/**
 * Hook for task analytics and metrics
 */
export function useTaskAnalytics(projectRoot?: string) {
  const { tasks, isLoading } = useTasks({ projectRoot });

  const analytics = useMemo(() => {
    if (!tasks.length) {
      return {
        totalTasks: 0,
        completionRate: 0,
        averageComplexity: 0,
        statusDistribution: {},
        priorityDistribution: {},
        productivity: {
          tasksCompletedToday: 0,
          tasksCompletedThisWeek: 0,
        },
      };
    }

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === "done").length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    const complexityScores = tasks
      .filter(t => t.complexityScore)
      .map(t => t.complexityScore!);
    const averageComplexity = complexityScores.length > 0
      ? complexityScores.reduce((sum, score) => sum + score, 0) / complexityScores.length
      : 0;

    // Status distribution
    const statusDistribution = tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {} as Record<TaskStatus, number>);

    // Priority distribution
    const priorityDistribution = tasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    }, {} as Record<TaskPriority, number>);

    // TEMPLATE: Add time-based analytics if you have timestamps
    // const now = new Date();
    // const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    // const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    return {
      totalTasks,
      completionRate: Math.round(completionRate),
      averageComplexity: Math.round(averageComplexity * 100) / 100,
      statusDistribution,
      priorityDistribution,
      productivity: {
        tasksCompletedToday: 0, // TEMPLATE: Implement with timestamps
        tasksCompletedThisWeek: 0, // TEMPLATE: Implement with timestamps
      },
    };
  }, [tasks]);

  return {
    analytics,
    isLoading,
  };
}