# @taskmaster/templates

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Reusable TypeScript templates and boilerplate code for creating task management applications. This package provides components, hooks, types, and utilities that can be used across different frameworks and platforms.

## Project Structure

```
task-manager-templates/
├── basic-task-manager/          # Minimal task management setup
│   ├── config.ts               # Configuration file
│   ├── hooks/
│   │   └── useSimpleTasks.ts   # Simple task management hook
│   ├── types.ts                # Type definitions
│   ├── utils/
│   │   ├── helpers.ts          # Helper functions
│   │   └── storage.ts          # Storage utilities
│   └── index.ts                # Main export file
├── components/                  # Reusable component templates
│   ├── atoms/
│   │   ├── PriorityIndicator.template.tsx
│   │   └── StatusBadge.template.tsx
│   ├── molecules/
│   │   └── TaskListItem.template.tsx
│   └── index.ts
├── configs/                     # Configuration templates
│   ├── config.template.ts
│   └── types.template.ts
├── hooks/                       # Data management hook templates
│   ├── useTasks.template.ts
│   └── index.ts
├── utils/                       # Utility function templates
│   ├── validation.template.ts
│   └── index.ts
├── docs/                        # Documentation
│   └── IMPLEMENTATION_GUIDE.md
├── templates/                   # Template copies for standalone use
├── package.json                 # Package configuration
├── tsconfig.json               # TypeScript configuration
└── README.md                   # This file
```
