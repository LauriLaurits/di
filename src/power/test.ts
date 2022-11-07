import { copyFileSync } from "fs";

private getSrcPath(buildConfig: BuildConfigInterface, workDir: string, deploymentPath: string) {
  let srcPath;
  if (!buildConfig.buildDirectory || './' === buildConfig.buildDirectory) {
    srcPath = workDir;
  } else {
    srcPath = workDir + '/' + buildConfig.buildDirectory;
  }
  this.logger.log(`Copying ${srcPath} to ${deploymentPath}`);

  try {
    copyFileSync(srcPath, deploymentPath);
    this.logger.log(`Copy done`);
  } catch (e) {
    this.logger.error(`Copy Failed`);
    throw new Error(`Copy failed ${deploymentPath}`);
  }
}