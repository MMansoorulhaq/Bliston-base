// Permanent Activity Logging System
// Stores action-based logs: who made changes, what was changed, when it happened
import { ActivityLog } from './users';
import { writeFile, readFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const LOG_FILE = path.join(process.cwd(), 'data', 'activity-log.json');

// In-memory cache for performance
let activityLogs: ActivityLog[] = [];
let isInitialized = false;

// Initialize and load existing logs from file
export async function initializeLogFile() {
  if (isInitialized) return;
  
  const dataDir = path.join(process.cwd(), 'data');
  if (!existsSync(dataDir)) {
    await mkdir(dataDir, { recursive: true });
  }
  
  if (existsSync(LOG_FILE)) {
    try {
      const data = await readFile(LOG_FILE, 'utf-8');
      activityLogs = JSON.parse(data);
      console.log(`Loaded ${activityLogs.length} existing activity logs`);
    } catch (error) {
      console.error('Failed to read log file:', error);
      activityLogs = [];
    }
  } else {
    // Create empty log file
    try {
      await writeFile(LOG_FILE, JSON.stringify([], null, 2));
      console.log('Created new activity log file');
    } catch (error) {
      console.error('Failed to create log file:', error);
    }
  }
  
  isInitialized = true;
}

// Enhanced logging with detailed information
export interface EnhancedLogOptions {
  userId: string;
  username: string;
  action: string;
  details: string;
  targetUserId?: string;
  targetUsername?: string;
  ipAddress?: string;
  userAgent?: string;
  changes?: Record<string, { old: string; new: string }>;
  metadata?: Record<string, any>;
}

// Log action-based activities (not login/session)
export async function logActivity(
  userId: string,
  username: string,
  action: string,
  details: string
): Promise<void> {
  // Ensure initialized
  if (!isInitialized) {
    await initializeLogFile();
  }

  const now = new Date();
  const log: ActivityLog = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    username,
    action,
    details,
    timestamp: now.toISOString(),
  };

  // Add to in-memory cache
  activityLogs.unshift(log);
  
  // Keep last 5000 logs (increased for permanent storage)
  if (activityLogs.length > 5000) {
    activityLogs = activityLogs.slice(0, 5000);
  }

  // Immediately persist to file for permanent storage
  try {
    await writeFile(LOG_FILE, JSON.stringify(activityLogs, null, 2));
  } catch (error) {
    console.error('Failed to write log file:', error);
    // Don't throw - log the error but continue
  }
}

// Enhanced logging with full details
export async function logEnhancedActivity(options: EnhancedLogOptions): Promise<void> {
  // Ensure initialized
  if (!isInitialized) {
    await initializeLogFile();
  }

  const {
    userId,
    username,
    action,
    details,
    targetUserId,
    targetUsername,
    ipAddress,
    userAgent,
    changes,
    metadata,
  } = options;

  const now = new Date();
  const log: any = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    username,
    action,
    details,
    timestamp: now.toISOString(),
    date: now.toLocaleDateString(),
    time: now.toLocaleTimeString(),
  };

  // Add optional fields
  if (targetUserId) log.targetUserId = targetUserId;
  if (targetUsername) log.targetUsername = targetUsername;
  if (ipAddress) log.ipAddress = ipAddress;
  if (userAgent) log.userAgent = userAgent;
  if (changes) log.changes = changes;
  if (metadata) log.metadata = metadata;

  // Add to in-memory cache
  activityLogs.unshift(log);
  
  // Keep last 5000 logs
  if (activityLogs.length > 5000) {
    activityLogs = activityLogs.slice(0, 5000);
  }

  // Immediately persist to file for permanent storage
  try {
    await writeFile(LOG_FILE, JSON.stringify(activityLogs, null, 2));
  } catch (error) {
    console.error('Failed to write log file:', error);
  }
}

// Get all logs
export async function getActivityLogs(limit: number = 100): Promise<ActivityLog[]> {
  // Ensure initialized and load from file
  if (!isInitialized) {
    await initializeLogFile();
  }
  return activityLogs.slice(0, limit);
}

// Get logs by user
export async function getActivityLogsByUser(userId: string, limit: number = 100): Promise<ActivityLog[]> {
  if (!isInitialized) {
    await initializeLogFile();
  }
  return activityLogs.filter(log => log.userId === userId).slice(0, limit);
}

// Get logs by action type
export async function getActivityLogsByAction(action: string, limit: number = 100): Promise<ActivityLog[]> {
  if (!isInitialized) {
    await initializeLogFile();
  }
  return activityLogs.filter(log => log.action === action).slice(0, limit);
}

// Get logs by date range
export async function getActivityLogsByDateRange(startDate: Date, endDate: Date): Promise<ActivityLog[]> {
  if (!isInitialized) {
    await initializeLogFile();
  }
  return activityLogs.filter(log => {
    const logDate = new Date(log.timestamp);
    return logDate >= startDate && logDate <= endDate;
  });
}

// Force reload logs from file (useful after external changes)
export async function reloadLogs(): Promise<void> {
  isInitialized = false;
  await initializeLogFile();
}

// Initialize on module load (server-side only)
if (typeof window === 'undefined') {
  initializeLogFile().catch(console.error);
}
