import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('mysql.host'),
        port: configService.get('mysql.port'),
        database: configService.get('mysql.database'),
        username: configService.get('mysql.user'),
        password: configService.get('mysql.password'),
        timezone: '+00:00',
        entities: ['dist/src/**/*.entity{.ts,.js}'],
        autoLoadEntities: true,
        synchronize: configService.get('mysql.sync'),
        migrations: ['dist/src/database/migration/*.js'],
        cli: { migrationsDir: 'src/database/migration' },
        logging: configService.get('mysql.log'),
        bigNumberStrings: false,
        cache: true,
        legacySpatialSupport: false,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class MysqlDatabaseModule {}
