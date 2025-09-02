/**
 * BASIC TEMPLATE: Simple Storage Utilities
 * 
 * Basic storage utilities for persisting tasks.
 * Choose the implementation that fits your platform and requirements.
 * 
 * IMPLEMENTATIONS:
 * - Local file storage (Node.js)
 * - Browser localStorage (Web)
 * - In-memory storage (Development/Testing)
 * 
 * CUSTOMIZATION:
 * - Add encryption for sensitive data
 * - Implement cloud storage sync
 * - Add backup/restore functionality
 * - Add data migration support
 */

import { Task } from "../types";

// ============================================================================
// STORAGE INTERFACE
// ============================================================================

export interface TaskStorage {
  loadTasks(): Promise<Task[]>;
  saveTasks(tasks: Task[]): Promise<void>;
  clearTasks(): Promise<void>;
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const STORAGE_KEY = "simple-task-manager-tasks";
const FILE_PATH = "tasks.json";

// ============================================================================
// LOCAL FILE STORAGE (Node.js / Electron)
// ============================================================================

/**
 * File-based storage for Node.js applications
 * Use this for desktop apps or server-side applications
 */
export class FileStorage implements TaskStorage {
  private filePath: string;

  constructor(filePath: string = FILE_PATH) {
    this.filePath = filePath;
  }

  async loadTasks(): Promise<Task[]> {
    try {
      // TEMPLATE: Replace with your file system module
      const fs = await import("fs/promises");
      const data = await fs.readFile(this.filePath, "utf-8");
      const parsed = JSON.parse(data);
      
      // Ensure dates are properly parsed
      return parsed.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
      }));
    } catch (error) {
      // File doesn't exist or is corrupted
      if ((error as any).code === "ENOENT") {
        return [];
      }
      throw new Error(`Failed to load tasks: ${(error as Error).message}`);
    }
  }

  async saveTasks(tasks: Task[]): Promise<void> {
    try {
      // TEMPLATE: Replace with your file system module
      const fs = await import("fs/promises");
      const data = JSON.stringify(tasks, null, 2);
      await fs.writeFile(this.filePath, data, "utf-8");
    } catch (error) {
      throw new Error(`Failed to save tasks: ${(error as Error).message}`);
    }
  }

  async clearTasks(): Promise<void> {
    try {
      // TEMPLATE: Replace with your file system module
      const fs = await import("fs/promises");
      await fs.unlink(this.filePath);
    } catch (error) {
      // Ignore if file doesn't exist
      if ((error as any).code !== "ENOENT") {
        throw new Error(`Failed to clear tasks: ${(error as Error).message}`);
      }
    }
  }
}

// ============================================================================
// BROWSER LOCAL STORAGE (Web)
// ============================================================================

/**
 * localStorage-based storage for web applications
 * Use this for client-side web applications
 */
export class LocalStorage implements TaskStorage {
  private storageKey: string;

  constructor(storageKey: string = STORAGE_KEY) {
    this.storageKey = storageKey;
  }

  async loadTasks(): Promise<Task[]> {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (!data) {
        return [];
      }
      
      const parsed = JSON.parse(data);
      
      // Ensure dates are properly parsed
      return parsed.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
      }));
    } catch (error) {
      throw new Error(`Failed to load tasks: ${(error as Error).message}`);
    }
  }

  async saveTasks(tasks: Task[]): Promise<void> {
    try {
      const data = JSON.stringify(tasks);
      localStorage.setItem(this.storageKey, data);
    } catch (error) {
      throw new Error(`Failed to save tasks: ${(error as Error).message}`);
    }
  }

  async clearTasks(): Promise<void> {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      throw new Error(`Failed to clear tasks: ${(error as Error).message}`);
    }
  }
}

// ============================================================================
// IN-MEMORY STORAGE (Development/Testing)
// ============================================================================

/**
 * In-memory storage for development and testing
 * Data is lost when the application restarts
 */
export class MemoryStorage implements TaskStorage {
  private tasks: Task[] = [];

  async loadTasks(): Promise<Task[]> {
    // Return a copy to prevent external mutations
    return [...this.tasks];
  }

  async saveTasks(tasks: Task[]): Promise<void> {
    // Store a copy to prevent external mutations
    this.tasks = [...tasks];
  }

  async clearTasks(): Promise<void> {
    this.tasks = [];
  }
}

// ============================================================================
// API-BASED STORAGE (Remote)
// ============================================================================

/**
 * API-based storage for server-backed applications
 * TEMPLATE: Implement according to your API specification
 */
export class ApiStorage implements TaskStorage {
  private baseUrl: string;
  private apiKey?: string;

