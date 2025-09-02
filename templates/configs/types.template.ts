/**
 * TEMPLATE: Core Task Management Types
 * 
 * This file provides the fundamental TypeScript interfaces for a task management system.
 * Customize these types to match your specific data model and requirements.
 * 
 * CUSTOMIZATION GUIDE:
 * 1. Update TaskStatus values to match your workflow states
 * 2. Modify TaskPriority levels based on your priority system
 * 3. Add custom fields to the Task interface for your specific needs
 * 4. Extend interfaces for additional entity types (projects, teams, etc.)
 */

// ============================================================================
// CORE TYPES - Customize these for your application
// ============================================================================

/**
 * Task Status Types
 * 
 * TEMPLATE CUSTOMIZATION:
 * Replace these with your actual workflow states:
 * - Simple: "todo" | "done"
 * - Agile: "backlog" | "sprint" | "in-progress" | "review" | "done"
 * - Support: "open" | "assigned" | "escalated" | "resolved" | "closed"
 */
export type TaskStatus =
  | "pending"
  | "in-progress" 
  | "review"
  | "done"
  | "deferred"
  | "cancelled";

/**
 * Priority Levels
 * 
 * TEMPLATE CUSTOMIZATION:
 * Adjust based on your priority system:
 * - Simple: "low" | "high"
 * - Extended: "critical" | "high" | "medium" | "low" | "minimal"
 * - Numeric: 1 | 2 | 3 | 4 | 5
 */
export type TaskPriority = "high" | "medium" | "low";

// ============================================================================
// CORE INTERFACES - Extend these for your specific needs
// ============================================================================

/**
 * Base Task Entity
 * 
 * TEMPLATE CUSTOMIZATION:
 * Add fields specific to your domain:
 * - assignee?: string (for multi-user systems)
 * - dueDate?: Date (for deadline tracking)
 * - estimatedHours?: number (for time tracking)
 * - labels?: string[] (for categorization)
 * - projectId?: string (for project grouping)
 */
export interface Task {
  // Core identification
  id: string;
  title: string;
  description: string;
  
  // Status and priority
  status: TaskStatus;
  priority: TaskPriority;
  
  // Optional metadata
  details?: string;
  dependencies?: string[];
  complexityScore?: number;
  subtasks?: Subtask[];
  testStrategy?: string;
  
  // TEMPLATE: Add your custom fields here
  // assignee?: string;
  // dueDate?: Date;
  // estimatedHours?: number;
  // labels?: string[];
  // projectId?: string;
}

/**
 * Subtask Entity
 * 
 * TEMPLATE CUSTOMIZATION:
 * Subtasks can be simplified or extended based on your needs:
 * - Simple: Just id, title, and status
 * - Extended: Include all Task fields in a recursive structure
 */
export interface Subtask {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  dependencies?: Array<number | string>;
  
  // TEMPLATE: Add subtask-specific fields
  // estimatedMinutes?: number;
  // assignee?: string;
}

/**
 * Task Data Container
 * 
 * TEMPLATE CUSTOMIZATION:
 * Extend this to match your data source structure:
 * - Add pagination info for large datasets
 * - Include metadata like project info, user permissions
 * - Add filtering and sorting state
 */
export interface TaskData {
  tasks: Task[];
  currentTag?: string;
  availableTags?: string[];
  
  // TEMPLATE: Add your data container fields
  // totalCount?: number;
  // page?: number;
  // pageSize?: number;
  // filters?: TaskFilters;
  // sortBy?: string;
  // sortOrder?: "asc" | "desc";
}

/**
 * Data Fetching Options
 * 
 * TEMPLATE CUSTOMIZATION:
 * Extend these options based on your API or data source:
 * - Add pagination parameters
 * - Include filter options
 * - Add sorting and search parameters
 */
export interface GetTasksOptions {
  status?: string;
  projectRoot?: string;
  
  // TEMPLATE: Add your query options
  // page?: number;
  // limit?: number;
  // search?: string;
  // assignee?: string;
  // priority?: TaskPriority;
  // sortBy?: keyof Task;
  // sortOrder?: "asc" | "desc";
}

/**
 * Application Settings/Preferences
 * 
 * TEMPLATE CUSTOMIZATION:
 * Add settings specific to your application:
 * - Theme preferences
 * - Default views and filters
 * - Integration configurations
 */
export interface TaskMasterSettings {
  projectRoot: string;
  autoRefresh: boolean;
  showCompletedTasks: boolean;
  maxConcurrentRequests: number;
  
  // TEMPLATE: Add your settings
  // theme?: "light" | "dark" | "auto";
  // defaultView?: "list" | "kanban" | "calendar";
  // defaultFilter?: TaskStatus;
  // notificationsEnabled?: boolean;
  // apiEndpoint?: string;
  // apiKey?: string;
}

// ============================================================================
// COMPUTED TYPES - These derive from your core types
// ============================================================================

/**
 * Task Status Configuration
 * Used for UI display and workflow logic
 */
export interface TaskStatusConfig {
  title: string;
  icon: string; // Replace with your icon system
  color: string; // Replace with your color system
  description: string;
  canTransitionTo?: TaskStatus[];
}

/**
 * Priority Configuration  
 * Used for UI display and sorting logic
 */
export interface TaskPriorityConfig {
  icon: string; // Replace with your icon system
  color: string; // Replace with your color system
  label: string;
  weight: number;
}

/**
 * Task Filters for Search/Filtering
 * 
 * TEMPLATE CUSTOMIZATION:
 * Add filter types relevant to your data model
 */
export interface TaskFilters {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  hasSubtasks?: boolean;
  hasDependencies?: boolean;
  
  // TEMPLATE: Add your filter options
  // assignee?: string[];
  // labels?: string[];
  // projectId?: string[];
  // dueDateRange?: { start: Date; end: Date };
}

/**
 * Task Statistics for Analytics
 * 
 * TEMPLATE CUSTOMIZATION:
 * Add metrics relevant to your use case
 */
export interface TaskStatistics {
  totalTasks: number;
  tasksByStatus: Record<TaskStatus, number>;
  tasksByPriority: Record<TaskPriority, number>;
  completionRate: number;
  
  // TEMPLATE: Add your metrics
  // averageCompletionTime?: number;
  // overdueTasks?: number;
  // tasksByAssignee?: Record<string, number>;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Partial Task for Updates
 */
export type TaskUpdate = Partial<Pick<Task, 
  | "title" 
  | "description" 
  | "status" 
  | "priority" 
  | "details"
  | "dependencies"
  | "complexityScore"
>>;

/**
 * New Task Creation
 */
export type NewTask = Omit<Task, "id"> & {
  id?: string; // Optional for auto-generation
};

/**
 * Task Summary for Lists
 */
export type TaskSummary = Pick<Task, 
  | "id" 
  | "title" 
  | "status" 
  | "priority"
> & {
  subtaskCount?: number;
  dependencyCount?: number;
};