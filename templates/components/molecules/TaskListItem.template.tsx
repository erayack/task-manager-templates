/**
 * TEMPLATE: Task List Item Molecular Component
 * 
 * A reusable task list item component that combines multiple atomic components.
 * This molecular component provides consistent task display across different views.
 * 
 * CUSTOMIZATION GUIDE:
 * 1. Update imports to match your UI framework
 * 2. Modify the component structure for your design system
 * 3. Add or remove features based on your requirements
 * 4. Customize the action handling for your application
 * 
 * FEATURES:
 * - Configurable display options
 * - Memoized for performance
 * - Flexible action handling
 * - Multiple variants for different use cases
 */

// TEMPLATE: Replace with your UI framework imports
import React, { useMemo, useCallback } from "react";
import { List, ActionPanel, Action, Icon } from "@raycast/api";

// TEMPLATE: Replace with your types and components
import { Task } from "../types";
import { StatusBadge, getStatusBadgeData } from "../atoms/StatusBadge";
import { PriorityIndicator, getPriorityBadgeData } from "../atoms/PriorityIndicator";
import { formatTaskTitle, formatTaskId, generateTaskSubtitle } from "../utils/formatters";

// ============================================================================
// COMPONENT INTERFACES
// ============================================================================

interface TaskListItemProps {
  task: Task;
  /** All tasks for dependency resolution */
  allTasks?: Task[];
  /** Show detailed task information */
  onShowDetail?: (task: Task) => void;
  /** Callback when task is updated */
  onTaskUpdate?: () => void;
  /** Callback when task is deleted */
  onDeleteTask?: (taskId: string) => void;
  /** Callback when task status changes */
  onStatusChange?: (taskId: string, newStatus: string) => void;
  
  // Display options
  displayOptions?: {
    showSubtitle?: boolean;
    showAccessories?: boolean;
    showComplexity?: boolean;
    showMetadata?: boolean;
    maxTitleLength?: number;
    compactMode?: boolean;
  };
  
  // Action options
  actionOptions?: {
    showDeleteAction?: boolean;
    showNavigationActions?: boolean;
    showViewActions?: boolean;
    showStatusActions?: boolean;
    showCopyActions?: boolean;
    allowInlineEdit?: boolean;
  };
  
