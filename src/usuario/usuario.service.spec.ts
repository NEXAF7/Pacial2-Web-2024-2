import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsuarioService } from './usuario.service';
import { UsuarioEntity } from './usuario.entity/usuario.entity';
import { BonoEntity } from '../bono/bono.entity/bono.entity';
import { faker } from '@faker-js/faker';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let repository: Repository<UsuarioEntity>;
  let usuarioList: UsuarioEntity[];
  let bonoRepository: Repository<BonoEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [UsuarioService],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);
    repository = module.get<Repository<UsuarioEntity>>(
      getRepositoryToken(UsuarioEntity),
    );
    bonoRepository = module.get<Repository<BonoEntity>>(
      getRepositoryToken(BonoEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    usuarioList = [];
    for (let i = 0; i < 5; i++) {
      const usuario: UsuarioEntity = await repository.save({
        cedula: faker.number.int({ min: 1000000000, max: 9999999999 }),
        nombre: faker.person.fullName(),
        grupoInvestigacion: faker.helpers.arrayElement([
          'TICSW',
          'IMAGINE',
          'COMIT',
        ]),
        numeroExtension: faker.number.int({ min: 10000000, max: 99999999 }),
        rol: faker.helpers.arrayElement(['Profesor', 'Decana']),
      });
      usuarioList.push(usuario);
    }
  };

  it('create should return a new usuario with valid Professor role and group', async () => {
    const usuario: UsuarioEntity = {
      cedula: faker.number.int({ min: 1000000000, max: 9999999999 }),
      nombre: faker.person.fullName(),
      grupoInvestigacion: 'IMAGINE',
      numeroExtension: faker.number.int({ min: 10000000, max: 99999999 }),
      rol: 'Profesor',
      bonos: [],
      clases: [],
      usuario: null,  
      id: undefined,
    };
  
    const nuevoUsuario: UsuarioEntity = await service.crearUsuario(usuario);
    expect(nuevoUsuario).not.toBeNull();
  
    const storedUsuario: UsuarioEntity = await repository.findOne({
      where: { id: nuevoUsuario.id },
    });
    expect(storedUsuario).not.toBeNull();
    expect(storedUsuario.rol).toEqual(nuevoUsuario.rol);
    expect(storedUsuario.grupoInvestigacion).toEqual('IMAGINE');
  });
  
  it('create should throw an error when trying to create a Profesor with an invalid research group', async () => {

    const usuario: UsuarioEntity = {
      id: null,
      cedula: faker.number.int({ min: 1000000000, max: 9999999999 }),
      nombre: faker.person.fullName(),
      grupoInvestigacion: 'INVALID_GROUP',
      numeroExtension: faker.number.int({ min: 10000000, max: 99999999 }),
      rol: 'Profesor',
      bonos: [],
      clases: [],
      usuario: null, 
    };

    await expect(() => service.crearUsuario(usuario)).rejects.toHaveProperty(
      'message',
      'The user should be in one of the following groups: TICSW, IMAGINE, COMIT.',
    );
  });

  it('findUsuarioById should return the correct usuario by id', async () => {
    const storedUsuario: UsuarioEntity = usuarioList[0];
    const usuario: UsuarioEntity = await service.findUsuarioById(
      storedUsuario.id,
    );
    expect(usuario).not.toBeNull();
    expect(usuario.id).toEqual(storedUsuario.id);
    expect(usuario.nombre).toEqual(storedUsuario.nombre);
  });

  it('findUsuarioById should throw an exception if invalid ID type is passed', async () => {
    await expect(() => service.findUsuarioById('invalid_id' as any)).rejects.toHaveProperty(
      'message',
      'The id is not valid',
    );
  });

  it('deleteUsuario should successfully delete a user without bonos', async () => {
    const usuario: UsuarioEntity = usuarioList[0];
    await service.eliminarUsuario(usuario.id);

    const deletedUsuario: UsuarioEntity = await repository.findOne({
      where: { id: usuario.id },
    });
    expect(deletedUsuario).toBeNull();
  });

  it('deleteUsuario should throw an exception when trying to delete a user with associated bonos', async () => {
    const usuario: UsuarioEntity = await repository.save({
      cedula: faker.number.int({ min: 1000000000, max: 9999999999 }),
      nombre: faker.person.fullName(),
      grupoInvestigacion: 'TICSW',
      numeroExtension: 12345678,
      rol: 'Profesor',
    });
  
    await bonoRepository.save({
      monto: 500,
      calificacion: 4.5,
      palabraClave: 'Research',
      usuario,
    });
  
    await expect(() => service.eliminarUsuario(usuario.id)).rejects.toHaveProperty(
      'message',
      'The user cannot be deleted because it has associated bonos',
    );
  });  
});
