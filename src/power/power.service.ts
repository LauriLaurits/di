import { Injectable } from '@nestjs/common';

@Injectable()
export class PowerService {
  supplyPower(watts: number) {
    console.log(`secondcommit1 ${watts} worth of test.`);
  }
}
