import { Injectable } from '@nestjs/common';

@Injectable()
export class AnalyticsService {
  getAnalytics() {
    return {
      message: 'Analytics data',
    };
  }
}
