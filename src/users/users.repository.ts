import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AppRole } from '../common/roles.enum';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findById(id: bigint) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  create(data: { email: string; password_hash: string; role: AppRole }) {
    return this.prisma.user.create({ data });
  }
}
