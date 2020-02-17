const fs = require('fs');

const doesFileNotPresent = absolutePath => {
  const stat = fs.existsSync(absolutePath) && fs.statSync(absolutePath);
  return !stat || !stat.isFile();
};

const loadUserData = (DATA_STORE) => {
  if (!doesFileNotPresent(DATA_STORE)) {
    return fs.readFileSync(DATA_STORE, 'utf8') || '{}';
  }
}

module.exports = { loadUserData }