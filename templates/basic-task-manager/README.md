# Basic Task Manager Template

This template provides a minimal, easy-to-implement task management system. Perfect for simple to-do lists, personal task tracking, or getting started with task management.

## 🎯 Use Cases

- Personal to-do lists
- Simple project tracking
- Learning task management concepts
- Minimal viable product (MVP) development

## ✨ Features

- **Core Operations**: Create, read, update, delete tasks
- **Basic Status Tracking**: Todo, In Progress, Done
- **Simple Priority Levels**: High, Medium, Low
- **Clean UI Components**: List views, detail views, forms
- **Local Storage**: File-based or localStorage persistence

## 📁 Template Structure

```
basic-task-manager/
├── components/
│   ├── TaskList.tsx          # Simple task list component
│   ├── TaskItem.tsx          # Individual task display
│   ├── TaskForm.tsx          # Task creation/editing form
│   └── StatusBadge.tsx       # Status indicator component
├── hooks/
│   └── useSimpleTasks.ts     # Basic task management hook
├── utils/
│   ├── storage.ts            # Simple storage utilities
│   └── helpers.ts            # Basic helper functions
├── types.ts                  # Minimal type definitions
├── config.ts                 # Simple configuration
└── README.md                 # Implementation guide
```

## 🚀 Getting Started

### 1. Copy Template Files

Copy the basic template files to your project:

```bash
cp -r templates/basic-task-manager/* src/
```

### 2. Install Dependencies

```bash
# For React projects
npm install react react-dom

# For Raycast extensions
npm install @raycast/api @raycast/utils
```

### 3. Configure Your Data Model

Update `types.ts` with your task structure:

```typescript
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
  priority: "high" | "medium" | "low";
  createdAt: Date;
  updatedAt: Date;
}
```

### 4. Set Up Storage

Choose your storage method in `utils/storage.ts`:

- **Local Files**: JSON file storage
- **LocalStorage**: Browser storage
- **Memory**: In-memory storage (development)

### 5. Customize Configuration

Update `config.ts` with your preferences:

```typescript
export const CONFIG = {
  statuses: {
    todo: { title: "To Do", color: "gray" },
    "in-progress": { title: "In Progress", color: "blue" },
    done: { title: "Done", color: "green" },
  },
  priorities: {
    high: { title: "High", weight: 3 },
    medium: { title: "Medium", weight: 2 },
    low: { title: "Low", weight: 1 },
  },
};
```

## 🧩 Component Usage

### Task List Component

```tsx
import { TaskList } from "./components/TaskList";
import { useSimpleTasks } from "./hooks/useSimpleTasks";

function App() {
  const { tasks, createTask, updateTask, deleteTask } = useSimpleTasks();

  return (
    <TaskList
      tasks={tasks}
      onCreateTask={createTask}
      onUpdateTask={updateTask}
      onDeleteTask={deleteTask}
    />
  );
}
```

### Task Form Component

```tsx
import { TaskForm } from "./components/TaskForm";

function CreateTaskView() {
  const handleSubmit = (taskData) => {
    // Handle task creation
  };

  return (
    <TaskForm
      onSubmit={handleSubmit}
      onCancel={() => {/* Handle cancel */}}
    />
  );
}
```

## 🔧 Customization Examples

### Adding Due Dates

1. Update the Task interface:

```typescript
export interface Task {
  // ... existing fields
  dueDate?: Date;
}
```

2. Update the form component:

```tsx
// In TaskForm.tsx
<input
  type="date"
  value={formData.dueDate}
  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
/>
```

3. Update the display component:

```tsx
// In TaskItem.tsx
{task.dueDate && (
  <span className="due-date">
    Due: {task.dueDate.toLocaleDateString()}
  </span>
)}
```

### Adding Categories/Tags

1. Update types:

```typescript
export interface Task {
  // ... existing fields
  category?: string;
  tags?: string[];
}
```

2. Add category selector:

```tsx
<select
  value={formData.category}
  onChange={(e) => setFormData({...formData, category: e.target.value})}
>
  <option value="">No Category</option>
  <option value="work">Work</option>
  <option value="personal">Personal</option>
</select>
```

