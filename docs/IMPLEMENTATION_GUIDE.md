# Template Implementation Guide

This guide walks you through implementing the TaskMaster component templates in your own project. Follow these steps to get started quickly and customize the components for your specific needs.

## 📋 Prerequisites

- **Framework**: React, Vue, Angular, or Vanilla JS
- **TypeScript**: Recommended for better development experience
- **Node.js**: Version 16+ for development tools

## 🚀 Quick Start

### 1. Choose Your Template

Pick the template that best matches your requirements:

- **Basic Task Manager**: Simple CRUD operations, perfect for getting started
- **Advanced Task Manager**: Full-featured with dependencies, subtasks, analytics
- **Component Library**: Individual reusable components for custom implementations

### 2. Copy Template Files

```bash
# For basic implementation
cp -r templates/basic-task-manager/* src/

# For advanced implementation  
cp -r templates/advanced-task-manager/* src/

# For component library approach
cp -r templates/components/* src/components/
cp -r templates/hooks/* src/hooks/
cp -r templates/utils/* src/utils/
```

### 3. Install Dependencies

```bash
# Core React dependencies
npm install react react-dom

# Utility libraries (optional)
npm install date-fns lodash

# For Raycast extensions
npm install @raycast/api @raycast/utils
```

## 🔧 Configuration

### 1. Update Types

Customize `types.ts` to match your data model:

```typescript
// Basic customization
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
  priority: "high" | "medium" | "low";
  
  // Add your custom fields
  assignee?: string;
  dueDate?: Date;
  category?: string;
  tags?: string[];
}
```

### 2. Configure Statuses and Priorities

Update `config.ts` with your workflow:

```typescript
export const STATUS_CONFIG = {
  // Replace with your statuses
  backlog: { title: "Backlog", color: "#6B7280", icon: "inbox" },
  ready: { title: "Ready", color: "#3B82F6", icon: "play" },
  doing: { title: "Doing", color: "#F59E0B", icon: "cog" },
  review: { title: "Review", color: "#8B5CF6", icon: "eye" },
  done: { title: "Done", color: "#10B981", icon: "check" },
};

export const PRIORITY_CONFIG = {
  // Customize priority levels
  critical: { title: "Critical", color: "#DC2626", weight: 5 },
  high: { title: "High", color: "#EF4444", weight: 4 },
  medium: { title: "Medium", color: "#F59E0B", weight: 3 },
  low: { title: "Low", color: "#10B981", weight: 2 },
};
```

### 3. Set Up Storage

Choose your storage method in `utils/storage.ts`:

```typescript
// For web applications
import { LocalStorage } from "./storage";
export const storage = new LocalStorage("my-tasks");

// For Node.js applications
import { FileStorage } from "./storage";
export const storage = new FileStorage("./data/tasks.json");

// For API-backed applications
import { ApiStorage } from "./storage";
export const storage = new ApiStorage("https://api.example.com", "your-api-key");
```

## 🧩 Component Integration

### React Implementation

```tsx
// App.tsx
import React from 'react';
import { TaskList } from './components/TaskList';
import { useSimpleTasks } from './hooks/useSimpleTasks';

function App() {
  const {
    tasks,
    createTask,
    updateTask,
    deleteTask,
    isLoading,
    error
  } = useSimpleTasks();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="app">
      <h1>My Task Manager</h1>
      <TaskList
        tasks={tasks}
        onCreateTask={createTask}
        onUpdateTask={updateTask}
        onDeleteTask={deleteTask}
      />
    </div>
  );
}

export default App;
```

### Raycast Extension

```tsx
// task-list.tsx
import { List, ActionPanel, Action } from "@raycast/api";
import { useSimpleTasks } from "./hooks/useSimpleTasks";
import { TaskListItem } from "./components/TaskListItem";

export default function TaskListCommand() {
  const { tasks, isLoading, createTask, updateTask } = useSimpleTasks();

  return (
    <List isLoading={isLoading}>
      {tasks.map(task => (
        <TaskListItem
          key={task.id}
          task={task}
          onUpdate={updateTask}
        />
      ))}
    </List>
  );
}
```

### Vue.js Implementation

