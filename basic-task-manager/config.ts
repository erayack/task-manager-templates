/**
 * BASIC TEMPLATE: Simple Task Management Configuration
 * 
 * Basic configuration for a simple task management system.
 * Customize these values to match your application's needs.
 */

import { AppConfig } from "./types";

// ============================================================================
// BASIC CONFIGURATION
// ============================================================================

export const CONFIG: AppConfig = {
  // Status definitions
  statuses: {
    todo: {
      title: "To Do",
      color: "#6B7280", // Gray
      icon: "circle",
    },
    "in-progress": {
      title: "In Progress", 
      color: "#3B82F6", // Blue
      icon: "clock",
    },
    done: {
      title: "Done",
      color: "#10B981", // Green
      icon: "check-circle",
    },
  },

  // Priority definitions
  priorities: {
    high: {
      title: "High Priority",
      color: "#EF4444", // Red
      weight: 3,
      icon: "exclamation",
    },
    medium: {
      title: "Medium Priority",
      color: "#F59E0B", // Amber
      weight: 2,
      icon: "minus",
    },
    low: {
      title: "Low Priority",
      color: "#6B7280", // Gray
      weight: 1,
      icon: "chevron-down",
    },
  },

  // UI configuration
  ui: {
    pageSize: 50,
    autoSave: true,
    showCompleted: true,
  },
};

// ============================================================================
// DERIVED CONSTANTS
// ============================================================================

/**
 * Status order for display and sorting
 */
export const STATUS_ORDER = ["todo", "in-progress", "done"] as const;

/**
 * Priority order for sorting (highest to lowest)
 */
export const PRIORITY_ORDER = ["high", "medium", "low"] as const;

/**
 * Default sort configuration
 */
export const DEFAULT_SORT = {
  field: "createdAt" as const,
  order: "desc" as const,
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get status configuration
 */
export function getStatusConfig(status: string) {
  return CONFIG.statuses[status as keyof typeof CONFIG.statuses];
}

/**
 * Get priority configuration
 */
export function getPriorityConfig(priority: string) {
  return CONFIG.priorities[priority as keyof typeof CONFIG.priorities];
}

/**
 * Get all available statuses
 */
export function getAvailableStatuses() {
  return Object.keys(CONFIG.statuses);
}

/**
 * Get all available priorities
 */
export function getAvailablePriorities() {
  return Object.keys(CONFIG.priorities);
}

/**
 * Check if status is valid
 */
export function isValidStatus(status: string): boolean {
  return status in CONFIG.statuses;
}

/**
 * Check if priority is valid
 */
export function isValidPriority(priority: string): boolean {
  return priority in CONFIG.priorities;
}

// ============================================================================
// CUSTOMIZATION EXAMPLES
// ============================================================================

/*
// Example: Custom Status Workflow
export const CUSTOM_STATUSES = {
  backlog: { title: "Backlog", color: "#6B7280" },
  ready: { title: "Ready", color: "#3B82F6" },
  doing: { title: "Doing", color: "#F59E0B" },
  review: { title: "Review", color: "#8B5CF6" },
  done: { title: "Done", color: "#10B981" },
  archived: { title: "Archived", color: "#374151" },
};

// Example: Extended Priority System
export const EXTENDED_PRIORITIES = {
  critical: { title: "Critical", color: "#DC2626", weight: 5 },
  high: { title: "High", color: "#EF4444", weight: 4 },
  medium: { title: "Medium", color: "#F59E0B", weight: 3 },
  low: { title: "Low", color: "#10B981", weight: 2 },
  minimal: { title: "Minimal", color: "#6B7280", weight: 1 },
};

// Example: Department-specific Configuration
export const DEPARTMENT_CONFIG = {
  development: {
    statuses: {
      todo: { title: "Backlog", color: "#6B7280" },
      "in-progress": { title: "In Development", color: "#3B82F6" },
      done: { title: "Deployed", color: "#10B981" },
    },
    categories: ["bug", "feature", "refactor", "docs"],
  },
  design: {
    statuses: {
      todo: { title: "Brief", color: "#6B7280" },
      "in-progress": { title: "Designing", color: "#8B5CF6" },
      done: { title: "Approved", color: "#10B981" },
    },
    categories: ["wireframe", "mockup", "prototype", "assets"],
  },
};
*/