  // Style options
  styleOptions?: {
    highlightPriority?: boolean;
    showStatusColor?: boolean;
    variant?: "default" | "compact" | "detailed" | "minimal";
  };
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Task List Item Component
 * 
 * TEMPLATE: This implementation is for Raycast List.Item
 * Adapt for your UI framework:
 * 
 * React Example:
 * return (
 *   <div className={`task-item ${variant} ${highlightPriority ? 'priority-' + task.priority : ''}`}>
 *     <div className="task-header">
 *       <h3 className="task-title">{title}</h3>
 *       <div className="task-badges">
 *         <StatusBadge status={task.status} />
 *         <PriorityIndicator priority={task.priority} />
 *       </div>
 *     </div>
 *     {showSubtitle && <p className="task-subtitle">{subtitle}</p>}
 *     <TaskActions task={task} {...actionOptions} />
 *   </div>
 * );
 */
export const TaskListItem = React.memo(function TaskListItem({
  task,
  allTasks = [],
  onShowDetail,
  onTaskUpdate,
  onDeleteTask,
  onStatusChange,
  displayOptions = {},
  actionOptions = {},
  styleOptions = {},
}: TaskListItemProps) {
  const {
    showSubtitle = true,
    showAccessories = true,
    showComplexity = true,
    showMetadata = true,
    maxTitleLength = 80,
    compactMode = false,
  } = displayOptions;

  const {
    showDeleteAction = true,
    showNavigationActions = true,
    showViewActions = true,
    showStatusActions = true,
    showCopyActions = true,
    allowInlineEdit = false,
  } = actionOptions;

  const {
    highlightPriority = false,
    showStatusColor = true,
    variant = "default",
  } = styleOptions;

  // ============================================================================
  // MEMOIZED VALUES
  // ============================================================================

  // Memoized title with formatting and truncation
  const title = useMemo(() => {
    return formatTaskTitle(task.title, maxTitleLength);
  }, [task.title, maxTitleLength]);

  // Memoized subtitle with task metadata
  const subtitle = useMemo(() => {
    if (!showSubtitle) return undefined;
    
    if (compactMode) {
      return formatTaskId(task.id);
    }
    
    return generateTaskSubtitle(task, { 
      includeComplexity: showComplexity,
      includeMetadata: showMetadata,
    });
  }, [task, showSubtitle, compactMode, showComplexity, showMetadata]);

  // Memoized accessories array
  const accessories = useMemo(() => {
    if (!showAccessories) return [];
    
    const accessoryList = [];

    // Priority indicator (always show for high priority)
    if (task.priority === 'high' || !compactMode) {
      const priorityBadge = getPriorityBadgeData(task.priority, {
        showIcon: true,
        variant: highlightPriority ? "prominent" : "subtle",
      });
      if (priorityBadge) accessoryList.push(priorityBadge);
    }

    // Status indicator
    if (showStatusColor) {
      const statusBadge = getStatusBadgeData(task.status, {
        showIcon: true,
        showText: compactMode ? false : variant === "detailed",
      });
      if (statusBadge) accessoryList.push(statusBadge);
    }

    // Complexity score
    if (showComplexity && task.complexityScore && !compactMode) {
      accessoryList.push({
        text: `${task.complexityScore}/10`,
        icon: Icon.BarChart,
        tooltip: `Complexity Score: ${task.complexityScore}/10`,
      });
    }

    // Metadata badges
    if (showMetadata && !compactMode) {
      // Subtask count
      if (task.subtasks && task.subtasks.length > 0) {
        const completed = task.subtasks.filter(st => st.status === 'done').length;
        accessoryList.push({
          text: `${completed}/${task.subtasks.length}`,
          icon: Icon.List,
          tooltip: `${completed} of ${task.subtasks.length} subtasks completed`,
        });
      }

      // Dependency count
      if (task.dependencies && task.dependencies.length > 0) {
        const resolvedDeps = task.dependencies.filter(depId => 
          allTasks.find(t => t.id === depId && t.status === 'done')
        ).length;
        
        accessoryList.push({
          text: `${resolvedDeps}/${task.dependencies.length}`,
          icon: Icon.Link,
          tooltip: `${resolvedDeps} of ${task.dependencies.length} dependencies resolved`,
        });
      }
    }

    return accessoryList;
  }, [task, allTasks, showAccessories, showComplexity, showMetadata, compactMode, variant, highlightPriority, showStatusColor]);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleShowDetail = useCallback(() => {
    onShowDetail?.(task);
  }, [onShowDetail, task]);

  const handleDelete = useCallback(() => {
    onDeleteTask?.(task.id);
  }, [onDeleteTask, task.id]);

  const handleStatusChange = useCallback((newStatus: string) => {
    onStatusChange?.(task.id, newStatus);
  }, [onStatusChange, task.id]);

  // ============================================================================
  // ACTIONS COMPONENT
  // ============================================================================

  const renderActions = useCallback(() => {
    if (!showNavigationActions && !showViewActions && !showDeleteAction && !showStatusActions && !showCopyActions) {
      return null;
    }

    return (
      <ActionPanel>
        {/* Primary actions */}
        {showViewActions && onShowDetail && (
          <Action
            title="View Details"
            icon={Icon.Eye}
            onAction={handleShowDetail}
            shortcut={{ modifiers: ["cmd"], key: "d" }}
          />
        )}

        {/* Status change actions */}
        {showStatusActions && onStatusChange && (
          <ActionPanel.Submenu title="Change Status" icon={Icon.Pencil}>
            {getAvailableStatuses(task.status).map(status => (
              <Action
                key={status.value}
                title={status.title}
                icon={status.icon}
                onAction={() => handleStatusChange(status.value)}
              />
            ))}
          </ActionPanel.Submenu>
        )}

        {/* Copy actions */}
        {showCopyActions && (
          <ActionPanel.Submenu title="Copy" icon={Icon.Clipboard}>
            <Action.CopyToClipboard
              title="Task Name (with Id)"
              content={`${task.title} (ID: ${task.id})`}
            />
            <Action.CopyToClipboard title="Task Id" content={task.id} />
            <Action.CopyToClipboard title="Task Title" content={task.title} />
            <Action.CopyToClipboard
              title="Task Description"
              content={task.description || ""}
            />
          </ActionPanel.Submenu>
        )}

        {/* Destructive actions */}
        {showDeleteAction && onDeleteTask && (
          <ActionPanel.Section>
            <Action
              title="Delete Task"
              icon={Icon.Trash}
              style={Action.Style.Destructive}
              onAction={handleDelete}
              shortcut={{ modifiers: ["cmd", "shift"], key: "backspace" }}
            />
          </ActionPanel.Section>
        )}
      </ActionPanel>
    );
  }, [
    task,
    showNavigationActions,
    showViewActions,
    showDeleteAction,
    showStatusActions,
    showCopyActions,
    handleShowDetail,
    handleStatusChange,
    handleDelete,
  ]);

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <List.Item
      title={title}
      subtitle={subtitle}
      accessories={accessories}
      actions={renderActions()}
      // TEMPLATE: Add custom styling based on your framework
      // className={`task-item ${variant} ${highlightPriority ? `priority-${task.priority}` : ''}`}
      // data-task-id={task.id}
      // data-status={task.status}
      // data-priority={task.priority}
    />
  );
});

// ============================================================================
// COMPONENT VARIANTS
// ============================================================================

/**
 * Compact Task List Item - Minimal information
 */
