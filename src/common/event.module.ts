import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      // cf) https://github.com/EventEmitter2/EventEmitter2
      wildcard: true,
      ignoreErrors: true,
    }),
  ],
})
export class EventModule {}
