## Stream Functions

A stream function has the signature:

```javascript
function(through, ast, opts)
```

It is passed the [through][] module so you can easily create stream transform classes and [ast][mkast] so you may easily inspect nodes; the `opts` object is the original options object. The function **must** return a transform stream subclass.

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
