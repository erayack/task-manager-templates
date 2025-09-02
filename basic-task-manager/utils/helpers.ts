/**
 * BASIC TEMPLATE: Helper Utilities
 * 
 * Utility functions for basic task management operations.
 * Includes validation, filtering, sorting, and other common operations.
 * 
 * CUSTOMIZATION:
 * - Add domain-specific validation rules
 * - Implement custom sorting algorithms
 * - Add business logic helpers
 * - Extend filtering capabilities
 */

import { Task, TaskFilters, SortOptions, CreateTaskData, TaskStatus, TaskPriority } from "../types";
import { CONFIG } from "../config";

// ============================================================================
// ID GENERATION
// ============================================================================

/**
 * Generate a unique task ID
 * TEMPLATE: Customize based on your ID strategy
 */
export function generateId(): string {
  // Simple timestamp-based ID with random component
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `${timestamp}-${random}`;
}

/**
 * Generate a sequential numeric ID
 */
export function generateSequentialId(existingTasks: Task[]): string {
  const existingIds = existingTasks
    .map(task => parseInt(task.id))
    .filter(id => !isNaN(id))
    .sort((a, b) => a - b);
  
  let nextId = 1;
  for (const id of existingIds) {
    if (id === nextId) {
      nextId++;
    } else {
      break;
    }
  }
  
  return nextId.toString();
}

/**
 * Generate a human-readable ID with prefix
 */
export function generatePrefixedId(prefix: string = "TASK", existingTasks: Task[]): string {
  const existingNumbers = existingTasks
    .map(task => {
      const match = task.id.match(new RegExp(`^${prefix}-(\\d+)$`));
      return match ? parseInt(match[1]) : 0;
    })
    .filter(num => num > 0)
    .sort((a, b) => a - b);
  
  const nextNumber = existingNumbers.length > 0 
    ? Math.max(...existingNumbers) + 1 
    : 1;
  
  return `${prefix}-${nextNumber.toString().padStart(4, "0")}`;
}

// ============================================================================
// VALIDATION
// ============================================================================

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validate task data
 * TEMPLATE: Add custom validation rules
 */
