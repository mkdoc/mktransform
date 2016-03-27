# Stream Transform

[![Build Status](https://travis-ci.org/mkdoc/mktransform.svg?v=3)](https://travis-ci.org/mkdoc/mktransform)
[![npm version](http://img.shields.io/npm/v/mktransform.svg?v=3)](https://npmjs.org/package/mktransform)
[![Coverage Status](https://coveralls.io/repos/mkdoc/mktransform/badge.svg?branch=master&service=github&v=3)](https://coveralls.io/github/mkdoc/mktransform?branch=master)

> Inject custom stream transformations

Accepts a list of functions that should return stream classes to be injected into the transformation pipeline.

## Install

```
npm i mktransform --save
```

For the command line interface install [mkdoc][] globally (`npm i -g mkdoc`).

---

- [Install](#install)
- [Usage](#usage)
- [Example](#example)
- [Help](#help)
- [API](#api)
   - [transform](#transform)
- [License](#license)

---

## Usage

Create a file for the transform function like [upper.js](https://github.com/mkdoc/mktransform/blob/master/doc/upper.js):

```javascript
// converts level one headings to upper case
function upper(through, ast) {
  var Node = ast.Node
    , collect = ast.NodeWalker.collect
    , i
    , text;

  function transform(chunk, encoding, cb) {
    if(Node.is(chunk, Node.HEADING) && chunk.level === 1) {
      text = collect(chunk, Node.TEXT);
      for(i = 0;i < text.length;i++) {
        text[i].literal = text[i].literal.toUpperCase();
      }
    }
    this.push(chunk);
    cb();
  }
  return through.transform(transform);
}

module.exports = upper;
```

And pass in the `transforms` array:

```javascript
var tfm = require('mktransform')
  , ast = require('mkast')
  , upper = require('./upper');

ast.src('# Project\n\nThis is a paragraph.\n\n## Install')
  .pipe(tfm({transforms: [upper]}))
  .pipe(ast.stringify({indent: 2}))
  .pipe(process.stdout);
```

## Example

Run a custom stream transformation:

```shell
mkcat README.md | mktransform doc/upper.js | mkout
```

## Help

```
mktransform [files...]

Custom stream transformations.

  -h, --help  Display this help and exit
  --version   Print the version and exit

Report bugs to https://github.com/mkdoc/mktransform/issues
```

## API

### transform

```javascript
transform(opts[, cb])
```

Injects custom stream transform classes into the pipeline.

Returns an output stream.

* `opts` Object processing options.
* `cb` Function callback function.

#### Options

* `transforms` Array list of transform functions.
* `input` Readable input stream.
* `output` Writable output stream.

## License

MIT

---

Created by [mkdoc](https://github.com/mkdoc/mkdoc) on March 27, 2016

[mkdoc]: https://github.com/mkdoc/mkdoc
[commonmark]: http://commonmark.org
[jshint]: http://jshint.com
[jscs]: http://jscs.info

