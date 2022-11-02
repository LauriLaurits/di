import { Injectable } from '@nestjs/common';

@Injectable()
export class PowerService {
  supplyPower(watts: number) {
    console.log(`test_for_secondcommit1 ${watts} worth of test.`);
  }
}
