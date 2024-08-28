import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from './app.config';
import mysqlConfig from './mysql.config';
import jwtConfig from './jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      /**
       * NOTE: 서버 배포 환경(REMOTE_ENV=true) 에서는 s3에 업로드된 환경변수가 적용된다.
       */
      envFilePath: Boolean(process.env.REMOTE_ENV)
        ? []
        : process.env.NODE_ENV
        ? `.${process.env.NODE_ENV}.env`
        : [
            '.local.development.env',
            '.development.env',
            '.production.env',
            '.env',
          ],
      ignoreEnvFile: Boolean(process.env.REMOTE_ENV),
      load: [appConfig, mysqlConfig, jwtConfig],
    }),
  ],
})
export class GlobalConfigModule {}
