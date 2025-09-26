import { mutate } from 'swr';
import { QueryClient } from '@tanstack/react-query';

export class CacheInvalidator {
  private static queryClient: QueryClient | null = null;

  static setQueryClient(client: QueryClient) {
    this.queryClient = client;
  }

  // Invalider toutes les requêtes SWR pour un endpoint
  static async invalidateSWR(key: string | RegExp) {
    if (typeof key === 'string') {
      await mutate(
        (swrKey) => typeof swrKey === 'string' && swrKey.includes(key),
        undefined,
        { revalidate: true }
      );
    } else {
      await mutate(
        (swrKey) => typeof swrKey === 'string' && key.test(swrKey),
        undefined,
        { revalidate: true }
      );
    }
  }

  // Invalider toutes les requêtes React Query pour un queryKey
  static invalidateReactQuery(queryKey: string[]) {
    if (this.queryClient) {
      this.queryClient.invalidateQueries({ queryKey });
    }
  }

  // Méthodes spécifiques par entité
  static async invalidateSectors() {
    // Invalider SWR
    await this.invalidateSWR(/\/api\/sectors/);

    // Invalider React Query
    this.invalidateReactQuery(['sectors']);
    this.invalidateReactQuery(['sector']);
    this.invalidateReactQuery(['sectors-search']);
    this.invalidateReactQuery(['sectors-stats']);
  }

  static async invalidateNotices() {
    await this.invalidateSWR(/\/api\/notices/);
  }

  static async invalidateFunctions() {
    await this.invalidateSWR(/\/api\/fonctions/);
  }

  static async invalidateSpecialites() {
    await this.invalidateSWR(/\/api\/specialites/);
  }

  static async invalidateTags() {
    await this.invalidateSWR(/\/api\/tags/);
  }

  // Invalider tout après une modification importante
  static async invalidateAll() {
    await Promise.all([
      this.invalidateSectors(),
      this.invalidateNotices(),
      this.invalidateFunctions(),
      this.invalidateSpecialites(),
      this.invalidateTags(),
    ]);
  }
}