export function validateTask(task: Partial<Task>): ValidationResult {
  const errors: string[] = [];

  // Title validation
  if (!task.title || typeof task.title !== "string") {
    errors.push("Title is required");
  } else if (task.title.trim().length === 0) {
    errors.push("Title cannot be empty");
  } else if (task.title.length > 200) {
    errors.push("Title must be less than 200 characters");
  }

  // Description validation
  if (task.description !== undefined) {
    if (typeof task.description !== "string") {
      errors.push("Description must be a string");
    } else if (task.description.length > 1000) {
      errors.push("Description must be less than 1000 characters");
    }
  }

  // Status validation
  if (task.status && !isValidStatus(task.status)) {
    errors.push(`Invalid status: ${task.status}`);
  }

  // Priority validation
  if (task.priority && !isValidPriority(task.priority)) {
    errors.push(`Invalid priority: ${task.priority}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Check if status is valid
 */
export function isValidStatus(status: string): status is TaskStatus {
  return ["todo", "in-progress", "done"].includes(status);
}

/**
 * Check if priority is valid
 */
export function isValidPriority(priority: string): priority is TaskPriority {
  return ["high", "medium", "low"].includes(priority);
}

/**
 * Sanitize task input data
 */
export function sanitizeTaskData(data: CreateTaskData): CreateTaskData {
  return {
    ...data,
    title: data.title.trim(),
    description: data.description?.trim() || undefined,
    status: isValidStatus(data.status) ? data.status : "todo",
    priority: isValidPriority(data.priority) ? data.priority : "medium",
  };
}

// ============================================================================
// FILTERING
// ============================================================================

/**
 * Filter tasks based on criteria
 * TEMPLATE: Add custom filter logic
 */
export function filterTasks(tasks: Task[], filters: TaskFilters): Task[] {
  return tasks.filter(task => {
    // Status filter
    if (filters.status && task.status !== filters.status) {
      return false;
    }

    // Priority filter
    if (filters.priority && task.priority !== filters.priority) {
      return false;
    }

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const searchableText = [
        task.title,
        task.description || "",
        task.id,
      ].join(" ").toLowerCase();
      
      if (!searchableText.includes(searchTerm)) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Get tasks by status
 */
export function getTasksByStatus(tasks: Task[], status: TaskStatus): Task[] {
  return tasks.filter(task => task.status === status);
}

/**
 * Get tasks by priority
 */
export function getTasksByPriority(tasks: Task[], priority: TaskPriority): Task[] {
  return tasks.filter(task => task.priority === priority);
}

/**
 * Search tasks by text
 */
export function searchTasks(tasks: Task[], query: string): Task[] {
  if (!query.trim()) {
    return tasks;
  }

  const searchTerm = query.toLowerCase();
  return tasks.filter(task => {
    const searchableText = [
      task.title,
      task.description || "",
      task.id,
    ].join(" ").toLowerCase();
    
    return searchableText.includes(searchTerm);
  });
}

// ============================================================================
// STATISTICS
// ============================================================================

/**
 * Calculate task statistics
 */
export function calculateStats(tasks: Task[]) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'done').length;
  const inProgress = tasks.filter(t => t.status === 'in-progress').length;
  const pending = tasks.filter(t => t.status === 'todo').length;

  return {
    total,
    completed,
    inProgress,
    pending,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
}

// ============================================================================
// SORTING
// ============================================================================

/**
 * Sort tasks based on criteria
 * TEMPLATE: Add custom sorting logic
 */
export function sortTasks(tasks: Task[], sort: SortOptions): Task[] {
  const sortedTasks = [...tasks];
  
  sortedTasks.sort((a, b) => {
    let comparison = 0;
    
    switch (sort.field) {
      case "title":
        comparison = a.title.localeCompare(b.title);
        break;
        
      case "status":
        const statusOrder = ["todo", "in-progress", "done"];
        comparison = statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
        break;
        
      case "priority":
        const priorityWeights = { high: 3, medium: 2, low: 1 };
        comparison = priorityWeights[b.priority] - priorityWeights[a.priority];
        break;
        
      case "createdAt":
        comparison = a.createdAt.getTime() - b.createdAt.getTime();
        break;
        
      case "updatedAt":
        comparison = a.updatedAt.getTime() - b.updatedAt.getTime();
        break;
        
      default:
        comparison = 0;
    }
    
    return sort.order === "desc" ? -comparison : comparison;
  });
  
  return sortedTasks;
}

/**
 * Sort tasks by priority (high to low)
 */
export function sortByPriority(tasks: Task[]): Task[] {
  return sortTasks(tasks, { field: "priority", order: "asc" });
}

/**
 * Sort tasks by creation date (newest first)
 */
export function sortByCreationDate(tasks: Task[]): Task[] {
  return sortTasks(tasks, { field: "createdAt", order: "desc" });
}

/**
 * Sort tasks by status (todo, in-progress, done)
 */
export function sortByStatus(tasks: Task[]): Task[] {
  return sortTasks(tasks, { field: "status", order: "asc" });
}

// ============================================================================
// GROUPING
// ============================================================================

/**
 * Group tasks by status
 */
export function groupTasksByStatus(tasks: Task[]): Record<TaskStatus, Task[]> {
  const groups: Record<TaskStatus, Task[]> = {
    todo: [],
    "in-progress": [],
    done: [],
  };
  
  tasks.forEach(task => {
    groups[task.status].push(task);
  });
  
  return groups;
}

/**
 * Group tasks by priority
 */
export function groupTasksByPriority(tasks: Task[]): Record<TaskPriority, Task[]> {
  const groups: Record<TaskPriority, Task[]> = {
    high: [],
    medium: [],
    low: [],
  };
  
  tasks.forEach(task => {
    groups[task.priority].push(task);
  });
  
  return groups;
}

/**
 * Group tasks by date
 */
export function groupTasksByDate(tasks: Task[]): Record<string, Task[]> {
  const groups: Record<string, Task[]> = {};
  
  tasks.forEach(task => {
    const dateKey = task.createdAt.toISOString().split("T")[0]; // YYYY-MM-DD
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(task);
  });
  
  return groups;
}

// ============================================================================
// FORMATTING
// ============================================================================

/**
 * Format task title for display
 */
export function formatTaskTitle(title: string, maxLength: number = 50): string {
  if (title.length <= maxLength) {
    return title;
  }
  
  return title.substring(0, maxLength - 3) + "...";
}

/**
 * Format task description for display
 */
export function formatTaskDescription(description?: string, maxLength: number = 100): string {
  if (!description) {
    return "No description";
  }
  
  if (description.length <= maxLength) {
    return description;
  }
  
  return description.substring(0, maxLength - 3) + "...";
}

/**
 * Format date for display
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString();
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSeconds < 60) {
    return "Just now";
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  } else {
    return formatDate(date);
  }
}

// ============================================================================
// STATISTICS
// ============================================================================

/**
 * Calculate completion rate
 */
export function calculateCompletionRate(tasks: Task[]): number {
  if (tasks.length === 0) return 0;
  
  const completedTasks = tasks.filter(task => task.status === "done").length;
  return Math.round((completedTasks / tasks.length) * 100);
}

/**
 * Get task count by status
 */
export function getTaskCountByStatus(tasks: Task[]): Record<TaskStatus, number> {
  const counts = {
    todo: 0,
    "in-progress": 0,
    done: 0,
  };
  
  tasks.forEach(task => {
    counts[task.status]++;
  });
  
  return counts;
}

/**
 * Get task count by priority
 */
export function getTaskCountByPriority(tasks: Task[]): Record<TaskPriority, number> {
  const counts = {
    high: 0,
    medium: 0,
    low: 0,
  };
  
  tasks.forEach(task => {
    counts[task.priority]++;
  });
  
  return counts;
}

/**
 * Get productivity metrics
 */
export function getProductivityMetrics(tasks: Task[]) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  const todayTasks = tasks.filter(task => 
    task.createdAt >= today
  ).length;
  
  const weekTasks = tasks.filter(task => 
    task.createdAt >= weekAgo
  ).length;
  
  const monthTasks = tasks.filter(task => 
    task.createdAt >= monthAgo
  ).length;
  
  const completedToday = tasks.filter(task => 
    task.status === "done" && task.updatedAt >= today
  ).length;
  
  const completedThisWeek = tasks.filter(task => 
    task.status === "done" && task.updatedAt >= weekAgo
  ).length;
  
  const completedThisMonth = tasks.filter(task => 
    task.status === "done" && task.updatedAt >= monthAgo
  ).length;
  
  return {
    created: {
      today: todayTasks,
      thisWeek: weekTasks,
      thisMonth: monthTasks,
    },
    completed: {
      today: completedToday,
      thisWeek: completedThisWeek,
      thisMonth: completedThisMonth,
    },
    completionRate: calculateCompletionRate(tasks),
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Deep clone a task
 */
export function cloneTask(task: Task): Task {
  return {
    ...task,
    createdAt: new Date(task.createdAt),
    updatedAt: new Date(task.updatedAt),
  };
}

/**
 * Check if two tasks are equal
 */
export function tasksEqual(task1: Task, task2: Task): boolean {
  return (
    task1.id === task2.id &&
    task1.title === task2.title &&
    task1.description === task2.description &&
    task1.status === task2.status &&
    task1.priority === task2.priority
  );
}

/**
 * Get a random task from the list
 */
export function getRandomTask(tasks: Task[]): Task | null {
  if (tasks.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * tasks.length);
  return tasks[randomIndex];
}

/**
 * Debounce function for search/filter operations
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}