import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AppService } from './app.service';
import { PropertiesService } from './properties/properties.service';
import { ProjectsService } from './projects/projects.service';
import { LandsService } from './lands/lands.service';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly propertiesService: PropertiesService,
    private readonly projectsService: ProjectsService,
    private readonly landsService: LandsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Health check' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiOperation({ summary: 'API health status' })
  healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'Real Estate Platform API',
    };
  }

  @Get('seed')
  @ApiOperation({ summary: 'Populate database with sample data (development only)' })
  async seedDatabase() {
    try {
      const sampleProperties = [
        {
          id: 'prop-1',
          title: 'Modern Villa in Al Khoudh',
          description: 'A beautiful modern villa with spacious gardens and luxury amenities',
          price: 450000,
          location: 'Al Khoudh, Muscat',
          type: 'villa',
          bedrooms: 4,
          bathrooms: 3,
          area: 350,
          status: 'available',
          features: 'Garden, Pool, Garage',
        },
        {
          id: 'prop-2',
          title: 'Luxury Apartment Downtown',
          description: 'Premium apartment in the heart of the city with stunning views',
          price: 280000,
          location: 'Downtown, Muscat',
          type: 'apartment',
          bedrooms: 3,
          bathrooms: 2,
          area: 200,
          status: 'available',
          features: 'Gym, Parking, Views',
        },
        {
          id: 'prop-3',
          title: 'Family Home in Qurum',
          description: 'Spacious family home with modern amenities and garden',
          price: 350000,
          location: 'Qurum, Muscat',
          type: 'villa',
          bedrooms: 5,
          bathrooms: 4,
          area: 450,
          status: 'available',
          features: 'Maid Room, Garden, Pool',
        },
        {
          id: 'prop-4',
          title: 'Beachfront Villa Muscat',
          description: 'Exclusive beachfront property with private beach access',
          price: 750000,
          location: 'Muscat Beach, Muscat',
          type: 'villa',
          bedrooms: 6,
          bathrooms: 5,
          area: 600,
          status: 'available',
          features: 'Beach Access, Pool, Garage',
        },
        {
          id: 'prop-5',
          title: 'Studio Apartment Al Seeb',
          description: 'Compact and affordable studio apartment',
          price: 95000,
          location: 'Al Seeb, Muscat',
          type: 'apartment',
          bedrooms: 1,
          bathrooms: 1,
          area: 80,
          status: 'available',
          features: 'Furnished, Parking',
        },
        {
          id: 'prop-6',
          title: 'Penthouse Ruwi',
          description: 'Luxury penthouse with panoramic city views',
          price: 850000,
          location: 'Ruwi, Muscat',
          type: 'apartment',
          bedrooms: 4,
          bathrooms: 3,
          area: 400,
          status: 'available',
          features: 'Penthouse, Elevator, Gym',
        },
      ];

      const sampleProjects = [
        {
          id: 'proj-1',
          title: 'Muscat Heights Development',
          description: 'New residential development with modern apartments and facilities',
          location: 'Al Khoudh, Muscat',
          developer: 'OHB Development Corp',
          totalUnits: 150,
          availableUnits: 45,
          startingPrice: 200000,
          status: 'ongoing',
          amenities: 'Gym, Pool, Park, Shopping Center',
          completionDate: new Date('2024-12-31'),
        },
        {
          id: 'proj-2',
          title: 'Marina Bay Residences',
          description: 'Luxury waterfront residential project with premium amenities',
          location: 'Marina Bandar, Muscat',
          developer: 'Gulf Real Estate',
          totalUnits: 200,
          availableUnits: 67,
          startingPrice: 350000,
          status: 'ongoing',
          amenities: 'Beach Access, Marina, Restaurants',
          completionDate: new Date('2025-06-30'),
        },
        {
          id: 'proj-3',
          title: 'Al Reef Residential Complex',
          description: 'Gated residential community with school and mall',
          location: 'Al Reef, Muscat',
          developer: 'Reef Properties Ltd',
          totalUnits: 300,
          availableUnits: 120,
          startingPrice: 150000,
          status: 'ongoing',
          amenities: 'School, Mall, Park, Mosque',
          completionDate: new Date('2025-03-15'),
        },
      ];

      const sampleLands = [
        {
          id: 'land-1',
          title: 'Residential Plot Al Seeb',
          description: 'Prime residential land for villa development',
          price: 150000,
          location: 'Al Seeb, Muscat',
          area: 500,
          zoning: 'Residential',
          status: 'available',
          features: 'Corner Plot, Road Access',
        },
        {
          id: 'land-2',
          title: 'Commercial Land Ghubra',
          description: 'Commercial zone land suitable for office or retail',
          price: 280000,
          location: 'Ghubra, Muscat',
          area: 800,
          zoning: 'Commercial',
          status: 'available',
          features: 'High Traffic, Easy Access',
        },
        {
          id: 'land-3',
          title: 'Industrial Plot Sohar',
          description: 'Large industrial land near port',
          price: 450000,
          location: 'Sohar, Oman',
          area: 2000,
          zoning: 'Industrial',
          status: 'available',
          features: 'Port Access, Utilities',
        },
      ];

      // Insert properties
      for (const prop of sampleProperties) {
        try {
          await this.propertiesService.create(prop as any);
        } catch (e) {
          // Skip if already exists
        }
      }

      // Insert projects
      for (const proj of sampleProjects) {
        try {
          await this.projectsService.create(proj as any);
        } catch (e) {
          // Skip if already exists
        }
      }

      // Insert lands
      for (const land of sampleLands) {
        try {
          await this.landsService.create(land as any);
        } catch (e) {
          // Skip if already exists
        }
      }

      return {
        status: 'success',
        message: 'Database seeded with sample data',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}