```vue
<template>
  <div class="task-manager">
    <h1>My Tasks</h1>
    <TaskList
      :tasks="tasks"
      :loading="isLoading"
      @create="createTask"
      @update="updateTask"
      @delete="deleteTask"
    />
  </div>
</template>

<script setup>
import { useSimpleTasks } from './composables/useSimpleTasks';
import TaskList from './components/TaskList.vue';

const {
  tasks,
  isLoading,
  createTask,
  updateTask,
  deleteTask
} = useSimpleTasks();
</script>
```

## 🎨 Styling and Theming

### CSS Variables Approach

```css
/* themes.css */
:root {
  /* Status colors */
  --status-todo: #6B7280;
  --status-progress: #3B82F6;
  --status-done: #10B981;
  
  /* Priority colors */
  --priority-high: #EF4444;
  --priority-medium: #F59E0B;
  --priority-low: #6B7280;
  
  /* Component styling */
  --task-item-padding: 1rem;
  --task-item-border: 1px solid #E5E7EB;
  --task-item-radius: 0.5rem;
}

.task-item {
  padding: var(--task-item-padding);
  border: var(--task-item-border);
  border-radius: var(--task-item-radius);
}

.task-status-todo { color: var(--status-todo); }
.task-status-progress { color: var(--status-progress); }
.task-status-done { color: var(--status-done); }
```

### Tailwind CSS Classes

```tsx
// TaskListItem.tsx
const statusClasses = {
  todo: "text-gray-500 bg-gray-100",
  "in-progress": "text-blue-500 bg-blue-100", 
  done: "text-green-500 bg-green-100",
};

const priorityClasses = {
  high: "border-l-4 border-red-500",
  medium: "border-l-4 border-yellow-500",
  low: "border-l-4 border-gray-500",
};

function TaskListItem({ task }) {
  return (
    <div className={`p-4 border rounded-lg ${priorityClasses[task.priority]}`}>
      <div className="flex items-center gap-2">
        <span className={`px-2 py-1 rounded text-xs ${statusClasses[task.status]}`}>
          {task.status}
        </span>
        <h3 className="font-medium">{task.title}</h3>
      </div>
    </div>
  );
}
```

## 🔌 Integration Examples

### REST API Integration

```typescript
// utils/api.ts
export class TaskApi {
  constructor(private baseUrl: string, private apiKey?: string) {}

  async getTasks(): Promise<Task[]> {
    const response = await fetch(`${this.baseUrl}/tasks`, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  async createTask(task: CreateTaskData): Promise<Task> {
    const response = await fetch(`${this.baseUrl}/tasks`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(task),
    });
    return response.json();
  }

  async updateTask(id: string, updates: UpdateTaskData): Promise<Task> {
    const response = await fetch(`${this.baseUrl}/tasks/${id}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(updates),
    });
    return response.json();
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
    };
  }
}
```

### GraphQL Integration

```typescript
// utils/graphql.ts
import { gql } from '@apollo/client';

export const GET_TASKS = gql`
  query GetTasks($filters: TaskFilters) {
    tasks(filters: $filters) {
      id
      title
      description
      status
      priority
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_TASK = gql`
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      id
      title
      status
      priority
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $input: UpdateTaskInput!) {
    updateTask(id: $id, input: $input) {
      id
      title
      status
      priority
      updatedAt
    }
  }
`;
```

### Real-time Updates

```typescript
// hooks/useRealtimeTasks.ts
import { useEffect } from 'react';
import { useSimpleTasks } from './useSimpleTasks';

export function useRealtimeTasks() {
  const tasks = useSimpleTasks();

  useEffect(() => {
    // WebSocket connection
    const ws = new WebSocket('ws://localhost:8080/tasks');
    
    ws.onmessage = (event) => {
      const { type, data } = JSON.parse(event.data);
      
      switch (type) {
        case 'TASK_CREATED':
          tasks.refresh();
          break;
        case 'TASK_UPDATED':
          tasks.refresh();
          break;
        case 'TASK_DELETED':
          tasks.refresh();
          break;
      }
    };

    return () => ws.close();
  }, []);

  return tasks;
}
```

## 🧪 Testing

### Unit Tests

