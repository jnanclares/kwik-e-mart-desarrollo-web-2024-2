// src/services/notificationService.ts
export type ToastType = "success" | "error" | "warning";

export interface ToastNotification {
  message: string;
  type: ToastType;
  duration?: number;
}

type NotificationListener = (notification: ToastNotification) => void;

class NotificationService {
  private listeners: NotificationListener[] = [];

  subscribe(listener: NotificationListener): () => void {
    this.listeners.push(listener);
    
    // Devolver función para desuscribirse
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify(message: string, type: ToastType, duration?: number): void {
    const notification: ToastNotification = { message, type, duration };
    this.listeners.forEach(listener => listener(notification));
  }
}

export const notificationService = new NotificationService();