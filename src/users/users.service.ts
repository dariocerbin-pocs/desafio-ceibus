import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { AppRole } from '../common/roles.enum';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  findByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }

  findById(id: bigint) {
    return this.usersRepository.findById(id);
  }

  create(email: string, password_hash: string, role: AppRole) {
    return this.usersRepository.create({ email, password_hash, role });
  }
}
