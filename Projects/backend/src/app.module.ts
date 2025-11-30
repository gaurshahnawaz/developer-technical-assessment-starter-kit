import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PropertiesModule } from './properties/properties.module';
import { LandsModule } from './lands/lands.module';
import { ProjectsModule } from './projects/projects.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AgentContactsModule } from './agent-contacts/agent-contacts.module';
import { ListingsModule } from './listings/listings.module';
import { CacheModule } from './cache/cache.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE === 'postgres' ? 'postgres' : 'sqlite',
      host: process.env.DB_TYPE === 'postgres' ? (process.env.DB_HOST || 'db') : undefined,
      port: process.env.DB_TYPE === 'postgres' ? parseInt(process.env.DB_PORT || '5432') : undefined,
      username: process.env.DB_TYPE === 'postgres' ? (process.env.DB_USERNAME || 'postgres') : undefined,
      password: process.env.DB_TYPE === 'postgres' ? (process.env.DB_PASSWORD || 'postgres') : undefined,
      database: process.env.DB_TYPE === 'postgres' ? (process.env.DB_DATABASE || 'postgres') : 'real_estate.db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Auto-sync schema for SQLite
      logging: process.env.NODE_ENV === 'development',
      ...(process.env.DB_TYPE === 'sqlite' && {
        extra: {
          supportBigNumbers: true,
          bigNumberStrings: true,
        }
      })
    }),
    CacheModule,
    AuthModule,
    UsersModule,
    PropertiesModule,
    LandsModule,
    ProjectsModule,
    AgentContactsModule,
    ListingsModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
