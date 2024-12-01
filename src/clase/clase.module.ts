import { ClaseEntity } from './clase.entity/clase.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ClaseService } from './clase.service';
import { ClaseController } from './clase.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ClaseEntity])],
  providers: [ClaseService],
  exports: [ClaseService],
  controllers: [ClaseController]
})
export class ClaseModule {}