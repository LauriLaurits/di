import { Injectable, Logger } from '@nestjs/common';
import { spawn } from 'child_process';
import { existsSync, mkdtemp, rm } from 'fs';
import { Task } from '../task';
import { tmpdir } from 'os';
import { sep } from 'path';
import { ExecutionResultInterface } from '../execution-result.interface';
//import { ConfigService } from '@nestjs/config';

/*
import alias from '../../config';
*/

@Injectable()
export class ProtoTaskRunnerService {
  private readonly logger = new Logger(this.constructor.name);
  //constructor(private configService: ConfigService) {}

  async runTask(task: Task) {
    let workDir;
    const deploymentPathDefault = '/mnt/test/shared/deployment';

    try {
      workDir = await this.createWorkdir();
      const cloneResult = await this.cloneRepository(task.repository, task.branch, workDir);
      const buildConfig = await this.getBuildConfig(workDir);
      const repositoryName = await ProtoTaskRunnerService.getRepositoryName(
        buildConfig,
        cloneResult,
      );
      const basePath = await this.getDeploymentBasePath(
        buildConfig,
        repositoryName,
        task.branch,
        deploymentPathDefault,
      );
      console.log('BasePath', basePath);
      //const test = this.configService.get<string>('DEPLOYMENT_PATH');

      console.log(test);

      /*
      console.log('Branch', task.branch);
*/
      /*const deploymentPath = await ProtoTaskRunnerService.getBaseDeploymentPath(buildConfig);*/
      /*console.log('BuildConfig', buildConfig);
      console.log('CloneResult', cloneResult);*/
      /*console.log(deploymentPath);*/
    } catch (e) {
    } finally {
      console.log('Finished');
      //TODO delete user temp Dir
      //await this.cleanupWorkdir(workDir);
    }
  }

  private async cloneRepository(repository: string, branch: string, dir: string) {
    console.log({
      repository,
      branch,
      dir,
    });
    return this.runCmd('git', ['clone', repository, '-b', branch, '--single-branch', dir]);
  }

  private async runCmd(cmd: string, args: string[]): Promise<ExecutionResultInterface> {
    return new Promise((resolve, reject) => {
      const cp = spawn(cmd, args);
      const timeout = setTimeout(() => {
        this.logger.log('Killing child process');
        cp.kill('SIGKILL');
      }, 1000 * 1000);
      let stdout = '';
      cp.stdout.on('data', (data) => (stdout += data.toString()));

      let stderr = '';
      cp.stderr.on('data', (data) => (stderr += data.toString()));
      cp.on('close', (code) => {
        clearTimeout(timeout);
        if (code !== 0) {
          return reject({
            stdout,
            stderr,
            code,
          });
        }
        resolve({
          stdout,
          stderr,
          code,
        });
      });
    });
  }

  private createWorkdir(): Promise<string> {
    return new Promise((resolve, reject) => {
      const tmpDir = tmpdir();
      mkdtemp(`${tmpDir}${sep}`, (err, directory) => {
        if (err) {
          return reject(err);
        }
        this.logger.log(`Created working directory "${directory}"`);
        return resolve(directory);
      });
    });
  }

  private cleanupWorkdir(workDir: string | undefined): Promise<void> {
    if (!workDir) {
      return;
    }
    return new Promise((resolve, reject) => {
      return rm(
        workDir,
        {
          recursive: true,
          force: true,
        },
        (err) => {
          if (err) {
            this.logger.error(`Cleanup failed "${workDir}"`);
            return reject(err);
          }
          this.logger.log(`Cleaned up directory "${workDir}"`);
          return resolve();
        },
      );
    });
  }

  private async getBuildConfig(workDir: string) {
    const buildConfig = workDir + '/build-config.ts';
    const exist = existsSync(buildConfig);
    if (exist) {
      return require(buildConfig);
    }
    //TODO delete work Dir
    this.logger.log(`build-config.js missing`);
  }

  private static async getRepositoryName(buildConfig: any, cloneResult: any) {
    let repositoryName = cloneResult.repository;
    if (buildConfig.projectName) {
      repositoryName = buildConfig.projectName;
    }
    return repositoryName;
  }

  private async getDeploymentBasePath(
    buildConfig: any,
    repositoryName,
    branchName,
    deploymentPathDefault,
  ) {
    let deploymentBasePath;
    if (buildConfig.buildDirectory) {
      if (!existsSync(buildConfig.buildDirectory)) {
        /* this.logger.log(`Deployment path ${buildConfig.buildDirectory} is missing`);
        throw new Error(`Deployment path ${buildConfig.buildDirectory} is missing`);*/
      }
      deploymentBasePath =
        buildConfig.buildDirectory +
        '/' +
        buildConfig.clientName.replace(/\//g, '-') +
        '/' +
        repositoryName +
        '/' +
        branchName;
    } else {
      deploymentBasePath =
        deploymentPathDefault +
        '/' +
        buildConfig.clientName.replace(/\//g, '-') +
        '/' +
        repositoryName +
        '/' +
        branchName;
    }
    return deploymentBasePath;
  }

  private async deploymentPath(deploymentBasePath) {
    const deploymentPath = deploymentBasePath + '/';
    return deploymentPath;
  }

  /*private async startBuild Proccess (buildConfig: any) {

  }*/
}
