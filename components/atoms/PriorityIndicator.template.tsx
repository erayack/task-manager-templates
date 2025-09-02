/**
 * TEMPLATE: Priority Indicator Atomic Component
 * 
 * A reusable component for displaying task priority with consistent styling.
 * This atomic component provides visual indication of task importance.
 * 
 * CUSTOMIZATION GUIDE:
 * 1. Update imports to match your UI framework
 * 2. Modify priority levels to match your system
 * 3. Adjust styling and icons for your design
 * 4. Add new priority types as needed
 * 
 * USAGE EXAMPLES:
 * - Task list accessories
 * - Kanban card indicators  
 * - Filter displays
 * - Dashboard metrics
 */

// TEMPLATE: Replace with your UI framework imports
import { Icon, Color } from "@raycast/api";
import { TaskPriority } from "../../configs/types.template";
import { PRIORITY_CONFIG } from "../../configs/config.template";

// ============================================================================
// COMPONENT INTERFACES
// ============================================================================

interface PriorityIndicatorProps {
  priority: TaskPriority;
  showIcon?: boolean;
  showText?: boolean;
  showWeight?: boolean;
  variant?: "subtle" | "prominent" | "compact";
  size?: "small" | "medium" | "large";
  /** Optional click handler for interactive indicators */
  onClick?: (priority: TaskPriority) => void;
  /** Optional tooltip override */
  tooltip?: string;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Priority Indicator Component
 * 
 * TEMPLATE: Adapt this implementation for your UI framework:
 * 
 * React Example:
 * return (
 *   <div className={`priority-indicator ${variant} ${size}`}>
 *     {showIcon && <Icon name={config.icon} color={config.color} size={iconSize} />}
 *     {showText && <span className="priority-label">{displayText}</span>}
 *     {showWeight && <span className="priority-weight">({config.weight})</span>}
 *   </div>
 * );
 * 
 * Angular Example:
 * <div class="priority-indicator {{variant}} {{size}}" (click)="onClick(priority)">
 *   <icon *ngIf="showIcon" [name]="config.icon" [color]="config.color"></icon>
 *   <span *ngIf="showText" class="priority-label">{{displayText}}</span>
 *   <span *ngIf="showWeight" class="priority-weight">({{config.weight}})</span>
 * </div>
 */
export function PriorityIndicator({
  priority,
  showIcon = true,
  showText = false,
  showWeight = false,
  variant = "subtle",
  size = "medium",
  onClick,
  tooltip,
}: PriorityIndicatorProps) {
  const config = PRIORITY_CONFIG[priority];
  
  if (!config) {
    return null;
  }

  // Determine display text based on variant
  const displayText = variant === "prominent" ? config.label : priority;
  const customTooltip = tooltip || config.description || config.label;

  // TEMPLATE: Raycast implementation - adapt for your framework
  if (showText && showIcon) {
    const text = showWeight ? `${displayText} (${config.weight})` : displayText;
    return {
      icon: { source: config.icon, tintColor: config.color },
      text,
      tooltip: customTooltip,
    };
  }
  
  if (showText) {
    const text = showWeight ? `${displayText} (${config.weight})` : displayText;
    return {
      text,
      tooltip: customTooltip,
    };
  }
  
  return {
    icon: { source: config.icon, tintColor: config.color },
    tooltip: customTooltip,
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get priority badge data for List.Item accessories
 */
export function getPriorityBadgeData(priority: TaskPriority, options?: Partial<PriorityIndicatorProps>) {
  const config = PRIORITY_CONFIG[priority];
  
  if (!config) {
    return null;
  }

  const { 
    showIcon = true, 
    showText = false, 
    showWeight = false,
    variant = "subtle",
    tooltip 
  } = options || {};

  const displayText = variant === "prominent" ? config.label : priority;
  const text = showWeight ? `${displayText} (${config.weight})` : displayText;

  return {
    icon: showIcon ? { source: config.icon, tintColor: config.color } : undefined,
    text: showText ? text : undefined,
    tooltip: tooltip || config.description || config.label,
  };
}

/**
 * Get priority icon for Action buttons
 */
export function getPriorityIcon(priority: TaskPriority): Icon {
  return PRIORITY_CONFIG[priority]?.icon || Icon.Minus;
}

/**
 * Get priority color for consistent theming
 */
export function getPriorityColor(priority: TaskPriority): Color {
  return PRIORITY_CONFIG[priority]?.color || Color.PrimaryText;
}

/**
 * Get priority weight for sorting
 */
export function getPriorityWeight(priority: TaskPriority): number {
  return PRIORITY_CONFIG[priority]?.weight || 0;
}

/**
 * Get priority label for display
 */
export function getPriorityLabel(priority: TaskPriority): string {
  return PRIORITY_CONFIG[priority]?.label || `${priority} priority`;
}

/**
 * Get all available priorities for dropdowns
 */
export function getAllPriorities(): Array<{ 
  value: TaskPriority; 
  title: string; 
  icon: Icon; 
  color: Color; 
  weight: number;
  description?: string;
}> {
  return Object.entries(PRIORITY_CONFIG).map(([priority, config]) => ({
    value: priority as TaskPriority,
    title: config.label,
    icon: config.icon,
    color: config.color,
    weight: config.weight,
    description: config.description,
  }));
}

// ============================================================================
// COMPARISON AND SORTING UTILITIES
// ============================================================================

/**
 * Compare priorities for sorting (higher priority first)
 */
export function comparePriorities(a: TaskPriority, b: TaskPriority): number {
  return getPriorityWeight(b) - getPriorityWeight(a);
}

/**
 * Sort tasks by priority (highest first)
 */
export function sortByPriority<T extends { priority: TaskPriority }>(tasks: T[]): T[] {
  return [...tasks].sort((a, b) => comparePriorities(a.priority, b.priority));
}

/**
 * Group tasks by priority
 */
export function groupByPriority<T extends { priority: TaskPriority }>(
  tasks: T[]
): Record<TaskPriority, T[]> {
  return tasks.reduce((groups, task) => {
    const priority = task.priority;
    if (!groups[priority]) {
      groups[priority] = [];
    }
    groups[priority].push(task);
    return groups;
  }, {} as Record<TaskPriority, T[]>);
}

/**
 * Filter tasks by priority level
 */
export function filterByPriority<T extends { priority: TaskPriority }>(
  tasks: T[],
  priorities: TaskPriority[]
): T[] {
  return tasks.filter(task => priorities.includes(task.priority));
}

/**
 * Get tasks with priority above threshold
 */
export function getHighPriorityTasks<T extends { priority: TaskPriority }>(
  tasks: T[],
  minWeight: number = 2
): T[] {
  return tasks.filter(task => getPriorityWeight(task.priority) >= minWeight);
}

// ============================================================================
// COMPONENT VARIANTS
// ============================================================================

/**
 * High Priority Warning Indicator
 * Special styling for urgent tasks
 */
export function HighPriorityWarning({ priority }: { priority: TaskPriority }) {
  if (getPriorityWeight(priority) < 3) {
    return null;
  }

  return PriorityIndicator({
    priority,
    showIcon: true,
    showText: true,
    variant: "prominent",
    tooltip: "⚠️ High priority task requiring immediate attention",
  });
}

/**
 * Compact Priority Indicator - Icon only, small size
 */
export function CompactPriorityIndicator({ 
  priority, 
  tooltip 
}: Pick<PriorityIndicatorProps, "priority" | "tooltip">) {
  return PriorityIndicator({
    priority,
    showIcon: true,
    showText: false,
    variant: "compact",
    size: "small",
    tooltip,
  });
}

/**
 * Detailed Priority Indicator - Full information
 */
export function DetailedPriorityIndicator({ 
  priority, 
  tooltip 
}: Pick<PriorityIndicatorProps, "priority" | "tooltip">) {
  return PriorityIndicator({
    priority,
    showIcon: true,
    showText: true,
    showWeight: true,
    variant: "prominent",
    tooltip,
  });
}

/**
 * Priority Level Badge - Text and weight only
 */
export function PriorityLevelBadge({ 
  priority, 
  tooltip 
}: Pick<PriorityIndicatorProps, "priority" | "tooltip">) {
  return PriorityIndicator({
    priority,
    showIcon: false,
    showText: true,
    showWeight: true,
    variant: "prominent",
    tooltip,
  });
}

// ============================================================================
// UTILITY FUNCTIONS FOR ANALYTICS
// ============================================================================

/**
 * Get priority distribution statistics
 */
export function getPriorityDistribution<T extends { priority: TaskPriority }>(
  tasks: T[]
): Record<TaskPriority, { count: number; percentage: number }> {
  const total = tasks.length;
  const grouped = groupByPriority(tasks);
  
  const distribution: Record<string, { count: number; percentage: number }> = {};
  
  Object.keys(PRIORITY_CONFIG).forEach(priority => {
    const count = grouped[priority as TaskPriority]?.length || 0;
    distribution[priority] = {
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    };
  });
  
  return distribution as Record<TaskPriority, { count: number; percentage: number }>;
}

/**
 * Get priority indicators with counts for dashboard
 */
export function getPriorityIndicatorsWithCounts<T extends { priority: TaskPriority }>(
  tasks: T[]
): Array<{ icon?: { source: Icon; tintColor: Color; } | undefined; text?: string | undefined; tooltip: string; count: number }> {
  const distribution = getPriorityDistribution(tasks);
  
  return Object.entries(distribution).map(([priority, stats]) => {
    const badge = getPriorityBadgeData(priority as TaskPriority, {
      showText: true,
      variant: "prominent",
    });
    
    return {
      ...badge,
      count: stats.count,
      text: `${badge?.text}: ${stats.count}`,
      tooltip: `${stats.count} ${priority} priority tasks (${stats.percentage}%)`,
    };
  }).filter(Boolean);
}

/**
 * Generate priority trend indicators
 */
export function getPriorityTrend<T extends { priority: TaskPriority; createdAt?: Date }>(
  currentTasks: T[],
  previousTasks: T[]
): { priority: TaskPriority; trend: "up" | "down" | "stable"; change: number }[] {
  const currentDist = getPriorityDistribution(currentTasks);
  const previousDist = getPriorityDistribution(previousTasks);
  
  return Object.keys(PRIORITY_CONFIG).map(priority => {
    const current = currentDist[priority as TaskPriority]?.count || 0;
    const previous = previousDist[priority as TaskPriority]?.count || 0;
    const change = current - previous;
    
    return {
      priority: priority as TaskPriority,
      trend: change > 0 ? "up" : change < 0 ? "down" : "stable",
      change: Math.abs(change),
    };
  });
}