  constructor(baseUrl: string, apiKey?: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    
    if (this.apiKey) {
      headers["Authorization"] = `Bearer ${this.apiKey}`;
    }
    
    return headers;
  }

  async loadTasks(): Promise<Task[]> {
    try {
      const response = await fetch(`${this.baseUrl}/tasks`, {
        method: "GET",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Ensure dates are properly parsed
      return data.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
      }));
    } catch (error) {
      throw new Error(`Failed to load tasks: ${(error as Error).message}`);
    }
  }

  async saveTasks(tasks: Task[]): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/tasks`, {
        method: "PUT",
        headers: this.getHeaders(),
        body: JSON.stringify(tasks),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }
    } catch (error) {
      throw new Error(`Failed to save tasks: ${(error as Error).message}`);
    }
  }

  async clearTasks(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/tasks`, {
        method: "DELETE",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }
    } catch (error) {
      throw new Error(`Failed to clear tasks: ${(error as Error).message}`);
    }
  }
}

// ============================================================================
// STORAGE FACTORY
// ============================================================================

export type StorageType = "file" | "localStorage" | "memory" | "api";

export interface StorageConfig {
  type: StorageType;
  filePath?: string;
  storageKey?: string;
  apiUrl?: string;
  apiKey?: string;
}

/**
 * Create a storage instance based on configuration
 */
export function createStorage(config: StorageConfig): TaskStorage {
  switch (config.type) {
    case "file":
      return new FileStorage(config.filePath);
    
    case "localStorage":
      return new LocalStorage(config.storageKey);
    
    case "memory":
      return new MemoryStorage();
    
    case "api":
      if (!config.apiUrl) {
        throw new Error("API URL is required for API storage");
      }
      return new ApiStorage(config.apiUrl, config.apiKey);
    
    default:
      throw new Error(`Unsupported storage type: ${config.type}`);
  }
}

// ============================================================================
// DEFAULT STORAGE INSTANCE
// ============================================================================

/**
 * Get default storage based on environment
 */
function getDefaultStorageConfig(): StorageConfig {
  // TEMPLATE: Customize this logic for your platform
  
  // Browser environment
  if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
    return { type: "localStorage" };
  }
  
  // Node.js environment
  if (typeof process !== "undefined" && process.versions?.node) {
    return { type: "file" };
  }
  
  // Fallback to memory storage
  return { type: "memory" };
}

// Create default storage instance
const defaultStorage = createStorage(getDefaultStorageConfig());

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Load tasks using default storage
 */
export async function loadTasks(): Promise<Task[]> {
  return defaultStorage.loadTasks();
}

/**
 * Save tasks using default storage
 */
export async function saveTasks(tasks: Task[]): Promise<void> {
  return defaultStorage.saveTasks(tasks);
}

/**
 * Clear all tasks using default storage
 */
export async function clearTasks(): Promise<void> {
  return defaultStorage.clearTasks();
}

/**
 * Set custom storage instance
 */
let customStorage: TaskStorage | null = null;

export function setStorage(storage: TaskStorage): void {
  customStorage = storage;
}

export function getStorage(): TaskStorage {
  return customStorage || defaultStorage;
}

// ============================================================================
// BACKUP AND MIGRATION UTILITIES
// ============================================================================

/**
 * Create a backup of current tasks
 */
export async function createBackup(): Promise<string> {
  const tasks = await loadTasks();
  const backup = {
    version: "1.0",
    timestamp: new Date().toISOString(),
    tasks,
  };
  
  return JSON.stringify(backup, null, 2);
}

/**
 * Restore tasks from backup
 */
export async function restoreFromBackup(backupData: string): Promise<void> {
  try {
    const backup = JSON.parse(backupData);
    
    if (!backup.tasks || !Array.isArray(backup.tasks)) {
      throw new Error("Invalid backup format");
    }
    
    // Parse dates
    const tasks = backup.tasks.map((task: any) => ({
      ...task,
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt),
    }));
    
    await saveTasks(tasks);
  } catch (error) {
    throw new Error(`Failed to restore backup: ${(error as Error).message}`);
  }
}

/**
 * Export tasks to different format
 */
export async function exportTasks(format: "json" | "csv" = "json"): Promise<string> {
  const tasks = await loadTasks();
  
  if (format === "csv") {
    // Simple CSV export
    const headers = ["ID", "Title", "Description", "Status", "Priority", "Created", "Updated"];
    const rows = tasks.map(task => [
      task.id,
      `"${task.title.replace(/"/g, '""')}"`,
      `"${(task.description || "").replace(/"/g, '""')}"`,
      task.status,
      task.priority,
      task.createdAt.toISOString(),
      task.updatedAt.toISOString(),
    ]);
    
    return [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
  }
  
  return JSON.stringify(tasks, null, 2);
}