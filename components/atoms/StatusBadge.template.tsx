/**
 * TEMPLATE: Status Badge Atomic Component
 * 
 * A reusable component for displaying task status with consistent styling.
 * This is an atomic component that can be used across different views.
 * 
 * CUSTOMIZATION GUIDE:
 * 1. Update imports to match your UI framework
 * 2. Modify the return types to match your component system
 * 3. Adjust styling and behavior for your design system
 * 4. Add new variants or props as needed
 * 
 * FRAMEWORK ADAPTATIONS:
 * - Raycast: Returns accessory objects
 * - React: Returns JSX elements
 * - Vue: Returns render functions
 * - Angular: Returns template strings
 */

// TEMPLATE: Replace with your UI framework imports
// For Raycast:
import { Icon, Color } from "@raycast/api";
// For React:
// import React from "react";
// For other frameworks, import your icon and color systems

// TEMPLATE: Replace with your configuration and types
import { TaskStatus } from "../../configs/types.template";
import { STATUS_CONFIG } from "../../configs/config.template";

// ============================================================================
// COMPONENT INTERFACES
// ============================================================================

interface StatusBadgeProps {
  status: TaskStatus;
  showIcon?: boolean;
  showText?: boolean;
  size?: "small" | "medium" | "large";
  variant?: "default" | "subtle" | "prominent";
  /** Optional click handler for interactive badges */
  onClick?: (status: TaskStatus) => void;
  /** Optional tooltip override */
  tooltip?: string;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Status Badge Component
 * 
 * TEMPLATE: This implementation is for Raycast List.Item accessories
 * Adapt the return type and structure for your UI framework:
 * 
 * React Example:
 * return (
 *   <span className={`status-badge ${variant}`} onClick={() => onClick?.(status)}>
 *     {showIcon && <Icon name={config.icon} color={config.color} />}
 *     {showText && <span>{config.title}</span>}
 *   </span>
 * );
 * 
 * Vue Example:
 * return h('span', {
 *   class: `status-badge ${variant}`,
 *   onClick: () => onClick?.(status)
 * }, [
 *   showIcon && h(Icon, { name: config.icon, color: config.color }),
 *   showText && h('span', config.title)
 * ]);
 */
export function StatusBadge({
  status,
  showIcon = true,
  showText = false,
  variant = "default",
  onClick,
  tooltip,
}: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  
  if (!config) {
    return null;
  }

  const customTooltip = tooltip || config.description;

  // TEMPLATE: Raycast implementation - adapt for your framework
  if (showText && showIcon) {
    return {
      icon: { source: config.icon, tintColor: config.color },
      text: config.title,
      tooltip: customTooltip,
    };
  }
  
  if (showText) {
    return {
      text: config.title,
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
 * Get status badge data for List.Item accessories
 * 
 * TEMPLATE: This is specific to Raycast - adapt for your framework
 */
export function getStatusBadgeData(status: TaskStatus, options?: Partial<StatusBadgeProps>) {
  const config = STATUS_CONFIG[status];
  
  if (!config) {
    return null;
  }

  const { showIcon = true, showText = false, tooltip } = options || {};

  // TEMPLATE: Return format for Raycast accessories
  const baseData = {
    icon: showIcon ? { source: config.icon, tintColor: config.color } : undefined,
    text: showText ? config.title : undefined,
    tooltip: tooltip || config.description,
  };

  // Remove undefined properties
  return Object.fromEntries(
    Object.entries(baseData).filter(([_, value]) => value !== undefined)
  );
}

/**
 * Get status icon for Action buttons
 */
export function getStatusIcon(status: TaskStatus): Icon {
  return STATUS_CONFIG[status]?.icon || Icon.Circle;
}

/**
 * Get status color for consistent theming
 */
export function getStatusColor(status: TaskStatus): Color {
  return STATUS_CONFIG[status]?.color || Color.PrimaryText;
}

/**
 * Get status title for display
 */
export function getStatusTitle(status: TaskStatus): string {
  return STATUS_CONFIG[status]?.title || status;
}

/**
 * Get all available statuses for dropdowns
 */
export function getAllStatuses(): Array<{ 
  value: TaskStatus; 
  title: string; 
  icon: Icon; 
  color: Color;
  description: string;
}> {
  return Object.entries(STATUS_CONFIG).map(([status, config]) => ({
    value: status as TaskStatus,
    title: config.title,
    icon: config.icon,
    color: config.color,
    description: config.description,
  }));
}

// ============================================================================
// COMPONENT VARIANTS
// ============================================================================

/**
 * Compact Status Badge - Icon only
 */
export function CompactStatusBadge({ status, tooltip }: Pick<StatusBadgeProps, "status" | "tooltip">) {
  return StatusBadge({
    status,
    showIcon: true,
    showText: false,
    size: "small",
    tooltip,
  });
}

/**
 * Detailed Status Badge - Icon and text
 */
export function DetailedStatusBadge({ status, tooltip }: Pick<StatusBadgeProps, "status" | "tooltip">) {
  return StatusBadge({
    status,
    showIcon: true,
    showText: true,
    variant: "prominent",
    tooltip,
  });
}

/**
 * Text-only Status Badge
 */
export function TextStatusBadge({ status, tooltip }: Pick<StatusBadgeProps, "status" | "tooltip">) {
  return StatusBadge({
    status,
    showIcon: false,
    showText: true,
    tooltip,
  });
}

// ============================================================================
// UTILITY FUNCTIONS FOR LISTS
// ============================================================================

/**
 * Generate status accessories for multiple statuses
 * Useful for showing status distribution or filters
 */
export function getMultiStatusBadges(statuses: TaskStatus[]): Array<ReturnType<typeof getStatusBadgeData>> {
  return statuses
    .map(status => getStatusBadgeData(status))
    .filter(Boolean);
}

/**
 * Get status badge with count
 * Useful for showing status distribution
 */
export function getStatusBadgeWithCount(status: TaskStatus, count: number) {
  const config = STATUS_CONFIG[status];
  
  if (!config) {
    return null;
  }

  return {
    icon: { source: config.icon, tintColor: config.color },
    text: `${count}`,
    tooltip: `${count} ${config.title.toLowerCase()} task${count !== 1 ? 's' : ''}`,
  };
}

/**
 * Generate status filter accessories
 * Shows all statuses with current selection highlighted
 */
export function getStatusFilterBadges(
  selectedStatuses: TaskStatus[],
  allStatuses?: TaskStatus[]
): Array<ReturnType<typeof getStatusBadgeData>> {
  const statuses = allStatuses || Object.keys(STATUS_CONFIG) as TaskStatus[];
  
  return statuses.map(status => {
    const config = STATUS_CONFIG[status];
    const isSelected = selectedStatuses.includes(status);
    
    return {
      icon: { 
        source: config.icon, 
        tintColor: isSelected ? config.color : Color.SecondaryText 
      },
      text: isSelected ? config.title : undefined,
      tooltip: `${isSelected ? 'Remove' : 'Add'} ${config.title} filter`,
    };
  }).filter(Boolean);
}

// ============================================================================
// FRAMEWORK-SPECIFIC EXPORTS
// ============================================================================

// TEMPLATE: Export different implementations for different frameworks

// For React:
// export { StatusBadge as ReactStatusBadge };

// For Vue:
// export { StatusBadge as VueStatusBadge };

// For Angular:
// export { StatusBadge as NgStatusBadge };

// For vanilla JS:
// export { StatusBadge as HTMLStatusBadge };