const fs = require("fs");
const path = require("path");

let src = __dirname;
function readDir(dir) {
  return fs.readdirSync(dir, { withFileTypes: true });
}

function handleFiles(dir) {
  let arrayOfFiles = readDir(dir)
    .filter((file) => file.isFile())
    .map(function (file) {
      return file.name;
    });
  return arrayOfFiles.filter(
    (filename) => filename.substring(filename.length - 3) === ".js"
  );
}

function renameFiles(dir) {
  let filesToRename = handleFiles(dir);
  filesToRename.forEach((elem) => {
    let fileWithoutExtension = elem.substring(0, elem.length - 3);
    fs.renameSync(
      path.join(dir, elem),
      path.join(dir, fileWithoutExtension + ".ts")
    );
    console.log("succeed");
  });
}

function flatten(lists) {
  return lists.reduce((a, b) => a.concat(b), []);
}
function getDirectories(srcpath) {
  return fs
    .readdirSync(srcpath)
    .map((file) => path.join(srcpath, file))
    .filter((path) => fs.statSync(path).isDirectory());
}
function getDirectoriesRecursive(srcpath) {
  return [
    srcpath,
    ...flatten(getDirectories(srcpath).map(getDirectoriesRecursive)),
  ];
}

async function jsToTs() {
  let arrayOfFolders = getDirectoriesRecursive(src);
  arrayOfFolders.forEach((folder) => {
    renameFiles(folder);
  });
}

jsToTs();
