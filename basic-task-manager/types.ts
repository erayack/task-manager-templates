/**
 * BASIC TEMPLATE: Simple Task Types
 * 
 * Minimal type definitions for a basic task management system.
 * This provides the essential interfaces needed to get started.
 */

// ============================================================================
// CORE TYPES
// ============================================================================

/**
 * Simple task status - easy to understand and implement
 */
export type TaskStatus = "todo" | "in-progress" | "done";

/**
 * Simple priority levels
 */
export type TaskPriority = "high" | "medium" | "low";

// ============================================================================
// MAIN INTERFACES
// ============================================================================

/**
 * Basic Task Interface
 * 
 * CUSTOMIZATION: Add fields as needed:
 * - dueDate?: Date
 * - category?: string
 * - tags?: string[]
 * - assignee?: string
 */
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Task creation data (without auto-generated fields)
 */
export type CreateTaskData = Omit<Task, "id" | "createdAt" | "updatedAt">;

/**
 * Task update data (partial updates allowed)
 */
export type UpdateTaskData = Partial<Omit<Task, "id" | "createdAt">> & {
  updatedAt?: Date;
};

/**
 * Simple task list container
 */
export interface TaskList {
  tasks: Task[];
  totalCount: number;
}

/**
 * Basic filter options
 */
export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  search?: string;
}

/**
 * Simple task statistics
 */
export interface TaskStats {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
  byPriority: Record<TaskPriority, number>;
}

// ============================================================================
// CONFIGURATION TYPES
// ============================================================================

/**
 * Status configuration for UI display
 */
export interface StatusConfig {
  title: string;
  color: string;
  icon?: string;
}

/**
 * Priority configuration for UI display
 */
export interface PriorityConfig {
  title: string;
  color: string;
  weight: number;
  icon?: string;
}

/**
 * Application configuration
 */
export interface AppConfig {
  statuses: Record<TaskStatus, StatusConfig>;
  priorities: Record<TaskPriority, PriorityConfig>;
  ui: {
    pageSize: number;
    autoSave: boolean;
    showCompleted: boolean;
  };
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Sort options for task lists
 */
export type SortField = "title" | "status" | "priority" | "createdAt" | "updatedAt";
export type SortOrder = "asc" | "desc";

export interface SortOptions {
  field: SortField;
  order: SortOrder;
}

/**
 * Pagination options
 */
export interface PaginationOptions {
  page: number;
  pageSize: number;
}

/**
 * Task query options
 */
export interface TaskQuery {
  filters?: TaskFilters;
  sort?: SortOptions;
  pagination?: PaginationOptions;
}