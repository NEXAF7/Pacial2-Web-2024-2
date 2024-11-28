import { Module } from '@nestjs/common';
import { BonoController } from './bono.controller';

@Module({
  controllers: [BonoController]
})
export class BonoModule {}
