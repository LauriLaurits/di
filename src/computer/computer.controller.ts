import { Controller, Get, Logger } from '@nestjs/common';
import { CpuService } from '../cpu/cpu.service';
import { DiskService } from '../disk/disk.service';

@Controller('dsdssfdfds')
export class ComputerController {
  private logger = new Logger('TasksController', { timestamp: true });
  constructor(
    private cpuService: CpuService,
    private diskService: DiskService,
  ) {}

  @Get()
  run() {
    this.logger.verbose(`Test Verbose message`);
    return [this.cpuService.compute(10, 10), this.diskService.getData()];
  }
}
