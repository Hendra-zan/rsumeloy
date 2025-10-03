import React from 'react';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';
type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  error_details?: {
    name: string;
    stack?: string;
    severity: ErrorSeverity;
  };
}

interface ErrorLog extends LogEntry {
  url?: string;
  user_id?: string;
  component?: string;
  error_details: {
    name: string;
    stack?: string;
    severity: ErrorSeverity;
  };
}

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private readonly maxLogs = 1000;

  private constructor() {
    if (typeof window !== 'undefined') {
      this.setupGlobalErrorHandlers();
    }
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private setupGlobalErrorHandlers() {
    window.addEventListener('error', (event) => {
      this.error(event.message, {
        type: 'window.onerror',
        filename: event.filename,
        lineNo: event.lineno,
        colNo: event.colno,
        error: event.error,
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.error('Unhandled Promise Rejection', {
        type: 'unhandledrejection',
        reason: event.reason,
      });
    });
  }

  private getSeverity(error: Error): ErrorSeverity {
    if (error.name === 'NetworkError') return 'high';
    if (error.name === 'TypeError') return 'medium';
    if (error.name === 'SyntaxError') return 'high';
    return 'low';
  }

  private formatMessage(
    level: LogLevel, 
    message: string, 
    context?: Record<string, unknown>,
    error?: Error
  ): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
    };

    if (error) {
      entry.error_details = {
        name: error.name,
        stack: error.stack,
        severity: this.getSeverity(error),
      };
    }

    return entry;
  }

  private addLog(entry: LogEntry): void {
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // In development, also log to console
    if (process.env.NODE_ENV === 'development') {
      const { timestamp, level, message, context } = entry;
      console[level === 'error' ? 'error' : 'log'](
        `[${timestamp}] ${level.toUpperCase()}: ${message}`,
        context || ''
      );
    }

    // Here you would typically send logs to a monitoring service
    // this.sendToMonitoringService(entry);
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.addLog(this.formatMessage('info', message, context));
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.addLog(this.formatMessage('warn', message, context));
  }

  error(error: Error | string, context?: Record<string, unknown>): void {
    const message = error instanceof Error ? error.message : error;
    const errorContext = error instanceof Error
      ? { ...context, stack: error.stack }
      : context;
    
    this.addLog(this.formatMessage('error', message, errorContext));
  }

  debug(message: string, context?: Record<string, unknown>): void {
    if (process.env.NODE_ENV === 'development') {
      this.addLog(this.formatMessage('debug', message, context));
    }
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
  }
}

// Web Vitals monitoring
export type WebVitalsMetric = {
  id: string;
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  entries: PerformanceEntry[];
};

export function reportWebVitals(metric: WebVitalsMetric): void {
  const logger = Logger.getInstance();
  logger.info('Web Vital measured', {
    metric: metric.name,
    value: metric.value,
    rating: metric.rating,
  });

  // Here you would typically send metrics to your analytics service
  // sendToAnalytics(metric);
}

// Export singleton instance
// Export singleton instance
export const logger = Logger.getInstance();

// Export function to setup global error handler
export function setupGlobalErrorHandler() {
  if (typeof window === 'undefined') return;

  window.addEventListener('error', (event) => {
    logger.error(event.error || event.message, {
      type: 'window.onerror',
      filename: event.filename,
      lineNo: event.lineno,
      colNo: event.colno,
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    logger.error(event.reason || 'Unhandled Promise Rejection', {
      type: 'unhandledrejection',
    });
  });

  // Create error boundary for React components
  class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
    constructor(props: { children: React.ReactNode }) {
      super(props);
      this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
      return { hasError: true };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
      logger.error(error, {
        type: 'react_error_boundary',
        componentStack: info.componentStack,
      });
    }

    render() {
      if (this.state.hasError) {
        return null;
      }
      return this.props.children;
    }
  }

  return ErrorBoundary;
};