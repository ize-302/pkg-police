const fs = require('fs')
const { dependencies } = require(process.cwd() + '/package.json') // get package.json from current working directory

// folders we want to avoid looking at
function isExcludedFolder(file) {
  const excludedFolders = ['node_modules', '.github', '.next', '.vscode', '.idea', '.expo', 'dist', 'build', '.git']
  return excludedFolders.find(exc => file.includes(exc)) ? true : false
}

// Recursive function to get files
function getFiles(dir = './', files = []) {
  // Get an array of all files and directories in the passed directory using fs.readdirSync
  const fileList = fs.readdirSync(dir);
  // Create the full path of the file/directory by concatenating the passed directory and file/directory name
  for (const file of fileList) {
    const filenameWithPath = `${dir}/${file}`;
    // Check if the current file/directory is a directory using fs.statSync
    if (fs.statSync(filenameWithPath).isDirectory() && !isExcludedFolder(filenameWithPath)) {
      // If it is a directory, recursively call the getFiles function with the directory path and the files array
      getFiles(filenameWithPath, files);
    } else {
      // If it is a file, check if its a valid js file and then push the full path to the files array
      if ((filenameWithPath.includes('.js')
        || filenameWithPath.includes('.ts')
        || filenameWithPath.includes('.jsx')
        || filenameWithPath.includes('.tsx')
        || filenameWithPath.includes('.cjs')
        || filenameWithPath.includes('.mjs')
        || filenameWithPath.includes('.cts')
        || filenameWithPath.includes('.mts')
      )
        && !filenameWithPath.includes('.json')) {
        files.push(filenameWithPath);
      }
    }
  }
  return files;
}

function callTheCops(files) {
  if (!dependencies) {
    return console.log('⚠️ No dependencies found in package.json file')
  }
  console.log('###### \n⚠️  Note: Some packages may not be used but be dependent upon by other packages \n######')
  const arrDependencies = Object.keys(dependencies);
  let dependenciesinuse = []
  files.map((file, index) => {
    arrDependencies.map(dependency => {
      fs.readFile(file, { encoding: 'utf-8' }, function (err, data) {
        if (!err) {
          if (!dependenciesinuse.includes(dependency)) {
            // different ways packages can be used
            const isinUse = data.includes(`require('${dependency}')`)
              || data.includes(`require("${dependency}")`)
              || data.includes(`from "${dependency}"`)
              || data.includes(`from '${dependency}'`)
              || data.includes("from `" + `${dependency}` + "`")

            if (isinUse) {
              dependenciesinuse.push(dependency)
              console.log(`✅ ${dependency} is in use`);
            } else {
              if (index + 1 === files.length) {
                console.log(`❌ ${dependency} not directly in use`);
                return
              }
            }
          }
        } else {
          console.log(err);
        }
      });
    })
  })
}

module.exports = { callTheCops, getFiles }