/**
 * TEMPLATE: Task Validation Utilities
 * 
 * Comprehensive validation functions for task management systems.
 * These utilities ensure data integrity and provide user-friendly error messages.
 * 
 * CUSTOMIZATION GUIDE:
 * 1. Update validation rules to match your business requirements
 * 2. Modify error messages for your user experience
 * 3. Add domain-specific validation logic
 * 4. Customize ID formats and constraints
 * 
 * FEATURES:
 * - Type-safe validation with detailed error reporting
 * - Configurable validation rules
 * - Business logic validation (dependencies, workflows)
 * - Batch validation for multiple tasks
 */

import { Task, TaskStatus, TaskPriority, Subtask } from "../configs/types.template";

// ============================================================================
// VALIDATION INTERFACES
// ============================================================================

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ValidationOptions {
  /** Require description for certain priorities */
  requireDescriptionForPriority?: TaskPriority[];
  /** Maximum title length */
  maxTitleLength?: number;
  /** Minimum title length */
  minTitleLength?: number;
  /** Maximum description length */
  maxDescriptionLength?: number;
  /** Valid ID format pattern */
  idPattern?: RegExp;
  /** Check for circular dependencies */
  checkCircularDependencies?: boolean;
  /** Validate against existing tasks */
  existingTasks?: Task[];
  /** Allow empty subtasks */
  allowEmptySubtasks?: boolean;
}

export interface BatchValidationResult {
  overallValid: boolean;
  results: Record<string, ValidationResult>;
  globalErrors: string[];
  duplicateIds: string[];
  circularDependencies: string[][];
}

// ============================================================================
// CORE VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validate a single task
 * 
 * TEMPLATE CUSTOMIZATION:
 * Add validation rules specific to your domain:
 * - Due date validation
 * - Assignee validation
 * - Project-specific constraints
 * - Custom field validation
 */
