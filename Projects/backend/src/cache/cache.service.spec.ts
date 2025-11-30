import { Test, TestingModule } from '@nestjs/testing';
import { CacheService } from './cache.service';

describe('CacheService', () => {
  let service: CacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CacheService],
    }).compile();

    service = module.get<CacheService>(CacheService);
  });

  describe('set and get', () => {
    it('should set and get a value', () => {
      const key = 'test-key';
      const value = { name: 'test' };

      service.set(key, value);
      const result = service.get(key);

      expect(result).toEqual(value);
    });

    it('should use default TTL of 300 seconds', () => {
      const key = 'default-ttl';
      const value = 'test-value';

      service.set(key, value);
      const result = service.get(key);

      expect(result).toBe('test-value');
    });

    it('should return null for non-existent key', () => {
      const result = service.get('non-existent-key');

      expect(result).toBeNull();
    });
  });

  describe('TTL expiration', () => {
    it('should expire value after TTL', (done) => {
      const key = 'expiring-key';
      const value = 'will-expire';

      service.set(key, value, 1); // 1 second TTL

      setTimeout(() => {
        const result = service.get(key);
        expect(result).toBeNull();
        done();
      }, 1100);
    });

    it('should not expire value before TTL', (done) => {
      const key = 'non-expiring-key';
      const value = 'will-not-expire';

      service.set(key, value, 2); // 2 second TTL

      setTimeout(() => {
        const result = service.get(key);
        expect(result).toBe('will-not-expire');
        done();
      }, 500);
    });
  });

  describe('invalidate', () => {
    it('should delete a specific key', () => {
      const key = 'to-invalidate';
      service.set(key, 'value');

      service.invalidate(key);
      const result = service.get(key);

      expect(result).toBeNull();
    });
  });

  describe('invalidatePattern', () => {
    it('should delete keys matching a pattern', () => {
      service.set('user:1', 'user-data-1');
      service.set('user:2', 'user-data-2');
      service.set('product:1', 'product-data-1');

      service.invalidatePattern('^user:');

      expect(service.get('user:1')).toBeNull();
      expect(service.get('user:2')).toBeNull();
      expect(service.get('product:1')).toBe('product-data-1');
    });
  });

  describe('clear', () => {
    it('should clear all cache entries', () => {
      service.set('key1', 'value1');
      service.set('key2', 'value2');

      service.clear();

      expect(service.get('key1')).toBeNull();
      expect(service.get('key2')).toBeNull();
    });

    it('should reset cache statistics', () => {
      service.set('key1', 'value1');
      service.get('key1'); // Hit
      service.get('non-existent'); // Miss

      service.clear();
      const stats = service.getStats();

      expect(stats.hits).toBe(0);
      expect(stats.misses).toBe(0);
    });
  });

  describe('getStats', () => {
    it('should return cache statistics', () => {
      service.clear();
      service.set('key1', 'value1');
      service.get('key1'); // Hit
      service.get('non-existent'); // Miss

      const stats = service.getStats();

      expect(stats.hits).toBe(1);
      expect(stats.misses).toBe(1);
      expect(stats.total).toBe(2);
      expect(stats.size).toBe(1);
    });

    it('should calculate hit rate correctly', () => {
      service.clear();
      service.set('key1', 'value1');
      service.set('key2', 'value2');

      service.get('key1'); // Hit
      service.get('key1'); // Hit
      service.get('key2'); // Hit
      service.get('non-existent'); // Miss

      const stats = service.getStats();

      expect(stats.hitRate).toBe('75.00%');
    });

    it('should handle zero stats', () => {
      service.clear();
      const stats = service.getStats();

      expect(stats.hits).toBe(0);
      expect(stats.misses).toBe(0);
      expect(stats.total).toBe(0);
      expect(stats.hitRate).toBe('0.00%');
    });
  });
});
