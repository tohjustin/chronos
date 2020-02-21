const AdmZip = require("adm-zip");
const fs = require("fs-extra");
const path = require("path");

const GIT_COMMIT_SHA = process.env.REACT_APP_GIT_COMMIT_SHA;
const WEBPACK_BUILD_DIR = "./build";

// Prune & rename extension manifest file
fs.removeSync(`${WEBPACK_BUILD_DIR}/manifest.development.json`);
fs.renameSync(
  `${WEBPACK_BUILD_DIR}/manifest.production.json`,
  `${WEBPACK_BUILD_DIR}/manifest.json`
);

// Generate output file name
let outputFilename = path.basename(WEBPACK_BUILD_DIR);
if (GIT_COMMIT_SHA) {
  outputFilename += `-${GIT_COMMIT_SHA}`;
}

const zip = new AdmZip();
zip.addLocalFolder(WEBPACK_BUILD_DIR, "");
zip.writeZip(`${outputFilename}.zip`);
