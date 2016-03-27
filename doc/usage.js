var tfm = require('../index')
  , ast = require('mkast')
  , upper = require('./upper');

ast.src('# Project\n\nThis is a paragraph.\n\n## Install')
  .pipe(tfm(upper))
  .pipe(ast.stringify({indent: 2}))
  .pipe(process.stdout);
