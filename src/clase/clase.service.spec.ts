import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClaseService } from './clase.service';
import { ClaseEntity } from './clase.entity/clase.entity';
import { faker } from '@faker-js/faker';

describe('ClaseService', () => {
  let service: ClaseService;
  let repository: Repository<ClaseEntity>;
  let clase: ClaseEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClaseService],
    }).compile();

    service = module.get<ClaseService>(ClaseService);
    repository = module.get<Repository<ClaseEntity>>(getRepositoryToken(ClaseEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    await repository.clear();
    clase = await repository.save({
      nombre: faker.lorem.word(),
      codigo: faker.string.alphanumeric(10),
      numeroCreditos: faker.number.int({ min: 1, max: 4 }),
    });
  };

  it('crearClase should not allow creating a class with a code of more than 10 characters', async () => {
    const claseNew: ClaseEntity = {
        id: 3,
        nombre: faker.lorem.word(),
        codigo: faker.string.alphanumeric(11),
        numeroCreditos: faker.number.int({ min: 1, max: 4 }),
        usuario: null,
        bonos: [],
    };

    await expect(service.crearClase(claseNew)).rejects.toHaveProperty(
        'message',
        'The class code must be exactly 10 characters long',
    );
  });

  it('findClaseById should not find a class that does not exist and must throw an exception', async () => {
    const invalidId = 12345;
    await expect(service.findClaseById(invalidId)).rejects.toHaveProperty(
      'message',
      'The class with the given id was not found',
    );
  });

  it('crearClase should allow the creation of classes with different names and unique codes', async () => {
    const claseNew: ClaseEntity = {
        id: 1,
        nombre: faker.lorem.word(),
        codigo: '1234567890',
        numeroCreditos: faker.number.int({ min: 2, max: 4 }),
        usuario: null,
        bonos: [],
    };

    const claseCreated = await service.crearClase(claseNew);
    expect(claseCreated).not.toBeNull();

    const claseFound = await repository.findOne({
        where: { id: claseCreated.id },
    });
    expect(claseFound).not.toBeNull();
    expect(claseFound.nombre).toEqual(claseNew.nombre);
    expect(claseFound.codigo).toHaveLength(10);
});


  it('crearClase should put an exception the creation of classes with different names and unique codes', async () => {
    const claseNew: ClaseEntity = {
      id: 1,
      nombre: faker.lorem.word(),

      codigo: faker.string.alphanumeric(11),
      numeroCreditos: faker.number.int({ min: 2, max: 4 }),
      usuario: null,
      bonos: [],
    };
    await expect(service.crearClase(claseNew)).rejects.toHaveProperty(
      'message',
      'The class code must be exactly 10 characters long',
    );
  });
});