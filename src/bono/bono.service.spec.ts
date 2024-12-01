import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BonoService } from './bono.service';
import { UsuarioService } from '../usuario/usuario.service';
import { BonoEntity } from '../bono/bono.entity/bono.entity';
import { ClaseEntity } from '../clase/clase.entity/clase.entity';
import { UsuarioEntity } from '../usuario/usuario.entity/usuario.entity';
import { faker } from '@faker-js/faker';

describe('BonoService', () => {
  let service: BonoService;
  let repositoryBono: Repository<BonoEntity>;
  let repositoryUsuario: Repository<UsuarioEntity>;
  let repositoryClase: Repository<ClaseEntity>;
  let bonoList: BonoEntity[] = [];
  let profesorUsuario: UsuarioEntity;
  let decanaUsuario: UsuarioEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [BonoService, UsuarioService],
    }).compile();

    service = module.get<BonoService>(BonoService);

    repositoryBono = module.get<Repository<BonoEntity>>(
      getRepositoryToken(BonoEntity),
    );

    repositoryClase = module.get<Repository<ClaseEntity>>(
      getRepositoryToken(ClaseEntity),
    );

    repositoryUsuario = module.get<Repository<UsuarioEntity>>(
      getRepositoryToken(UsuarioEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    await repositoryBono.clear();
    await repositoryUsuario.clear();
    await repositoryClase.clear();

    bonoList = [];

    for (let i = 0; i < 5; i++) {
      const bono: BonoEntity = await repositoryBono.save({
        monto: faker.number.int({ min: 1000, max: 100000 }),
        calificacion: faker.number.int({ min: 0, max: 5 }),
        palabraClave: faker.string.alphanumeric(10),
      });
      bonoList.push(bono);
    }

    profesorUsuario = await repositoryUsuario.save({
      cedula: faker.number.int({ min: 1000000000, max: 9999999999 }),
      nombre: faker.person.fullName(),
      grupoInvestigacion: faker.helpers.arrayElement(['TICSW', 'IMAGINE', 'COMIT']),
      numeroExtension: 8,
      rol: 'Profesor',
      bonos: bonoList,
      clases: [],
    });

    decanaUsuario = await repositoryUsuario.save({
      cedula: faker.number.int({ min: 1000000000, max: 9999999999 }),
      nombre: faker.person.fullName(),
      grupoInvestigacion: faker.helpers.arrayElement(['TICSW', 'IMAGINE', 'COMIT']),
      numeroExtension: faker.number.int({ min: 10000000, max: 99999999 }),
      rol: 'Decana',
      bonos: [],
      clases: [],
    });
};


  it('create should return a new Bono when valid monto and Profesor role', async () => {
    const clase = new ClaseEntity();
    const bono: BonoEntity = {
      id: 1,
      monto: 50,
      calificacion: faker.number.float({ min: 0, max: 5 }),
      palabraClave: faker.string.alphanumeric(5),
      usuario: profesorUsuario,
      clase: clase,
    };

    const newBono: BonoEntity = await service.crearBono(bono, profesorUsuario.id);
    expect(newBono).not.toBeNull();

    const storedBono: BonoEntity = await repositoryBono.findOne({
      where: { id: newBono.id },
    });
    expect(storedBono).not.toBeNull();
    expect(storedBono.monto).toEqual(newBono.monto);
    expect(storedBono.calificacion).toEqual(newBono.calificacion);
    expect(storedBono.palabraClave).toEqual(newBono.palabraClave);
  });

  it('create should throw an exception if monto is not positive or user is not Profesor', async () => {
    const bono: BonoEntity = {
      id: 1,
      monto: -10,
      calificacion: faker.number.float({ min: 0, max: 5 }),
      palabraClave: faker.string.alphanumeric(10),
      usuario: decanaUsuario,
      clase: new ClaseEntity(),
    };

    await expect(service.crearBono(bono, decanaUsuario.id)).rejects.toHaveProperty(
      'message',
      'The bonus amount should be positive',
    );
  });

  it('findBonoByCodigo should return a Bono by class code', async () => {
    const bono = bonoList[0];
    const foundBono = await service.findBonoByCodigo(bono.palabraClave);
    expect(foundBono).not.toBeNull();
    expect(foundBono.palabraClave).toEqual(bono.palabraClave);
  });
  

  it('findBonoByCodigo should throw an exception if code is not valid', async () => {
    await expect(service.findBonoByCodigo('no-existent-code')).rejects.toHaveProperty(
      'message',
      'The bonus with the given ID was not found',
    );
  });

  it('findBonosByUsuarioId should return all Bonos of a Usuario by its id', async () => {
    const bonos = await service.findAllBonosByUsuario(profesorUsuario.id);
    expect(bonos).not.toBeNull();
    expect(bonos.length).toEqual(5);
    bonos.forEach((bono) => {
      expect(bono.usuario).toBeDefined();
      expect(bono.usuario.id).toEqual(profesorUsuario.id);
    });
  });
  
  it('findBonosByUsuarioId should throw an exception for invalid Usuario ID', async () => {
    const invalidId = 99999999;
    await expect(() => service.findAllBonosByUsuario(invalidId)).rejects.toHaveProperty(
      'message',
      'The bonus with ID was not found',
    );
  });

  it('deleteBono should remove a bono when calificación <= 4', async () => {
    const bono = await repositoryBono.save({
      monto: 5000,
      calificacion: 3,
      palabraClave: faker.string.alphanumeric(10),
    });

    let storedBono = await repositoryBono.findOne({ where: { id: bono.id } });
    expect(storedBono).not.toBeNull();

    await service.deleteBonoById(bono.id);

    storedBono = await repositoryBono.findOne({ where: { id: bono.id } });
    expect(storedBono).toBeNull();
  });

  it('deleteBono should put an exception on the remove a bono with calificación > 4', async () => {
    const bono = await repositoryBono.save({
      monto: 5000,
      calificacion: 5, 
      palabraClave: faker.string.alphanumeric(10),
    });

    await expect(service.deleteBonoById(bono.id)).rejects.toHaveProperty(
      'message',
      'The bonus cannot be deleted because the grade is above 4',
    );
  });
});