import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobsModule } from './jobs/jobs.module.js';


@Module({
  imports: [
    // 1. Load .env file, make it available everywhere
    ConfigModule.forRoot({
      isGlobal: true,  // no need to import ConfigModule in every sub-module
    }),

    // 2. Connect to Postgres using values from .env
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        autoLoadEntities: true,  // auto-register any entity we create
        synchronize: true,       // auto-create tables — DEV ONLY
      }),
    }),
    
    JobsModule,
  ],
})
export class AppModule {}

