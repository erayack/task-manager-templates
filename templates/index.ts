/**
 * @taskmaster/templates - Entry Point
 * 
 * Main export file for TaskMaster template system.
 * This file provides a clean public API for consuming the templates as a standalone package.
 */

// Core Types Export
export type {
  Task,
  TaskStatus,
  TaskPriority,
  TaskData,
  Subtask,
  TaskMasterSettings,
  GetTasksOptions,
  TaskFilters,
  TaskStatistics,
  TaskUpdate,
  NewTask,
  TaskSummary,
  TaskStatusConfig,
  TaskPriorityConfig,
} from './configs/types.template';

// Configuration Exports
export { 
  STATUS_CONFIG,
  PRIORITY_CONFIG,
} from './configs/config.template';

// Hook Exports
export {
  useTasks,
  useTask,
  useTaskFilters,
  useTaskAnalytics,
} from './hooks/useTasks.template';

// Basic Task Manager Exports
export {
  useSimpleTasks,
  type CreateTaskData,
  type UpdateTaskData,
  type TaskFilters as SimpleTaskFilters,
  type TaskStats,
  type SortOptions,
} from './basic-task-manager/index';

// Component Exports (will be available after components are created with proper imports)
export {
  StatusBadge,
  getStatusBadgeData,
} from './components/atoms/StatusBadge.template';

export {
  PriorityIndicator,
  getPriorityBadgeData,
} from './components/atoms/PriorityIndicator.template';

export {
  TaskListItem,
} from './components/molecules/TaskListItem.template';

// Utility Exports
export {
  validateTask,
  validateSubtask,
} from './utils/validation.template';

// Re-export everything from basic task manager for convenience
export * as BasicTaskManager from './basic-task-manager/index';