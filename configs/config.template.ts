/**
 * TEMPLATE: Task Management Configuration
 * 
 * This file provides centralized configuration for your task management system.
 * It includes status workflows, priority systems, UI settings, and visual themes.
 * 
 * CUSTOMIZATION GUIDE:
 * 1. Update STATUS_CONFIG to match your workflow states
 * 2. Modify PRIORITY_CONFIG for your priority system  
 * 3. Customize UI_CONFIG for your visual design
 * 4. Add new configuration objects for your specific features
 * 
 * REPLACE: Update the import paths to match your project structure
 */

// TEMPLATE: Replace with your icon and color systems
// For Raycast: import { Icon, Color } from "@raycast/api";
// For React: import your icon library and color constants
// For Web: import your design system tokens
import { Icon, Color } from "@raycast/api";

// TEMPLATE: Replace with your actual types
import { TaskStatus, TaskPriority } from "./types.template";

// ============================================================================
// STATUS CONFIGURATION - Customize for your workflow
// ============================================================================

/**
 * Task Status Configuration
 * 
 * TEMPLATE CUSTOMIZATION EXAMPLES:
 * 
 * Simple Todo App:
 * {
 *   todo: { title: "To Do", icon: "circle", color: "gray" },
 *   done: { title: "Done", icon: "checkmark", color: "green" }
 * }
 * 
 * Bug Tracking System:
 * {
 *   open: { title: "Open", icon: "bug", color: "red" },
 *   assigned: { title: "Assigned", icon: "person", color: "blue" },
 *   resolved: { title: "Resolved", icon: "checkmark", color: "green" }
 * }
 * 
 * Content Management:
 * {
 *   draft: { title: "Draft", icon: "document", color: "gray" },
 *   review: { title: "In Review", icon: "eye", color: "orange" },
 *   published: { title: "Published", icon: "globe", color: "green" }
 * }
 */
export const STATUS_CONFIG: Record<
  TaskStatus,
  { 
    title: string; 
    icon: Icon; 
    color: Color; 
    description: string;
    /** Optional: Define which statuses this status can transition to */
    canTransitionTo?: TaskStatus[];
  }
> = {
  pending: {
    title: "Pending",
    icon: Icon.Circle,
    color: Color.PrimaryText,
    description: "Tasks ready to start",
    canTransitionTo: ["in-progress", "cancelled"],
  },
  "in-progress": {
    title: "In Progress",
    icon: Icon.Clock,
    color: Color.Blue,
    description: "Currently being worked on",
    canTransitionTo: ["review", "done", "deferred"],
  },
  review: {
    title: "Review",
    icon: Icon.Eye,
    color: Color.Orange,
    description: "Awaiting review and approval",
    canTransitionTo: ["done", "in-progress"],
  },
  done: {
    title: "Done",
    icon: Icon.CheckCircle,
    color: Color.Green,
    description: "Completed tasks",
    canTransitionTo: ["in-progress"], // Allow reopening
  },
  deferred: {
    title: "Deferred",
    icon: Icon.Pause,
    color: Color.Yellow,
    description: "Postponed for later",
    canTransitionTo: ["pending", "cancelled"],
  },
  cancelled: {
    title: "Cancelled",
    icon: Icon.XMarkCircle,
    color: Color.Red,
    description: "Cancelled or abandoned",
    canTransitionTo: ["pending"], // Allow reactivation
  },
};

// ============================================================================
// PRIORITY CONFIGURATION - Customize for your priority system
// ============================================================================

/**
 * Priority Configuration
 * 
 * TEMPLATE CUSTOMIZATION EXAMPLES:
 * 
 * Simple Priority:
 * {
 *   low: { icon: "arrow-down", color: "green", label: "Low", weight: 1 },
 *   high: { icon: "arrow-up", color: "red", label: "High", weight: 2 }
 * }
 * 
 * MoSCoW Priority:
 * {
 *   must: { icon: "exclamation", color: "red", label: "Must Have", weight: 4 },
 *   should: { icon: "arrow-up", color: "orange", label: "Should Have", weight: 3 },
 *   could: { icon: "minus", color: "blue", label: "Could Have", weight: 2 },
 *   wont: { icon: "arrow-down", color: "gray", label: "Won't Have", weight: 1 }
 * }
 */