```typescript
// __tests__/useSimpleTasks.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import { useSimpleTasks } from '../hooks/useSimpleTasks';

describe('useSimpleTasks', () => {
  test('should create a task', async () => {
    const { result } = renderHook(() => useSimpleTasks());

    await act(async () => {
      await result.current.createTask({
        title: 'Test Task',
        description: 'Test Description',
        status: 'todo',
        priority: 'medium',
      });
    });

    expect(result.current.tasks).toHaveLength(1);
    expect(result.current.tasks[0].title).toBe('Test Task');
  });

  test('should update a task', async () => {
    const { result } = renderHook(() => useSimpleTasks());
    
    // Create task first
    await act(async () => {
      await result.current.createTask({
        title: 'Test Task',
        status: 'todo',
        priority: 'medium',
      });
    });

    const taskId = result.current.tasks[0].id;

    // Update task
    await act(async () => {
      await result.current.updateTask(taskId, { status: 'done' });
    });

    expect(result.current.tasks[0].status).toBe('done');
  });
});
```

### Component Tests

```tsx
// __tests__/TaskListItem.test.tsx
import { render, fireEvent } from '@testing-library/react';
import { TaskListItem } from '../components/TaskListItem';

const mockTask = {
  id: '1',
  title: 'Test Task',
  description: 'Test Description',
  status: 'todo' as const,
  priority: 'medium' as const,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('TaskListItem', () => {
  test('displays task information', () => {
    const { getByText } = render(
      <TaskListItem task={mockTask} />
    );

    expect(getByText('Test Task')).toBeInTheDocument();
    expect(getByText('Test Description')).toBeInTheDocument();
  });

  test('calls onUpdate when status changes', () => {
    const onUpdate = jest.fn();
    const { getByRole } = render(
      <TaskListItem task={mockTask} onUpdate={onUpdate} />
    );

    fireEvent.click(getByRole('button', { name: /mark as done/i }));
    
    expect(onUpdate).toHaveBeenCalledWith(mockTask.id, { status: 'done' });
  });
});
```

## 🚀 Deployment

### Build Configuration

```json
{
  "scripts": {
    "build": "tsc && vite build",
    "build:prod": "NODE_ENV=production npm run build",
    "preview": "vite preview",
    "type-check": "tsc --noEmit"
  }
}
```

### Environment Variables

```bash
# .env.production
VITE_API_URL=https://api.yourdomain.com
VITE_API_KEY=your-production-api-key
VITE_STORAGE_TYPE=api

# .env.development  
VITE_API_URL=http://localhost:3000
VITE_STORAGE_TYPE=localStorage
```

## 📈 Performance Optimization

### Memoization

```tsx
// Optimize component rendering
const TaskListItem = React.memo(({ task, onUpdate }) => {
  const handleStatusChange = useCallback((newStatus) => {
    onUpdate(task.id, { status: newStatus });
  }, [task.id, onUpdate]);

  return (
    <div className="task-item">
      {/* Component content */}
    </div>
  );
});
```

### Virtual Scrolling

```tsx
// For large task lists
import { FixedSizeList as List } from 'react-window';

function VirtualTaskList({ tasks }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      <TaskListItem task={tasks[index]} />
    </div>
  );

  return (
    <List
      height={600}
      itemCount={tasks.length}
      itemSize={80}
    >
      {Row}
    </List>
  );
}
```

## 🎯 Best Practices

1. **Type Safety**: Use TypeScript for better development experience
2. **Error Handling**: Implement comprehensive error boundaries
3. **Accessibility**: Add ARIA labels and keyboard navigation
4. **Performance**: Use React.memo and useMemo for expensive operations
5. **Testing**: Write unit tests for business logic and components
6. **Documentation**: Keep your code well-documented

## 🔧 Troubleshooting

### Common Issues

**Tasks not persisting**: Check storage configuration and permissions
**Slow performance**: Enable component memoization and virtual scrolling
**Type errors**: Ensure your custom fields are properly typed
**Build failures**: Check TypeScript configuration and dependencies

### Debug Mode

```typescript
// Enable debug logging
localStorage.setItem('task-manager-debug', 'true');

// In your code
const DEBUG = localStorage.getItem('task-manager-debug') === 'true';

if (DEBUG) {
  console.log('Task operation:', operation, data);
}
```

## 📚 Additional Resources

- [Component Documentation](./components/README.md)
- [Hook Documentation](./hooks/README.md)
- [API Reference](./api/README.md)
- [Examples Repository](./examples/)

## 🤝 Contributing

Found a bug or want to add a feature? Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This template is provided under the MIT license. Feel free to use, modify, and distribute as needed.