export function validateTask(
  task: Task, 
  options: ValidationOptions = {}
): ValidationResult {
  const {
    requireDescriptionForPriority = ["high"],
    maxTitleLength = 100,
    minTitleLength = 1,
    maxDescriptionLength = 1000,
    idPattern = /^[1-9]\d*(\.[1-9]\d*)*$/,
    allowEmptySubtasks = false,
    existingTasks = [],
  } = options;

  const errors: string[] = [];
  const warnings: string[] = [];

  // ============================================================================
  // BASIC FIELD VALIDATION
  // ============================================================================

  // ID validation
  if (!task.id || typeof task.id !== "string") {
    errors.push("Task ID is required and must be a string");
  } else if (!idPattern.test(task.id)) {
    errors.push(`Task ID "${task.id}" does not match required format`);
  }

  // Title validation
  if (!task.title || typeof task.title !== "string") {
    errors.push("Task title is required and must be a string");
  } else {
    if (task.title.trim().length < minTitleLength) {
      errors.push(`Task title must be at least ${minTitleLength} character(s) long`);
    }
    if (task.title.length > maxTitleLength) {
      errors.push(`Task title must not exceed ${maxTitleLength} characters`);
    }
    if (task.title.trim() !== task.title) {
      warnings.push("Task title has leading or trailing whitespace");
    }
  }

  // Description validation
  if (task.description !== undefined) {
    if (typeof task.description !== "string") {
      errors.push("Task description must be a string");
    } else if (task.description.length > maxDescriptionLength) {
      errors.push(`Task description must not exceed ${maxDescriptionLength} characters`);
    }
  }

  // Status validation
  const validStatuses: TaskStatus[] = ["pending", "in-progress", "review", "done", "deferred", "cancelled"];
  if (!validStatuses.includes(task.status)) {
    errors.push(`Invalid task status: ${task.status}`);
  }

  // Priority validation
  const validPriorities: TaskPriority[] = ["high", "medium", "low"];
  if (!validPriorities.includes(task.priority)) {
    errors.push(`Invalid task priority: ${task.priority}`);
  }

  // ============================================================================
  // BUSINESS RULE VALIDATION
  // ============================================================================

  // Priority-based description requirement
  if (requireDescriptionForPriority.includes(task.priority)) {
    if (!task.description || task.description.trim().length === 0) {
      errors.push(`${task.priority} priority tasks must have a description`);
    }
  }

  // Complexity score validation
  if (task.complexityScore !== undefined) {
    if (typeof task.complexityScore !== "number" || 
        task.complexityScore < 1 || 
        task.complexityScore > 10) {
      errors.push("Complexity score must be a number between 1 and 10");
    }
  }

  // ============================================================================
  // DEPENDENCY VALIDATION
  // ============================================================================

  if (task.dependencies) {
    if (!Array.isArray(task.dependencies)) {
      errors.push("Task dependencies must be an array");
    } else {
      // Check for self-dependency
      if (task.dependencies.includes(task.id)) {
        errors.push("Task cannot depend on itself");
      }

      // Check for invalid dependency IDs
      task.dependencies.forEach(depId => {
        if (!idPattern.test(depId)) {
          errors.push(`Invalid dependency ID format: ${depId}`);
        }
      });

      // Check if dependencies exist (when existing tasks provided)
      if (existingTasks.length > 0) {
        const existingIds = new Set(existingTasks.map(t => t.id));
        const missingDeps = task.dependencies.filter(depId => !existingIds.has(depId));
        
        if (missingDeps.length > 0) {
          errors.push(`Missing dependency tasks: ${missingDeps.join(", ")}`);
        }
      }

      // Check for duplicate dependencies
      const uniqueDeps = new Set(task.dependencies);
      if (uniqueDeps.size !== task.dependencies.length) {
        warnings.push("Task has duplicate dependencies");
      }
    }
  }

  // ============================================================================
  // SUBTASK VALIDATION
  // ============================================================================

  if (task.subtasks) {
    if (!Array.isArray(task.subtasks)) {
      errors.push("Task subtasks must be an array");
    } else {
      if (!allowEmptySubtasks && task.subtasks.length === 0) {
        warnings.push("Task has empty subtasks array");
      }

      // Validate each subtask
      task.subtasks.forEach((subtask, index) => {
        const subtaskErrors = validateSubtask(subtask, task.id, index);
        errors.push(...subtaskErrors.map(err => `Subtask ${index + 1}: ${err}`));
      });

      // Check for duplicate subtask IDs
      const subtaskIds = task.subtasks.map(st => st.id);
      const uniqueSubtaskIds = new Set(subtaskIds);
      if (uniqueSubtaskIds.size !== subtaskIds.length) {
        errors.push("Task has duplicate subtask IDs");
      }
    }
  }

  // ============================================================================
  // WORKFLOW VALIDATION
  // ============================================================================

  // Check if task can be in current status based on dependencies
  if (task.status === "in-progress" && task.dependencies && existingTasks.length > 0) {
    const blockedDependencies = task.dependencies.filter(depId => {
      const depTask = existingTasks.find(t => t.id === depId);
      return depTask && depTask.status !== "done";
    });

    if (blockedDependencies.length > 0) {
      warnings.push(`Task is in progress but has unresolved dependencies: ${blockedDependencies.join(", ")}`);
    }
  }

  // Check if done tasks have incomplete subtasks
  if (task.status === "done" && task.subtasks) {
    const incompleteSubtasks = task.subtasks.filter(st => st.status !== "done");
    if (incompleteSubtasks.length > 0) {
      warnings.push(`Task is marked done but has ${incompleteSubtasks.length} incomplete subtask(s)`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate a subtask
 */
export function validateSubtask(
  subtask: Subtask, 
  parentTaskId: string, 
  index: number
): string[] {
  const errors: string[] = [];

  // ID validation (must be numeric for subtasks)
  if (typeof subtask.id !== "number" || subtask.id < 1) {
    errors.push("Subtask ID must be a positive number");
  }

  // Title validation
  if (!subtask.title || typeof subtask.title !== "string") {
    errors.push("Subtask title is required and must be a string");
  } else if (subtask.title.trim().length === 0) {
    errors.push("Subtask title cannot be empty");
  }

  // Status validation
  const validStatuses: TaskStatus[] = ["pending", "in-progress", "review", "done", "deferred", "cancelled"];
  if (!validStatuses.includes(subtask.status)) {
    errors.push(`Invalid subtask status: ${subtask.status}`);
  }

  // Dependencies validation
  if (subtask.dependencies) {
    if (!Array.isArray(subtask.dependencies)) {
      errors.push("Subtask dependencies must be an array");
    } else {
      // Check for self-dependency
      if (subtask.dependencies.includes(subtask.id) || 
          subtask.dependencies.includes(parentTaskId)) {
        errors.push("Subtask cannot depend on itself or its parent task");
      }
    }
  }

  return errors;
}

// ============================================================================
// BATCH VALIDATION
// ============================================================================

/**
 * Validate multiple tasks and check for global constraints
 */
export function validateTaskBatch(
  tasks: Task[], 
  options: ValidationOptions = {}
): BatchValidationResult {
  const results: Record<string, ValidationResult> = {};
  const globalErrors: string[] = [];
  const duplicateIds: string[] = [];
  const circularDependencies: string[][] = [];

  // Individual task validation
  tasks.forEach(task => {
    results[task.id] = validateTask(task, { ...options, existingTasks: tasks });
  });

  // Check for duplicate IDs
  const idCounts = new Map<string, number>();
  tasks.forEach(task => {
    idCounts.set(task.id, (idCounts.get(task.id) || 0) + 1);
  });

  idCounts.forEach((count, id) => {
    if (count > 1) {
      duplicateIds.push(id);
      globalErrors.push(`Duplicate task ID found: ${id} (appears ${count} times)`);
    }
  });

  // Check for circular dependencies
  if (options.checkCircularDependencies !== false) {
    const cycles = findCircularDependencies(tasks);
    circularDependencies.push(...cycles);
    
    cycles.forEach(cycle => {
      globalErrors.push(`Circular dependency detected: ${cycle.join(" → ")} → ${cycle[0]}`);
    });
  }

  // Check overall validity
  const hasIndividualErrors = Object.values(results).some(result => !result.isValid);
  const overallValid = !hasIndividualErrors && globalErrors.length === 0;

  return {
    overallValid,
    results,
    globalErrors,
    duplicateIds,
    circularDependencies,
  };
}

// ============================================================================
// DEPENDENCY ANALYSIS
// ============================================================================

/**
 * Find circular dependencies in task list
 */
export function findCircularDependencies(tasks: Task[]): string[][] {
  const taskMap = new Map(tasks.map(task => [task.id, task]));
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  const cycles: string[][] = [];

  function dfs(taskId: string, path: string[]): void {
    if (recursionStack.has(taskId)) {
      // Found a cycle
      const cycleStart = path.indexOf(taskId);
      if (cycleStart !== -1) {
        cycles.push(path.slice(cycleStart));
      }
      return;
    }

    if (visited.has(taskId)) {
      return;
    }

    visited.add(taskId);
    recursionStack.add(taskId);

    const task = taskMap.get(taskId);
    if (task && task.dependencies) {
      task.dependencies.forEach(depId => {
        if (taskMap.has(depId)) {
          dfs(depId, [...path, depId]);
        }
      });
    }

    recursionStack.delete(taskId);
  }

  tasks.forEach(task => {
    if (!visited.has(task.id)) {
      dfs(task.id, [task.id]);
    }
  });

  return cycles;
}

/**
 * Check if adding a dependency would create a circular dependency
 */
export function wouldCreateCircularDependency(
  tasks: Task[],
  taskId: string,
  newDependencyId: string
): boolean {
  // Create a temporary task list with the new dependency
  const modifiedTasks = tasks.map(task => 
    task.id === taskId 
      ? { ...task, dependencies: [...(task.dependencies || []), newDependencyId] }
      : task
  );

  const cycles = findCircularDependencies(modifiedTasks);
  return cycles.length > 0;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get validation summary for display
 */
export function getValidationSummary(result: ValidationResult): string {
  if (result.isValid) {
    return result.warnings.length > 0 
      ? `Valid with ${result.warnings.length} warning(s)`
      : "Valid";
  }
  
  return `Invalid: ${result.errors.length} error(s)${
    result.warnings.length > 0 ? `, ${result.warnings.length} warning(s)` : ""
  }`;
}

/**
 * Filter valid tasks from a list
 */
export function getValidTasks(
  tasks: Task[], 
  options: ValidationOptions = {}
): Task[] {
  return tasks.filter(task => validateTask(task, options).isValid);
}

/**
 * Filter invalid tasks from a list
 */
export function getInvalidTasks(
  tasks: Task[], 
  options: ValidationOptions = {}
): { task: Task; validation: ValidationResult }[] {
  return tasks
    .map(task => ({ task, validation: validateTask(task, options) }))
    .filter(({ validation }) => !validation.isValid);
}

/**
 * Check if a task ID is valid format
 */
export function isValidTaskId(id: string): boolean {
  const idPattern = /^[1-9]\d*(\.[1-9]\d*)*$/;
  return idPattern.test(id);
}

/**
 * Generate a valid task ID
 * TEMPLATE: Customize this based on your ID generation strategy
 */
export function generateTaskId(existingTasks: Task[]): string {
  const existingIds = existingTasks.map(t => t.id).sort();
  
  // Simple incremental ID generation
  let nextId = 1;
  while (existingIds.includes(nextId.toString())) {
    nextId++;
  }
  
  return nextId.toString();
}

/**
 * Sanitize task data for safe processing
 */
export function sanitizeTask(task: Partial<Task>): Partial<Task> {
  return {
    ...task,
    title: task.title?.trim(),
    description: task.description?.trim(),
    dependencies: Array.isArray(task.dependencies) 
      ? [...new Set(task.dependencies.filter(Boolean))] 
      : undefined,
  };
}