export const PRIORITY_CONFIG: Record<
  TaskPriority,
  { 
    icon: Icon; 
    color: Color; 
    label: string; 
    weight: number;
    /** Optional: Description for tooltips */
    description?: string;
  }
> = {
  high: {
    icon: Icon.ExclamationMark,
    color: Color.Red,
    label: "High Priority",
    weight: 3,
    description: "Urgent tasks requiring immediate attention",
  },
  medium: {
    icon: Icon.Minus,
    color: Color.Orange,
    label: "Medium Priority",
    weight: 2,
    description: "Important tasks with moderate urgency",
  },
  low: {
    icon: Icon.ChevronDown,
    color: Color.PrimaryText,
    label: "Low Priority",
    weight: 1,
    description: "Tasks that can be done when time permits",
  },
};

// ============================================================================
// UI CONFIGURATION - Customize visual settings
// ============================================================================

/**
 * User Interface Configuration
 * 
 * TEMPLATE CUSTOMIZATION:
 * Adjust these values based on your UI framework and design requirements
 */
export const UI_CONFIG = {
  // Text length limits
  MAX_DESCRIPTION_LENGTH: 150,
  MAX_TITLE_LENGTH: 80,
  MAX_SUBTITLE_LENGTH: 100,
  
  // Interaction timing
  DEBOUNCE_DELAY: 300,
  ANIMATION_DURATION: 200,
  TOAST_DURATION: 3000,
  
  // Pagination
  DEFAULT_PAGE_SIZE: 50,
  MAX_PAGE_SIZE: 100,
  
  // Search
  MIN_SEARCH_LENGTH: 2,
  SEARCH_DEBOUNCE: 500,
  
  // Visual
  ICON_SIZE: {
    small: 16,
    medium: 24,
    large: 32,
  },
  
  // TEMPLATE: Add your UI constants
  // BORDER_RADIUS: 8,
  // SPACING: {
  //   xs: 4,
  //   sm: 8,
  //   md: 16,
  //   lg: 24,
  //   xl: 32,
  // },
} as const;

// ============================================================================
// WORKFLOW CONFIGURATION - Define business rules
// ============================================================================

/**
 * Workflow Rules Configuration
 * 
 * TEMPLATE CUSTOMIZATION:
 * Define your business logic and workflow rules
 */
export const WORKFLOW_CONFIG = {
  // Auto-assignment rules
  AUTO_STATUS_TRANSITIONS: {
    // When all subtasks are done, mark parent as done
    COMPLETE_PARENT_WHEN_SUBTASKS_DONE: true,
    // When all dependencies are done, auto-move to in-progress
    AUTO_START_WHEN_DEPENDENCIES_READY: false,
  },
  
  // Validation rules
  VALIDATION: {
    // Require description for high priority tasks
    REQUIRE_DESCRIPTION_FOR_HIGH_PRIORITY: true,
    // Minimum title length
    MIN_TITLE_LENGTH: 3,
    // Maximum dependency depth
    MAX_DEPENDENCY_DEPTH: 5,
  },
  
  // Notification triggers
  NOTIFICATIONS: {
    // Notify when task is assigned
    ON_ASSIGNMENT: true,
    // Notify when task status changes
    ON_STATUS_CHANGE: true,
    // Notify when due date approaches
    ON_DUE_DATE_APPROACHING: true,
  },
  
  // TEMPLATE: Add your workflow rules
  // APPROVAL_REQUIRED_FOR_STATUSES: ["review"],
  // AUTO_ARCHIVE_AFTER_DAYS: 30,
  // REQUIRE_ESTIMATION_FOR_STATUSES: ["in-progress"],
} as const;

// ============================================================================
// INTEGRATION CONFIGURATION - External system settings
// ============================================================================

/**
 * Integration Configuration
 * 
 * TEMPLATE CUSTOMIZATION:
 * Configure external systems and data sources
 */
