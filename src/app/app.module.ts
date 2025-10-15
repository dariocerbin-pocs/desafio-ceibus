import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../config/configuration';
import { ExampleModule } from '../example/example.module';
import { AuthModule } from '../auth/auth.module';
import { SecureModule } from '../secure/secure.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    AuthModule,
    ExampleModule,
    SecureModule,
  ],
})
export class AppModule {}
