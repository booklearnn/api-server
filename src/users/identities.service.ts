import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { Injectable } from '@nestjs/common';
import { Identity } from './entities/identity.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class IdentitiesService extends TypeOrmCrudService<Identity> {
  constructor(
    @InjectRepository(Identity)
    public repo: Repository<Identity>,
  ) {
    super(repo);
  }
}