export function CompactTaskListItem({
  task,
  onShowDetail,
}: {
  task: Task;
  onShowDetail?: (task: Task) => void;
}) {
  return (
    <TaskListItem
      task={task}
      onShowDetail={onShowDetail}
      displayOptions={{
        showSubtitle: false,
        showComplexity: false,
        showMetadata: false,
        compactMode: true,
      }}
      actionOptions={{
        showDeleteAction: false,
        showNavigationActions: false,
        showStatusActions: false,
        showCopyActions: false,
      }}
      styleOptions={{
        variant: "compact",
      }}
    />
  );
}

/**
 * Detailed Task List Item - Full information
 */
export function DetailedTaskListItem({
  task,
  allTasks,
  onShowDetail,
  onTaskUpdate,
  onDeleteTask,
  onStatusChange,
}: {
  task: Task;
  allTasks?: Task[];
  onShowDetail?: (task: Task) => void;
  onTaskUpdate?: () => void;
  onDeleteTask?: (taskId: string) => void;
  onStatusChange?: (taskId: string, newStatus: string) => void;
}) {
  return (
    <TaskListItem
      task={task}
      allTasks={allTasks}
      onShowDetail={onShowDetail}
      onTaskUpdate={onTaskUpdate}
      onDeleteTask={onDeleteTask}
      onStatusChange={onStatusChange}
      displayOptions={{
        showSubtitle: true,
        showAccessories: true,
        showComplexity: true,
        showMetadata: true,
        compactMode: false,
      }}
      actionOptions={{
        showDeleteAction: true,
        showNavigationActions: true,
        showViewActions: true,
        showStatusActions: true,
        showCopyActions: true,
      }}
      styleOptions={{
        variant: "detailed",
        highlightPriority: true,
        showStatusColor: true,
      }}
    />
  );
}

/**
 * Search Result Task Item - Optimized for search results
 */
export function SearchTaskListItem({
  task,
  searchQuery,
  onShowDetail,
}: {
  task: Task;
  searchQuery?: string;
  onShowDetail?: (task: Task) => void;
}) {
  // TEMPLATE: Add search highlighting logic here
  const highlightedTitle = searchQuery 
    ? highlightSearchTerms(task.title, searchQuery)
    : task.title;

  return (
    <TaskListItem
      task={task}
      onShowDetail={onShowDetail}
      displayOptions={{
        showSubtitle: true,
        showAccessories: true,
        showComplexity: false,
        showMetadata: true,
      }}
      actionOptions={{
        showDeleteAction: false,
        showNavigationActions: true,
        showViewActions: true,
        showStatusActions: false,
        showCopyActions: false,
      }}
      styleOptions={{
        variant: "default",
        highlightPriority: true,
      }}
    />
  );
}

/**
 * Dashboard Task Item - For overview displays
 */
export function DashboardTaskListItem({
  task,
  onShowDetail,
}: {
  task: Task;
  onShowDetail?: (task: Task) => void;
}) {
  return (
    <TaskListItem
      task={task}
      onShowDetail={onShowDetail}
      displayOptions={{
        showSubtitle: false,
        showAccessories: true,
        showComplexity: false,
        showMetadata: false,
        maxTitleLength: 60,
      }}
      actionOptions={{
        showDeleteAction: false,
        showNavigationActions: true,
        showViewActions: true,
        showStatusActions: false,
        showCopyActions: false,
      }}
      styleOptions={{
        variant: "minimal",
        highlightPriority: true,
      }}
    />
  );
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get available status transitions for a task
 * TEMPLATE: Implement based on your business logic
 */
function getAvailableStatuses(currentStatus: string) {
  // TEMPLATE: Replace with your status transition logic
  const allStatuses = [
    { value: "pending", title: "Pending", icon: Icon.Circle },
    { value: "in-progress", title: "In Progress", icon: Icon.Clock },
    { value: "review", title: "Review", icon: Icon.Eye },
    { value: "done", title: "Done", icon: Icon.CheckCircle },
    { value: "deferred", title: "Deferred", icon: Icon.Pause },
    { value: "cancelled", title: "Cancelled", icon: Icon.XMarkCircle },
  ];
  
  return allStatuses.filter(status => status.value !== currentStatus);
}

/**
 * Highlight search terms in text
 * TEMPLATE: Implement search highlighting for your framework
 */
function highlightSearchTerms(text: string, searchQuery: string): string {
  // TEMPLATE: Implement highlighting logic
  // For React: return JSX with highlighted spans
  // For other frameworks: return marked up text
  return text; // Placeholder implementation
}

/**
 * Calculate task item height based on variant
 * TEMPLATE: For frameworks that need explicit height calculation
 */
export function getTaskItemHeight(variant: string): number {
  switch (variant) {
    case "compact": return 40;
    case "detailed": return 80;
    case "minimal": return 35;
    default: return 60;
  }
}