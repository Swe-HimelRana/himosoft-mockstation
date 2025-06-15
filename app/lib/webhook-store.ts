interface WebhookLog {
  id: string;
  timestamp: string;
  method: string;
  headers: Record<string, string>;
  body: any;
  query: Record<string, string>;
  formData?: FormData;
}

class WebhookStore {
  private logs: Map<string, WebhookLog[]>;
  private subscribers: Map<string, Set<(logs: WebhookLog[]) => void>>;

  constructor() {
    this.logs = new Map();
    this.subscribers = new Map();
  }

  addLog(webhookId: string, log: WebhookLog) {
    const logs = this.logs.get(webhookId) || [];
    logs.unshift(log);
    this.logs.set(webhookId, logs);
    this.notifySubscribers(webhookId);
  }

  getLogs(webhookId: string): WebhookLog[] {
    return this.logs.get(webhookId) || [];
  }

  subscribe(webhookId: string, callback: (logs: WebhookLog[]) => void) {
    if (!this.subscribers.has(webhookId)) {
      this.subscribers.set(webhookId, new Set());
    }
    this.subscribers.get(webhookId)!.add(callback);
    return () => {
      this.subscribers.get(webhookId)?.delete(callback);
    };
  }

  private notifySubscribers(webhookId: string) {
    const logs = this.getLogs(webhookId);
    this.subscribers.get(webhookId)?.forEach(callback => callback(logs));
  }
}

export const webhookStore = new WebhookStore(); 