import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { AppRole } from '../common/roles.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  // For demo purposes, issues a token for a given user id
  issueToken(userId: string | bigint, role?: AppRole) {
    return this.jwtService.sign({ sub: userId, role });
  }

  async register(email: string, password: string, role: AppRole = AppRole.USER) {
    const existing = await this.usersService.findByEmail(email);
    if (existing) throw new ConflictException('Email already registered');
    const password_hash = await bcrypt.hash(password, 10);
    const user = await this.usersService.create(email, password_hash, role);
    return { access_token: this.issueToken(user.id, user.role as AppRole) };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    return { access_token: this.issueToken(user.id, user.role as AppRole) };
  }
}
