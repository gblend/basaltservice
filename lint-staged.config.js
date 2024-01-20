module.exports = {
  '*.ts': ['eslint --ignore-path .eslintignore . --fix', 'prettier --write'],
  '*.js': ['prettier --write'],
};
