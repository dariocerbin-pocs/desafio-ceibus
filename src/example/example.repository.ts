import { Injectable } from '@nestjs/common';

@Injectable()
export class ExampleRepository {
  getGreeting() {
    return { message: 'Hello from Example!' };
  }
}
