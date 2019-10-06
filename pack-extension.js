/* eslint-disable @typescript-eslint/no-var-requires */

const AdmZip = require("adm-zip");
const path = require("path");

const BUILD_TARGET = process.env.REACT_APP_BUILD_TARGET;
const GIT_COMMIT_SHA = process.env.REACT_APP_GIT_COMMIT_SHA;
const INPUT_DIR = "./build";

let outputFilename = path.basename(INPUT_DIR);
if (GIT_COMMIT_SHA) {
  outputFilename += `-${GIT_COMMIT_SHA}`;
}
if (BUILD_TARGET) {
  outputFilename += `-${BUILD_TARGET}`;
}

const zip = new AdmZip();
zip.addLocalFolder(INPUT_DIR);
zip.writeZip(`${outputFilename}.zip`);
