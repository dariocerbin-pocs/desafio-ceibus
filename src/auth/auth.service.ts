import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  // For demo purposes, issues a token for a given user id
  issueToken(userId: string) {
    return this.jwtService.sign({ sub: userId });
  }
}
