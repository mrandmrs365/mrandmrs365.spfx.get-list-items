'use strict';

const path = require('path');
const bundleAnalyzer = require('webpack-bundle-analyzer');
const build = require('@microsoft/sp-build-web');

build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

// Get current build config and check if warnoff flag set
const currentConfig = build.getConfig();
const warningLevel = currentConfig.args['warnoff'];

// Modify SPFx build rig, and overwrite 'shouldWarningsFailBuild' property
if (warningLevel) {
  class CustomSPWebBuildRig extends build.SPWebBuildRig {
    setupSharedConfig() {
      build.log('IMPORTANT: Warnings will not fail the build.');
      build.mergeConfig({
        shouldWarningsFailBuild: false,
      });
      super.setupSharedConfig();
    }
  }
  build.rig = new CustomSPWebBuildRig();
}

let syncVersionsSubtask = build.subTask('version-sync', function (gulp, buildOptions, done) {
  this.log('Synching versions');
  const gutil = require('gulp-util');
  const fs = require('fs');
  var pkgConfig = require('./package.json');
  var pkgSolution = require('./config/package-solution.json');
  this.log('package-solution.json version:\t' + pkgSolution.solution.version);
  var newVersionNumber = pkgConfig.version.split('-')[0] + '.0';
  if (pkgSolution.solution.version !== newVersionNumber) {
    pkgSolution.solution.version = newVersionNumber;
    this.log('New package-solution.json version:\t' + pkgSolution.solution.version);
    fs.writeFile('./config/package-solution.json', JSON.stringify(pkgSolution, null, 4), function (err, result) {
      if (err) {
        this.log('error', err);
      }
    });
  }
  else {
    this.log('package-solution.json version is up-to-date');
  }
  done();
});

let syncVersionTask = build.task('version-sync', syncVersionsSubtask);

build.rig.addPreBuildTask(syncVersionTask);

build.configureWebpack.mergeConfig({
  additionalConfiguration: (generatedConfiguration) => {
    const lastDirName = path.basename(__dirname);
    const dropPath = path.join(__dirname, 'temp', 'stats');
    generatedConfiguration.plugins.push(new bundleAnalyzer.BundleAnalyzerPlugin({
      openAnalyzer: false,
      analyzerMode: 'static',
      reportFilename: path.join(dropPath, `${lastDirName}.stats.html`),
      generateStatsFile: true,
      statsFilename: path.join(dropPath, `${lastDirName}.stats.json`),
      logLevel: 'error'
    }));

    return generatedConfiguration;
  }
});

build.initialize(require('gulp'));