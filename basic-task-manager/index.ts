/**
 * @taskmaster/templates - Basic Task Manager Module
 * 
 * Entry point for the basic task manager template.
 * Contains simplified task management with essential features only.
 */

// Types
export type {
  Task,
  CreateTaskData,
  UpdateTaskData,
  TaskFilters,
  TaskStats,
  SortOptions,
  TaskStatus,
  TaskPriority,
} from './types';

// Configuration
export { CONFIG, DEFAULT_SORT } from './config';

// Hooks
export { useSimpleTasks } from './hooks/useSimpleTasks';

// Utilities
export {
  generateId,
  sortTasks,
  filterTasks,
  validateTask,
  calculateStats,
} from './utils/helpers';

export {
  loadTasks,
  saveTasks,
  STORAGE_KEY,
} from './utils/storage';