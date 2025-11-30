import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  @Get('property/:id/price-history')
  @ApiOperation({ summary: 'Get property price history (simulated data)' })
  @ApiResponse({ status: 200, description: 'Returns price history data for charts' })
  getPriceHistory(@Param('id') id: string) {
    // Simulate price history data for the last 12 months
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    const history = [];
    let basePrice = Math.random() * 200000 + 100000; // Random base price
    
    for (let i = 11; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
      basePrice = basePrice * (1 + variation);
      
      history.push({
        month: months[monthIndex],
        price: Math.round(basePrice),
        change: variation > 0 ? 'up' : 'down',
        changePercent: (Math.abs(variation) * 100).toFixed(1),
      });
    }

    return {
      propertyId: id,
      currency: 'OMR',
      history,
      averagePrice: Math.round(history.reduce((sum, h) => sum + h.price, 0) / history.length),
      trend: history[history.length - 1].price > history[0].price ? 'increasing' : 'decreasing',
    };
  }

  @Get('property/:id/local-insights')
  @ApiOperation({ summary: 'Get local area insights (simulated data)' })
  @ApiResponse({ status: 200, description: 'Returns local schools, amenities ratings' })
  getLocalInsights(@Param('id') id: string) {
    return {
      propertyId: id,
      schools: [
        {
          name: 'Al Amana International School',
          distance: '1.2 km',
          rating: 4.5,
          type: 'International',
        },
        {
          name: 'Muscat Private School',
          distance: '2.5 km',
          rating: 4.2,
          type: 'Private',
        },
        {
          name: 'British School Muscat',
          distance: '3.8 km',
          rating: 4.7,
          type: 'International',
        },
      ],
      amenities: {
        shopping: { score: 8.5, count: 15, nearest: '0.5 km' },
        dining: { score: 7.8, count: 25, nearest: '0.3 km' },
        healthcare: { score: 9.0, count: 5, nearest: '1.2 km' },
        parks: { score: 7.5, count: 8, nearest: '0.8 km' },
        transport: { score: 8.2, count: 12, nearest: '0.4 km' },
      },
      walkScore: 75,
      transitScore: 68,
      bikeScore: 62,
    };
  }

  @Get('market-trends')
  @ApiOperation({ summary: 'Get overall market trends' })
  @ApiResponse({ status: 200, description: 'Returns market statistics and trends' })
  getMarketTrends() {
    return {
      averagePricePerSqm: {
        properties: Math.round(Math.random() * 500 + 800),
        villas: Math.round(Math.random() * 300 + 1000),
        apartments: Math.round(Math.random() * 200 + 600),
      },
      marketGrowth: {
        monthly: (Math.random() * 2).toFixed(1) + '%',
        yearly: (Math.random() * 10 + 5).toFixed(1) + '%',
      },
      inventory: {
        total: 1015,
        available: 895,
        sold: 85,
        reserved: 35,
      },
      hotspots: [
        { area: 'Al Mouj', growthRate: 12.5, averagePrice: 450000 },
        { area: 'The Wave', growthRate: 10.2, averagePrice: 380000 },
        { area: 'Qurum', growthRate: 8.7, averagePrice: 320000 },
      ],
    };
  }
}
