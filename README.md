# @taskmaster/templates

[![npm version](https://badge.fury.io/js/@taskmaster%2Ftemplates.svg)](https://badge.fury.io/js/@taskmaster%2Ftemplates)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Reusable TypeScript templates and boilerplate code for creating task management applications similar to the TaskMaster Raycast extension. This standalone package provides a complete set of components, hooks, types, and utilities that can be used across different frameworks and platforms.

## 📦 Installation

```bash
npm install @taskmaster/templates
```

```bash
yarn add @taskmaster/templates  
```

```bash
pnpm add @taskmaster/templates
```

## 🚀 Quick Start

### Basic Usage

```typescript
// Import types and components
import { 
  Task, 
  TaskStatus, 
  useTasks, 
  StatusBadge,
  TaskListItem 
} from '@taskmaster/templates';

// Use in your React component
function MyTaskList() {
  const { tasks, isLoading, updateTask } = useTasks({
    projectRoot: '/path/to/your/project'
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {tasks.map(task => (
        <TaskListItem 
          key={task.id}
          task={task}
          onStatusChange={(id, status) => updateTask(id, { status })}
        />
      ))}
    </div>
  );
}
```

### Framework-Specific Setup

#### Raycast Extension
```typescript
import { useTasks, TaskListItem } from '@taskmaster/templates';
import { List } from '@raycast/api';

export default function Command() {
  const { tasks } = useTasks({ projectRoot: preferences.projectRoot });
  
  return (
    <List>
      {tasks.map(task => (
        <TaskListItem key={task.id} task={task} />
      ))}
    </List>
  );
}
```

#### React Web App
```typescript
import { useSimpleTasks } from '@taskmaster/templates/basic-task-manager';

function TodoApp() {
  const { tasks, createTask, updateTask } = useSimpleTasks();
  // Your implementation here
}
```

## 📁 Template Structure

```
templates/
├── basic-task-manager/          # Minimal task management setup
├── advanced-task-manager/       # Full-featured task management
├── components/                  # Reusable component templates
├── hooks/                       # Data management hook templates
├── utils/                       # Utility function templates
├── configs/                     # Configuration templates
└── docs/                        # Documentation templates
```

## 📚 Available Modules

### Core Exports

```typescript
// Types and Interfaces
import type { 
  Task, 
  TaskStatus, 
  TaskPriority,
  TaskData,
  Subtask,
  TaskMasterSettings 
} from '@taskmaster/templates';

// Configuration
import { STATUS_CONFIG, PRIORITY_CONFIG } from '@taskmaster/templates';

// Hooks
import { 
  useTasks, 
  useTask, 
  useTaskFilters, 
  useTaskAnalytics 
} from '@taskmaster/templates';

// Components
import { 
  StatusBadge, 
  PriorityIndicator, 
  TaskListItem 
} from '@taskmaster/templates';

// Utilities
import { validateTask } from '@taskmaster/templates';
```

### Basic Task Manager Module

Simple task management with essential features only:

```typescript
import { 
  useSimpleTasks,
  type CreateTaskData,
  type SortOptions 
} from '@taskmaster/templates/basic-task-manager';

// Example usage
function SimpleTodoApp() {
  const { 
    tasks, 
    createTask, 
    updateTask, 
    deleteTask,
    stats 
  } = useSimpleTasks();
  
  return (
    <div>
      <p>Total: {stats.total}, Completed: {stats.completed}</p>
      {tasks.map(task => (
        <div key={task.id}>
          <span>{task.title}</span>
          <button onClick={() => updateTask(task.id, { status: 'done' })}>
            Complete
          </button>
        </div>
      ))}
    </div>
  );
}
```

## 🎛️ Configuration Templates

All templates include customizable configuration for:
- **Status Systems**: Define your own task statuses and workflows
- **Priority Levels**: Configure priority hierarchies and visual indicators
- **UI Themes**: Customize colors, icons, and styling
- **Data Models**: Adapt to your specific data structures

## 🔧 Customization Guide

### 1. Status Configuration
```typescript
export const STATUS_CONFIG = {
  todo: { title: "To Do", icon: Icon.Circle, color: Color.Blue },
  doing: { title: "Doing", icon: Icon.Clock, color: Color.Orange },
  done: { title: "Done", icon: Icon.CheckCircle, color: Color.Green },
};
```

### 2. Component Customization
- Modify component props to match your data model
- Update styling and icons to match your brand
- Extend functionality with additional features

### 3. Hook Adaptation
- Update data fetching logic for your backend
- Modify caching strategies based on your needs
- Add custom validation and transformation logic

## 📖 Usage Examples

See the `examples/` directory for complete implementation examples:
- Simple to-do list
- Project management dashboard
- Bug tracking system
- Content management workflow

## 🔄 Migration Guide

If you're adapting an existing task management system:
1. Map your current data model to the template interfaces
2. Update configuration files to match your statuses/priorities
3. Customize components to display your specific data
4. Implement your data source adapters

## 🤝 Contributing

To add new templates or improve existing ones:
1. Follow the established patterns and conventions
2. Include comprehensive documentation and examples
3. Test templates with different data scenarios
4. Update this README with new template information

## 📄 License

These templates are provided under the same license as the main project.