### Custom Status Workflow

Update `config.ts` with your workflow:

```typescript
export const CONFIG = {
  statuses: {
    backlog: { title: "Backlog", color: "gray" },
    ready: { title: "Ready", color: "blue" },
    doing: { title: "Doing", color: "orange" },
    review: { title: "Review", color: "purple" },
    done: { title: "Done", color: "green" },
  },
  // Define valid transitions
  transitions: {
    backlog: ["ready"],
    ready: ["doing"],
    doing: ["review", "ready"],
    review: ["done", "doing"],
    done: [],
  },
};
```

## 📱 Framework Adaptations

### React Web App

```tsx
// App.tsx
import React from 'react';
import { TaskList } from './components/TaskList';
import { useSimpleTasks } from './hooks/useSimpleTasks';

function App() {
  const taskManager = useSimpleTasks();

  return (
    <div className="app">
      <header>
        <h1>My Tasks</h1>
      </header>
      <main>
        <TaskList {...taskManager} />
      </main>
    </div>
  );
}
```

### Raycast Extension

```tsx
// task-list.tsx
import { List } from "@raycast/api";
import { useSimpleTasks } from "./hooks/useSimpleTasks";
import { TaskItem } from "./components/TaskItem";

export default function TaskListCommand() {
  const { tasks, isLoading } = useSimpleTasks();

  return (
    <List isLoading={isLoading}>
      {tasks.map(task => (
        <TaskItem key={task.id} task={task} />
      ))}
    </List>
  );
}
```

### Vue.js App

```vue
<template>
  <div class="task-app">
    <TaskList 
      :tasks="tasks" 
      @create="createTask"
      @update="updateTask"
      @delete="deleteTask"
    />
  </div>
</template>

<script>
import { useSimpleTasks } from './composables/useSimpleTasks';
import TaskList from './components/TaskList.vue';

export default {
  components: { TaskList },
  setup() {
    return useSimpleTasks();
  }
};
</script>
```

## 💾 Storage Options

### Local File Storage

```typescript
// utils/storage.ts
export async function saveTasks(tasks: Task[]): Promise<void> {
  const data = JSON.stringify(tasks, null, 2);
  await fs.writeFile('tasks.json', data);
}

export async function loadTasks(): Promise<Task[]> {
  try {
    const data = await fs.readFile('tasks.json', 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}
```

### Browser LocalStorage

```typescript
// utils/storage.ts
export function saveTasks(tasks: Task[]): void {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

export function loadTasks(): Task[] {
  const data = localStorage.getItem('tasks');
  return data ? JSON.parse(data) : [];
}
```

### In-Memory Storage (Development)

```typescript
// utils/storage.ts
let memoryStore: Task[] = [];

export function saveTasks(tasks: Task[]): Promise<void> {
  memoryStore = [...tasks];
  return Promise.resolve();
}

export function loadTasks(): Promise<Task[]> {
  return Promise.resolve([...memoryStore]);
}
```

## 🧪 Testing

### Basic Test Setup

```typescript
// __tests__/useSimpleTasks.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import { useSimpleTasks } from '../hooks/useSimpleTasks';

describe('useSimpleTasks', () => {
  test('should create a new task', async () => {
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
});
```

## 📈 Migration Path

When you outgrow the basic template, migrate to the advanced template:

1. **Add Dependencies**: Support for task relationships
2. **Add Subtasks**: Break down complex tasks
3. **Add Time Tracking**: Estimate and track time
4. **Add Collaboration**: Multi-user support
5. **Add Analytics**: Progress tracking and insights

## 🔗 Next Steps

1. Implement the basic template
2. Test with your use case
3. Add custom features as needed
4. Consider migrating to advanced template for complex requirements
5. Contribute improvements back to the template

## 💡 Tips

- Start simple and add complexity gradually
- Focus on your core use case first
- Use TypeScript for better development experience
- Test your components with different data scenarios
- Keep the UI responsive and accessible