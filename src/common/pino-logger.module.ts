import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        pinoHttp: {
          autoLogging: {
            ignore: (req) => {
              const path = req.url;
              return ['/health'].includes(path);
            },
          },
          transport:
            configService.get('app.environment') === 'development'
              ? {
                  target: 'pino-pretty',
                  options: {
                    colorize: true,
                    levelFirst: true,
                    singleLine: false,
                    translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l', //SYS: prefix는 현재 서버시간과 동기화
                  },
                }
              : undefined,
          level:
            configService.get('app.environment') === 'development'
              ? 'debug'
              : 'info',
          // HTTP custom serializer TODO refactor
          serializers: {
            req: (req) => {
              if (
                req.method === 'POST' ||
                req.method === 'PATCH' ||
                req.method === 'PUT'
              ) {
                req.body = req.raw.body;
              }
              return req;
            },
          },
          customReceivedObject: (req, res, val) => {
            return {
              type: 'REQUEST_RECEIVED',
            };
          },
          customSuccessObject: (req, res, val) => {
            const userInfo = req['user'];
            return {
              ...val,
              type:
                res.statusCode < 300 ? 'REQUEST_PROCESSED' : 'REQUEST_FAILED',
              userId: !userInfo ? 'NO_AUTH' : userInfo['id'],
            };
          },
          customErrorObject: (req, res, err, val) => {
            // TODO error code ?
            return {
              ...val,
              type: 'REQUEST_FAILED',
            };
          },
          redact: ['password'],
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class PinoLoggerModule {}
