import { Injectable } from '@nestjs/common';

@Injectable()
export class PowerService {
  supplyPower(watts: number) {
    console.log(`Sgfggfdsfsdfgfupplying ${watts} worth of power.`);
  }
}
