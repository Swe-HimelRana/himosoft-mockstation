import { apiDb } from './db';

export interface WebhookLog {
  id: string;
  timestamp: string;
  method: string;
  headers: Record<string, string>;
  body: any;
  query: Record<string, string>;
  formData?: FormData;
}

class WebhookStore {
  private readonly LOG_MAX_AGE = 1000 * 60 * 60 * 24 * 3; // 3 days
  private readonly MAX_LOGS_PER_WEBHOOK = 100; // Keep only last 100 logs per webhook
  private subscribers: Map<string, Set<(logs: WebhookLog[]) => void>>;
  private lastLogIds: Map<string, Set<string>>;

  constructor() {
    this.subscribers = new Map();
    this.lastLogIds = new Map();
  }

  private async cleanup() {
    const now = new Date().getTime();
    const data = await apiDb.read();
    const logs = data.logs || {};
    let totalCleaned = 0;
    
    Object.entries(logs).forEach(([webhookId, webhookLogs]) => {
      // Filter out old logs
      const recentLogs = webhookLogs.filter(log => {
        const logTime = new Date(log.timestamp).getTime();
        return now - logTime < this.LOG_MAX_AGE;
      });

      // Keep only the most recent logs
      const trimmedLogs = recentLogs.slice(0, this.MAX_LOGS_PER_WEBHOOK);

      if (trimmedLogs.length !== webhookLogs.length) {
        console.log(`Cleaning up ${webhookLogs.length - trimmedLogs.length} old logs for webhook ${webhookId}`);
        logs[webhookId] = trimmedLogs;
        this.notifySubscribers(webhookId);
        totalCleaned += webhookLogs.length - trimmedLogs.length;
      }
    });

    if (totalCleaned > 0) {
      console.log(`Total logs cleaned up: ${totalCleaned}`);
      await apiDb.write({ ...data, logs });
    }
  }

  async addLog(webhookId: string, log: WebhookLog) {
    // Clean up old logs before adding new one
    await this.cleanup();

    const logs = await this.getLogs(webhookId);
    
    // Check if this log ID already exists
    const existingLogIndex = logs.findIndex(l => l.id === log.id);
    if (existingLogIndex !== -1) {
      // Update existing log instead of adding a duplicate
      logs[existingLogIndex] = log;
    } else {
      // Add new log
      logs.unshift(log);
    }
    
    // Keep only the most recent logs
    const trimmedLogs = logs.slice(0, this.MAX_LOGS_PER_WEBHOOK);
    const data = await apiDb.read();
    const allLogs = data.logs || {};
    allLogs[webhookId] = trimmedLogs;
    await apiDb.write({ ...data, logs: allLogs });
    
    // Notify subscribers with only the new/updated log
    this.notifySubscribers(webhookId, [log]);
  }

  async getLogs(webhookId: string): Promise<WebhookLog[]> {
    // Clean up old logs when retrieving logs
    await this.cleanup();
    const data = await apiDb.read();
    const logs = data.logs || {};
    return logs[webhookId] || [];
  }

  private notifySubscribers(webhookId: string, newLogs?: WebhookLog[]) {
    const subscribers = this.subscribers.get(webhookId);
    if (subscribers) {
      if (newLogs) {
        // Send only new logs
        subscribers.forEach(callback => callback(newLogs));
      } else {
        // Send all logs (for initial load)
        this.getLogs(webhookId).then(logs => {
          subscribers.forEach(callback => callback(logs));
        });
      }
    }
  }

  subscribe(webhookId: string, callback: (logs: WebhookLog[]) => void) {
    if (!this.subscribers.has(webhookId)) {
      this.subscribers.set(webhookId, new Set());
    }
    this.subscribers.get(webhookId)!.add(callback);
  }

  unsubscribe(webhookId: string, callback: (logs: WebhookLog[]) => void) {
    const subscribers = this.subscribers.get(webhookId);
    if (subscribers) {
      subscribers.delete(callback);
      if (subscribers.size === 0) {
        this.subscribers.delete(webhookId);
      }
    }
  }
}

export const webhookStore = new WebhookStore(); 