export const INTEGRATION_CONFIG = {
  // Cache settings
  CACHE: {
    TTL: 30000, // 30 seconds
    STALE_WHILE_REVALIDATE: 60000, // 1 minute
    MAX_SIZE: 1000, // Maximum cached items
  },
  
  // API configuration
  API: {
    TIMEOUT: 10000, // 10 seconds
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000, // 1 second
  },
  
  // File system (if applicable)
  FILESYSTEM: {
    TASKMASTER_DIR: ".taskmaster",
    TASKS_DIR: "tasks", 
    TASKS_FILE: "tasks.json",
    BACKUP_DIR: "backups",
    MAX_BACKUPS: 5,
  },
  
  // TEMPLATE: Add your integration settings
  // DATABASE: {
  //   CONNECTION_TIMEOUT: 5000,
  //   QUERY_TIMEOUT: 30000,
  //   POOL_SIZE: 10,
  // },
  // EXTERNAL_API: {
  //   BASE_URL: "https://api.example.com",
  //   API_VERSION: "v1",
  //   RATE_LIMIT: 100, // requests per minute
  // },
} as const;

// ============================================================================
// KEYBOARD SHORTCUTS - Define hotkeys
// ============================================================================

/**
 * Keyboard Shortcuts Configuration
 * 
 * TEMPLATE CUSTOMIZATION:
 * Define keyboard shortcuts for your application
 * Adjust based on your UI framework (Raycast, Electron, Web, etc.)
 */
export const SHORTCUTS = {
  // Navigation
  SHOW_DETAIL: "cmd+d",
  SHOW_KANBAN: "cmd+b", 
  SHOW_LIST: "cmd+l",
  SHOW_SUBTASKS: "cmd+s",
  GO_BACK: "cmd+b",
  
  // Actions
  DELETE_TASK: "cmd+shift+backspace",
  CREATE_TASK: "cmd+n",
  EDIT_TASK: "cmd+e",
  DUPLICATE_TASK: "cmd+shift+d",
  
  // Search and filter
  SEARCH: "cmd+f",
  CLEAR_FILTERS: "cmd+shift+f",
  
  // Status changes
  MARK_DONE: "cmd+enter",
  MARK_IN_PROGRESS: "cmd+shift+enter",
  
  // TEMPLATE: Add your shortcuts
  // TOGGLE_SIDEBAR: "cmd+\\",
  // QUICK_ADD: "cmd+k",
  // FOCUS_SEARCH: "/",
} as const;

// ============================================================================
// HELPER FUNCTIONS - Configuration utilities
// ============================================================================

/**
 * Get all available statuses for dropdowns and filters
 */
export function getAllStatuses() {
  return Object.entries(STATUS_CONFIG).map(([status, config]) => ({
    value: status as TaskStatus,
    ...config,
  }));
}

/**
 * Get all available priorities for dropdowns and filters
 */
export function getAllPriorities() {
  return Object.entries(PRIORITY_CONFIG).map(([priority, config]) => ({
    value: priority as TaskPriority,
    ...config,
  }));
}

/**
 * Get valid status transitions for a given status
 */
export function getValidTransitions(currentStatus: TaskStatus): TaskStatus[] {
  return STATUS_CONFIG[currentStatus]?.canTransitionTo || [];
}

/**
 * Check if a status transition is valid
 */
export function isValidTransition(from: TaskStatus, to: TaskStatus): boolean {
  const validTransitions = getValidTransitions(from);
  return validTransitions.includes(to);
}

/**
 * Get status configuration by status value
 */
export function getStatusConfig(status: TaskStatus) {
  return STATUS_CONFIG[status];
}

/**
 * Get priority configuration by priority value
 */
export function getPriorityConfig(priority: TaskPriority) {
  return PRIORITY_CONFIG[priority];
}

// ============================================================================
// LEGACY ALIASES - For backward compatibility
// ============================================================================

/**
 * @deprecated Use STATUS_CONFIG directly
 */
export const KANBAN_COLUMNS = STATUS_CONFIG;

/**
 * Status order for sorting and display
 */
export const STATUS_ORDER: TaskStatus[] = [
  "pending",
  "in-progress", 
  "review",
  "done",
  "deferred",
  "cancelled",
];

/**
 * Priority order for sorting (highest to lowest)
 */
export const PRIORITY_ORDER: TaskPriority[] = ["high", "medium", "low"];