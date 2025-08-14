// Utilitaires de performance pour mesurer les temps de réponse

export class PerformanceMonitor {
  private static timers = new Map<string, number>();

  static start(label: string): void {
    this.timers.set(label, performance.now());
  }

  static end(label: string): number {
    const startTime = this.timers.get(label);
    if (!startTime) {
      console.warn(`Timer "${label}" not found`);
      return 0;
    }
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    this.timers.delete(label);
    
    console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
    return duration;
  }

  static async measure<T>(label: string, fn: () => Promise<T>): Promise<T> {
    this.start(label);
    try {
      const result = await fn();
      this.end(label);
      return result;
    } catch (error) {
      this.end(label);
      throw error;
    }
  }
}

// Hook pour mesurer les performances côté client
export function usePerformance() {
  const measure = async <T>(label: string, fn: () => Promise<T>): Promise<T> => {
    return PerformanceMonitor.measure(label, fn);
  };

  const measureHttpRequest = async (url: string, options?: RequestInit) => {
    const label = `HTTP ${options?.method || 'GET'} ${url}`;
    return PerformanceMonitor.measure(label, async () => {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    });
  };

  return { measure, measureHttpRequest };
}