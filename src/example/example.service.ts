import { Injectable } from '@nestjs/common';
import { ExampleRepository } from './example.repository';

@Injectable()
export class ExampleService {
  constructor(private readonly exampleRepository: ExampleRepository) {}

  getHello() {
    return this.exampleRepository.getGreeting();
  }
}
