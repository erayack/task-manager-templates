/**
 * BASIC TEMPLATE: Simple Task Management Hook
 * 
 * A React hook for basic task management operations.
 * Provides CRUD operations with simple state management and persistence.
 * 
 * FEATURES:
 * - Create, read, update, delete tasks
 * - Simple filtering and sorting
 * - Auto-save functionality
 * - Local storage persistence
 * 
 * CUSTOMIZATION:
 * - Replace storage with your preferred method (API, database, etc.)
 * - Add validation logic
 * - Implement custom business rules
 * - Add error handling specific to your needs
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import { Task, CreateTaskData, UpdateTaskData, TaskFilters, TaskStats, SortOptions } from "../types";
import { CONFIG, DEFAULT_SORT } from "../config";
import { generateId, sortTasks, filterTasks, validateTask } from "../utils/helpers";
import { loadTasks, saveTasks } from "../utils/storage";

// ============================================================================
// HOOK INTERFACE
// ============================================================================

interface UseSimpleTasksReturn {
  // Data
  tasks: Task[];
  filteredTasks: Task[];
  stats: TaskStats;
  
  // State
  isLoading: boolean;
  error: string | null;
  
  // Filters and sorting
  filters: TaskFilters;
  setFilters: (filters: TaskFilters) => void;
  sort: SortOptions;
  setSort: (sort: SortOptions) => void;
  
  // Operations
  createTask: (data: CreateTaskData) => Promise<void>;
  updateTask: (id: string, data: UpdateTaskData) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  getTask: (id: string) => Task | undefined;
  
  // Bulk operations
  deleteCompletedTasks: () => Promise<void>;
  markAllAsComplete: () => Promise<void>;
  
  // Utility
  refresh: () => Promise<void>;
  clearError: () => void;
}

// ============================================================================
// MAIN HOOK
// ============================================================================

export function useSimpleTasks(): UseSimpleTasksReturn {
  // ============================================================================
  // STATE
  // ============================================================================
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TaskFilters>({});
  const [sort, setSort] = useState<SortOptions>(DEFAULT_SORT);

  // ============================================================================
  // DERIVED STATE
  // ============================================================================

  // Apply filters and sorting
  const filteredTasks = useMemo(() => {
    let result = filterTasks(tasks, filters);
    result = sortTasks(result, sort);
    return result;
  }, [tasks, filters, sort]);

  // Calculate statistics
  const stats = useMemo((): TaskStats => {
    const total = tasks.length;
    const todo = tasks.filter(t => t.status === "todo").length;
    const inProgress = tasks.filter(t => t.status === "in-progress").length;
    const done = tasks.filter(t => t.status === "done").length;
    
    const byPriority = {
      high: tasks.filter(t => t.priority === "high").length,
      medium: tasks.filter(t => t.priority === "medium").length,
      low: tasks.filter(t => t.priority === "low").length,
    };

    return { total, todo, inProgress, done, byPriority };
  }, [tasks]);

  // ============================================================================
  // STORAGE OPERATIONS
  // ============================================================================

  const saveTasksToStorage = useCallback(async (tasksToSave: Task[]) => {
    try {
      await saveTasks(tasksToSave);
    } catch (err) {
      console.error("Failed to save tasks:", err);
      setError("Failed to save tasks");
    }
  }, []);

  const loadTasksFromStorage = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const loadedTasks = await loadTasks();
      setTasks(loadedTasks);
    } catch (err) {
      console.error("Failed to load tasks:", err);
      setError("Failed to load tasks");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ============================================================================
  // TASK OPERATIONS
  // ============================================================================

  const createTask = useCallback(async (data: CreateTaskData) => {
    try {
      setError(null);
      
      // Validate task data
      const validation = validateTask(data);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(", "));
      }

      // Create new task
      const newTask: Task = {
        ...data,
        id: generateId(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);

      // Auto-save if enabled
      if (CONFIG.ui.autoSave) {
        await saveTasksToStorage(updatedTasks);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create task";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [tasks, saveTasksToStorage]);

  const updateTask = useCallback(async (id: string, data: UpdateTaskData) => {
    try {
      setError(null);
      
      const existingTask = tasks.find(t => t.id === id);
      if (!existingTask) {
        throw new Error(`Task with id ${id} not found`);
      }

      // Create updated task
      const updatedTask: Task = {
        ...existingTask,
        ...data,
        updatedAt: new Date(),
      };

      // Validate updated task
      const validation = validateTask(updatedTask);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(", "));
      }

      const updatedTasks = tasks.map(t => t.id === id ? updatedTask : t);
      setTasks(updatedTasks);

      // Auto-save if enabled
      if (CONFIG.ui.autoSave) {
        await saveTasksToStorage(updatedTasks);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update task";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [tasks, saveTasksToStorage]);

  const deleteTask = useCallback(async (id: string) => {
    try {
      setError(null);
      
      const taskExists = tasks.some(t => t.id === id);
      if (!taskExists) {
        throw new Error(`Task with id ${id} not found`);
      }

      const updatedTasks = tasks.filter(t => t.id !== id);
      setTasks(updatedTasks);

      // Auto-save if enabled
      if (CONFIG.ui.autoSave) {
        await saveTasksToStorage(updatedTasks);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete task";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [tasks, saveTasksToStorage]);

  const getTask = useCallback((id: string) => {
    return tasks.find(t => t.id === id);
  }, [tasks]);

  // ============================================================================
  // BULK OPERATIONS
  // ============================================================================

  const deleteCompletedTasks = useCallback(async () => {
    try {
      setError(null);
      
      const updatedTasks = tasks.filter(t => t.status !== "done");
      setTasks(updatedTasks);

      if (CONFIG.ui.autoSave) {
        await saveTasksToStorage(updatedTasks);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete completed tasks";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [tasks, saveTasksToStorage]);

  const markAllAsComplete = useCallback(async () => {
    try {
      setError(null);
      
      const updatedTasks = tasks.map(task => ({
        ...task,
        status: "done" as const,
        updatedAt: new Date(),
      }));
      
      setTasks(updatedTasks);

      if (CONFIG.ui.autoSave) {
        await saveTasksToStorage(updatedTasks);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to mark all tasks as complete";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [tasks, saveTasksToStorage]);

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  const refresh = useCallback(async () => {
    await loadTasksFromStorage();
  }, [loadTasksFromStorage]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  // Load tasks on mount
  useEffect(() => {
    loadTasksFromStorage();
  }, [loadTasksFromStorage]);

  // Auto-save when tasks change (if not using auto-save on operations)
  useEffect(() => {
    if (!CONFIG.ui.autoSave && tasks.length > 0) {
      // Debounced save could be implemented here
      const timeoutId = setTimeout(() => {
        saveTasksToStorage(tasks);
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [tasks, saveTasksToStorage]);

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    // Data
    tasks,
    filteredTasks,
    stats,
    
    // State
    isLoading,
    error,
    
    // Filters and sorting
    filters,
    setFilters,
    sort,
    setSort,
    
    // Operations
    createTask,
    updateTask,
    deleteTask,
    getTask,
    
    // Bulk operations
    deleteCompletedTasks,
    markAllAsComplete,
    
    // Utility
    refresh,
    clearError,
  };
}

// ============================================================================
// SPECIALIZED HOOKS
// ============================================================================

/**
 * Hook for managing a single task
 */
export function useTask(taskId: string) {
  const { tasks, updateTask, deleteTask, getTask } = useSimpleTasks();
  
  const task = useMemo(() => getTask(taskId), [getTask, taskId]);
  
  return {
    task,
    updateTask: (data: UpdateTaskData) => updateTask(taskId, data),
    deleteTask: () => deleteTask(taskId),
    exists: Boolean(task),
  };
}

/**
 * Hook for task statistics and analytics
 */
export function useTaskStats() {
  const { stats, tasks } = useSimpleTasks();
  
  const completionRate = useMemo(() => {
    return stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;
  }, [stats]);

  const todayTasks = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return tasks.filter(task => {
      const createdDate = new Date(task.createdAt);
      createdDate.setHours(0, 0, 0, 0);
      return createdDate.getTime() === today.getTime();
    }).length;
  }, [tasks]);

  return {
    ...stats,
    completionRate,
    todayTasks,
  };
}