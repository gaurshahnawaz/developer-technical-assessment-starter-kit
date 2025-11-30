import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PropertiesService } from './properties/properties.service';
import { ProjectsService } from './projects/projects.service';
import { LandsService } from './lands/lands.service';

async function seed() {
  const app = await NestFactory.create(AppModule);

  const propertiesService = app.get(PropertiesService);
  const projectsService = app.get(ProjectsService);
  const landsService = app.get(LandsService);

  const sampleProperties = [
    {
      id: 'prop-1',
      title: 'Modern Villa in Al Khoudh',
      description: 'A beautiful modern villa with spacious gardens',
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
      description: 'Premium apartment in the heart of the city',
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
      description: 'Spacious family home with modern amenities',
      price: 350000,
      location: 'Qurum, Muscat',
      type: 'villa',
      bedrooms: 5,
      bathrooms: 4,
      area: 450,
      status: 'available',
      features: 'Maid Room, Garden, Pool',
    },
  ];

  const sampleProjects = [
    {
      id: 'proj-1',
      title: 'Muscat Heights Development',
      description: 'New residential development with modern apartments',
      location: 'Al Khoudh, Muscat',
      developer: 'OHB Development Corp',
      totalUnits: 150,
      availableUnits: 45,
      startingPrice: 200000,
      status: 'ongoing',
      amenities: 'Gym, Pool, Park, Shopping Center',
      completionDate: '2024-12-31',
    },
    {
      id: 'proj-2',
      title: 'Marina Bay Residences',
      description: 'Luxury waterfront residential project',
      location: 'Marina Bandar, Muscat',
      developer: 'Gulf Real Estate',
      totalUnits: 200,
      availableUnits: 67,
      startingPrice: 350000,
      status: 'ongoing',
      amenities: 'Beach Access, Marina, Restaurants',
      completionDate: '2025-06-30',
    },
  ];

  const sampleLands = [
    {
      id: 'land-1',
      title: 'Residential Plot Al Seeb',
      description: 'Prime residential land for development',
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
  ];

  try {
    console.log('Seeding properties...');
    for (const prop of sampleProperties) {
      await propertiesService.create(prop as any);
    }

    console.log('Seeding projects...');
    for (const proj of sampleProjects) {
      await projectsService.create(proj as any);
    }

    console.log('Seeding lands...');
    for (const land of sampleLands) {
      await landsService.create(land as any);
    }

    console.log('Seeding complete!');
  } catch (error) {
    console.error('Error during seeding:', error);
  }

  await app.close();
}

seed();
