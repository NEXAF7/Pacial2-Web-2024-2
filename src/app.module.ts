import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClaseModule } from './clase/clase.module';
import { BonoModule } from './bono/bono.module';
import { UsuarioModule } from './usuario/usuario.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClaseEntity } from "./clase/clase.entity/clase.entity";
import { UsuarioEntity } from "./usuario/usuario.entity/usuario.entity";
import { BonoEntity } from "./bono/bono.entity/bono.entity";

@Module({
  imports: [BonoModule, ClaseModule, UsuarioModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '',
      database: 'estudiante',
      entities: [BonoEntity, ClaseEntity, UsuarioEntity],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true})
  ],
  controllers: [AppController],
  providers: [AppService],
  
})
export class AppModule {}
