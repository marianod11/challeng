import { Controller, Post, Body, Get, Param, HttpException , HttpStatus} from '@nestjs/common';
import { SmartcontractsService } from './smartcontracts.service';
import { BodyListTokenOrStoreSignature, BodyTokenId } from './interfaces/interfaces';
import { SignatureService } from './signature.service';

@Controller('smartcontracts')
export class SmartcontractsController {
    constructor(
        private readonly smartcontractsService: SmartcontractsService,
        private readonly signatureService: SignatureService
    ) { }

    @Post('/storeSignature')
    async storeSignature(@Body() data: BodyListTokenOrStoreSignature) {
        return await this.signatureService.storeSignature(data);
    }

    @Post('/list')
    async listToken(@Body() body: BodyListTokenOrStoreSignature) {
        
        const { signature } = body;
        if(signature) {
            return this.smartcontractsService.listTokenWithSignature(body);
        }else {
            return this.smartcontractsService.listToken(body);
        }
    }

    @Post('/purchase')
    async buyToken(@Body() body: BodyTokenId) {
        const { tokenId } = body;
        return this.smartcontractsService.purchaseToken(tokenId);
    }

    @Post('/withdraw')
    async withdrawToken(@Body() body: BodyTokenId) {
        const { tokenId } = body;
        return this.smartcontractsService.withdrawToken(tokenId);
    }


    @Get('/availableAndSold')
    async getAvailableTokens() {
        return this.smartcontractsService.getAvailableAndSoldTokens();
    }

    @Get('/nonce/:address')
    async getNonce(@Param('address') address: string) {
        return this.smartcontractsService.getNonce(address);
    }

    @Get('/tokenListSignatures')
    async getTokenListStoreSignatures() {
        return this.signatureService.getTokenListStoreSignatures();
    }

    @Get('/tokenListUser/:address')
    async getTokenListUser(@Param('address') address: string) {
        return this.smartcontractsService.getTokenListUser(address);
    }

    @Post("/genereteEIP712Message")
    async generateEIP712Message() {
        return await this.signatureService.generateEIP712Message();
    }

    @Post("/deleteSignature")
    async deleteSignature(@Body() body: BodyListTokenOrStoreSignature) {
        if(!body.signature) {
            throw new HttpException(`Error: Signature is required.`, HttpStatus.BAD_REQUEST);
        }
        const {signature} = body;
        return await this.signatureService.deleteSignature(signature);
    }
}
