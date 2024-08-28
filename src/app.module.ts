import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GlobalConfigModule } from './config/global-config.module';
import { PinoLoggerModule } from './common/pino-logger.module';
import { MysqlDatabaseModule } from './database/mysql.module';
import { UsersModule } from './users/users.module';
import { BooksModule } from './books/books.module';
import { AuthModule } from './auth/auth.module';
import { BookshelfModule } from './bookshelf/bookshelf.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { EventModule } from './common/event.module';
import { MailService } from './users/mail.service';
import { SupportsModule } from './supports/supports.module';

@Module({
  imports: [
    // Config
    GlobalConfigModule,

    // Logger
    PinoLoggerModule,

    // Database
    MysqlDatabaseModule,

    EventModule,

    // AuthModule,
    // PassportModule,
    // JwtModule.register({}),

    // AuthModule,
    UsersModule,
    BooksModule,
    AuthModule,
    BookshelfModule,
    SupportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
