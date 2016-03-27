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
- [Stream Functions](#stream-functions)
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

And pass in the transform function:

```javascript
var tfm = require('mktransform')
  , ast = require('mkast')
  , upper = require('./upper');

ast.src('# Project\n\nThis is a paragraph.\n\n## Install')
  .pipe(tfm(upper))
  .pipe(ast.stringify({indent: 2}))
  .pipe(process.stdout);
```

## Example

Run a custom stream transformation:

```shell
mkcat README.md | mktransform doc/upper.js | mkout
```

Run multiple transformations:

```shell
mkcat README.md | mktransform test/fixtures/upper1.js test/fixtures/upper2.js | mkout
```

## Stream Functions

A stream function has the signature:

```javascript
function(through, ast)
```

It is passed the [through][] module so you can easily create stream transform classes and [ast][mkast] so you may easily inspect nodes. The function *must* return a transform stream subclass.

The input and output data should always be abstract syntax tree nodes.

To create a transform stream subclass:

```javascript
function transformer(through) {

  function transform(chunk, encoding, cb) {
    // pass through stream
    cb(null, chunk);
  }

  // return the stream subclass
  return through.transform(transform);
}

module.exports = transformer;
```

If you also need a `flush` function:

```javascript
function transformer(through) {

  function transform(chunk, encoding, cb) {
    cb(null, chunk);
  }

  function flush(cb) {
    cb(); 
  }

  return through.transform(transform, flush);
}

module.exports = transformer;
```

To use a specific constructor:

```javascript
function transformer(through) {

  function Component(opts) {
    this.opts = opts || {}; 
  }

  function transform(chunk, encoding, cb) {
    cb(null, chunk);
  }

  return through.transform(transform, {ctor: Component});
}

module.exports = transformer;
```

See [through][through], [ast][mkast] and the [api docs](#api) for more detail.

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

Accepts a single function, array of functions or an object with a
`transforms` array.

Functions have the signature:

```javascript
function(through, ast)
```

They are passed the [through][] and [ast][mkast] modules to help with
creating stream subclasses and inspecting nodes.

Each function **must** return a transform stream subclass.

The returned subclass is instantiated and when multiple transform functions
are being used a pipeline is created between the streams in the order
supplied.

When a single stream is being created it is returned otherwise an array
of all the created streams is returned.

If both the `input` and output `options` are given additional wrapper
streams are created that parse JSON from the input stream and write JSON
to the output stream, in this instance you may pass a callback function
which is added as a listener for the `error` and `finish` events on the
output stream; the output stream is returned.

Returns an output stream.

* `opts` Function|Array|Object processing options.
* `cb` Function callback function.

#### Options

* `transforms` Array list of transform functions.
* `input` Readable input stream.
* `output` Writable output stream.

#### Throws

* `TypeError` if the target is not a function.
* `TypeError` if the return value is not a function.
* `TypeError` if the stream instance has no pipe function.

## License

MIT

---

Created by [mkdoc](https://github.com/mkdoc/mkdoc) on March 27, 2016

[mkdoc]: https://github.com/mkdoc/mkdoc
[mkast]: https://github.com/mkdoc/mkast
[through]: https://github.com/tmpfs/through3
[commonmark]: http://commonmark.org
[jshint]: http://jshint.com
[jscs]: http://jscs.info

