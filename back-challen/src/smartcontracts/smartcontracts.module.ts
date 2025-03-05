import { Module } from '@nestjs/common';
import { SmartcontractsService } from './smartcontracts.service';
import { SmartcontractsController } from './smartcontracts.controller';
import { SignatureService } from './signature.service';

@Module({
  providers: [SmartcontractsService, SignatureService],
  controllers: [SmartcontractsController],
})
export class SmartcontractsModule {}
