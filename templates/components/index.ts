/**
 * @taskmaster/templates - Components Module
 * 
 * Entry point for all template components.
 */

// Atomic Components
export {
  StatusBadge,
  getStatusBadgeData,
} from './atoms/StatusBadge.template';

export {
  PriorityIndicator,
  getPriorityBadgeData,
} from './atoms/PriorityIndicator.template';

// Molecular Components
export {
  TaskListItem,
} from './molecules/TaskListItem.template';