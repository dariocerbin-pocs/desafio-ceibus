import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../config/configuration';
import { ExampleModule } from '../example/example.module';
import { AuthModule } from '../auth/auth.module';
import { SecureModule } from '../secure/secure.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    PrismaModule,
    AuthModule,
    ExampleModule,
    SecureModule,
  ],
})
export class AppModule {}
