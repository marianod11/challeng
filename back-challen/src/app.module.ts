import { Module } from '@nestjs/common';
import { SmartcontractsModule } from './smartcontracts/smartcontracts.module';

@Module({
  imports: [ SmartcontractsModule],
})
export class AppModule {}
