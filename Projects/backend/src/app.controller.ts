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

  @Get('seed-large')
  @ApiOperation({ summary: 'Populate database with 1000+ records for testing' })
  async seedLargeDatabase() {
    try {
      const propertyTypes = ['villa', 'apartment', 'townhouse', 'penthouse', 'studio'];
      const locations = [
        'Al Mouj, Muscat', 'Qurum, Muscat', 'Madinat Al Sultan Qaboos', 'The Wave, Muscat',
        'Shatti Al Qurum', 'Al Khouwair', 'Azaiba', 'Ghubrah', 'Ruwi', 'Salalah',
        'Sohar', 'Nizwa', 'Sur', 'Ibri', 'Al Hail', 'Muscat Hills', 'Bousher',
        'Marina Bandar Al Rowdha', 'Al Khoudh', 'Seeb'
      ];
      const statuses = ['available', 'sold', 'reserved'];
      const featureSets = [
        ['parking', 'security', 'gym', 'pool', 'garden'],
        ['parking', 'security', 'balcony'],
        ['parking', 'security'],
        ['furnished', 'parking', 'ac'],
      ];

      // Generate 400 properties
      const properties = [];
      for (let i = 1; i <= 400; i++) {
        const type = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
        const location = locations[Math.floor(Math.random() * locations.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const features = featureSets[Math.floor(Math.random() * featureSets.length)];
        
        let bedrooms, bathrooms, area, price;
        if (type === 'studio') {
          bedrooms = 0;
          bathrooms = 1;
          area = 40 + Math.random() * 60;
          price = 60000 + Math.random() * 80000;
        } else if (type === 'apartment') {
          bedrooms = 1 + Math.floor(Math.random() * 3);
          bathrooms = 1 + Math.floor(Math.random() * 2);
          area = 80 + Math.random() * 170;
          price = 90000 + Math.random() * 310000;
        } else if (type === 'townhouse') {
          bedrooms = 2 + Math.floor(Math.random() * 3);
          bathrooms = 2 + Math.floor(Math.random() * 2);
          area = 150 + Math.random() * 200;
          price = 150000 + Math.random() * 300000;
        } else if (type === 'penthouse') {
          bedrooms = 3 + Math.floor(Math.random() * 3);
          bathrooms = 3 + Math.floor(Math.random() * 3);
          area = 250 + Math.random() * 350;
          price = 350000 + Math.random() * 650000;
        } else {
          bedrooms = 3 + Math.floor(Math.random() * 4);
          bathrooms = 3 + Math.floor(Math.random() * 4);
          area = 300 + Math.random() * 450;
          price = 300000 + Math.random() * 900000;
        }

        properties.push({
          id: `prop-${i}`,
          title: `Modern ${type.charAt(0).toUpperCase() + type.slice(1)} in ${location.split(',')[0]}`,
          description: `Beautifully designed ${type} with modern amenities in ${location}. Perfect for families and investors.`,
          price: Math.round(price),
          location,
          type,
          bedrooms,
          bathrooms,
          area: Math.round(area * 100) / 100,
          status,
          features: features.join(', '),
        });
      }

      // Generate 300 lands
      const zoningTypes = ['residential', 'commercial', 'industrial', 'agricultural', 'mixed-use'];
      const landLocations = [
        'Muscat Hills', 'Al Hail, Muscat', 'Marina, Muscat', 'Nizwa', 'Sohar',
        'Salalah', 'Sur', 'Ibri', 'Al Khoudh', 'Barka', 'Bousher', 'Seeb',
        'Al Amerat', 'Quriyat', 'Rustaq', 'Bahla', 'Ibra', 'Bidbid'
      ];

      const lands = [];
      for (let i = 1; i <= 300; i++) {
        const zoning = zoningTypes[Math.floor(Math.random() * zoningTypes.length)];
        const location = landLocations[Math.floor(Math.random() * landLocations.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        let area, price;
        if (zoning === 'residential') {
          area = 500 + Math.random() * 2000;
          price = 100000 + Math.random() * 400000;
        } else if (zoning === 'commercial') {
          area = 1000 + Math.random() * 3000;
          price = 250000 + Math.random() * 750000;
        } else if (zoning === 'industrial') {
          area = 2000 + Math.random() * 5000;
          price = 400000 + Math.random() * 1200000;
        } else if (zoning === 'agricultural') {
          area = 5000 + Math.random() * 20000;
          price = 50000 + Math.random() * 200000;
        } else {
          area = 1500 + Math.random() * 3500;
          price = 300000 + Math.random() * 800000;
        }

        lands.push({
          id: `land-${i}`,
          title: `${zoning.charAt(0).toUpperCase() + zoning.slice(1)} Land Plot in ${location}`,
          description: `Prime ${zoning} land in ${location}. Excellent location with utilities and road access.`,
          price: Math.round(price),
          location,
          area: Math.round(area),
          zoning: zoning.charAt(0).toUpperCase() + zoning.slice(1),
          status,
          features: 'Road Access, Utilities, Clear Ownership',
        });
      }

      // Generate 300 projects
      const projectNames = [
        'Heights', 'Bay Residences', 'Residential Complex', 'Plaza Development',
        'Waterfront', 'Gardens', 'Court', 'Towers', 'Square', 'Park'
      ];
      const developers = [
        'OHB Development', 'Gulf Real Estate', 'Reef Properties', 'Al Reef Developers',
        'Marina Builders', 'Urban Construction', 'Premium Developments', 'Luxury Homes Ltd'
      ];

      const projects = [];
      for (let i = 1; i <= 300; i++) {
        const name = projectNames[Math.floor(Math.random() * projectNames.length)];
        const location = locations[Math.floor(Math.random() * locations.length)];
        const developer = developers[Math.floor(Math.random() * developers.length)];
        const status = 'ongoing'; // or 'completed', 'planning'
        
        const totalUnits = 50 + Math.floor(Math.random() * 400);
        const availableUnits = Math.floor(totalUnits * (0.2 + Math.random() * 0.6));
        const startingPrice = 150000 + Math.random() * 600000;

        projects.push({
          id: `proj-${i}`,
          title: `${name} ${i}`,
          description: `Premium development project with modern architecture and world-class amenities in ${location}.`,
          location,
          developer,
          totalUnits,
          availableUnits,
          startingPrice: Math.round(startingPrice),
          status,
          amenities: featureSets[Math.floor(Math.random() * featureSets.length)].join(', '),
          completionDate: new Date(2025 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 12), 1),
        });
      }

      let insertedCount = 0;
      let skippedCount = 0;

      // Insert properties
      for (const prop of properties) {
        try {
          await this.propertiesService.create(prop as any);
          insertedCount++;
        } catch (e) {
          skippedCount++;
        }
      }

      // Insert lands
      for (const land of lands) {
        try {
          await this.landsService.create(land as any);
          insertedCount++;
        } catch (e) {
          skippedCount++;
        }
      }

      // Insert projects
      for (const proj of projects) {
        try {
          await this.projectsService.create(proj as any);
          insertedCount++;
        } catch (e) {
          skippedCount++;
        }
      }

      return {
        status: 'success',
        message: `Database seeded with large dataset`,
        inserted: insertedCount,
        skipped: skippedCount,
        total: 1000,
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
