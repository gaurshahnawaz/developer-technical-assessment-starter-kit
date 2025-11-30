import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from './analytics.service';

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnalyticsService],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
  });

  describe('getAnalytics', () => {
    it('should return analytics data', () => {
      const result = service.getAnalytics();

      expect(result).toEqual({
        message: 'Analytics data',
      });
    });

    it('should have message property', () => {
      const result = service.getAnalytics();

      expect(result.message).toBe('Analytics data');
    });
  });
});
