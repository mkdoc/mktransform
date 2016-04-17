var through = require('through3')
  , ast = require('mkast');

/**
 *  Injects custom stream transform classes into the pipeline.
 *
 *  Accepts a single function, array of functions or an object with a 
 *  `transforms` array.
 *
 *  Functions have the signature:
 *
 *  ```javascript
 *  function(through, ast, opts)
 *  ```
 *
 *  They are passed the [through][] and [ast][mkast] modules to help with 
 *  creating stream subclasses and inspecting nodes and the original options.
 *
 *  If you are using multiple stream transformations the options are shared 
 *  between them so take care to avoid name collisions.
 *
 *  Each function **must** return a transform stream subclass.
 *
 *  The returned subclass is instantiated and when multiple transform functions 
 *  are being used a pipeline is created between the streams in the order 
 *  supplied.
 *
 *  When a single stream is being created it is returned otherwise an array 
 *  of all the created streams is returned.
 *
 *  If both the `input` and `output` options are given additional wrapper 
 *  streams are created that parse JSON from the input stream and write JSON 
 *  to the output stream, in this instance you may pass a callback function 
 *  which is added as a listener for the `error` and `finish` events on the 
 *  output stream; the output stream is returned.
 *
 *  @function transform
 *  @param {Function|Array|Object} opts processing options.
 *  @param {Function} [cb] callback function.
 *
 *  @option {Array} transforms list of transform functions.
 *  @option {Readable} [input] input stream.
 *  @option {Writable} [output] output stream.
 *
 *  @throws TypeError if the target is not a function.
 *  @throws TypeError if the return value is not a function.
 *  @throws TypeError if the stream instance has no pipe function.
 *
 *  @returns an output stream or array of streams.
 */
function transform(opts, cb) {
  opts = opts || {};

  if(typeof opts === 'function') {
    opts = {
      transforms: [opts]
    } 
  }else if(Array.isArray(opts)) {
    opts = {
      transforms: opts
    } 
  }

  var transforms = opts.transforms || []
    , func
    , Stream
    , first
    , stream
    , previous
    , i
    , io = Boolean(opts.input && opts.output)
    , streams = [];

  for(i = 0;i < transforms.length;i++) {
    func = transforms[i];

    if(typeof func !== 'function') {
      throw new TypeError('transform function expected');
    }

    Stream = func(through, ast, opts);

    if(typeof Stream !== 'function') {
      throw new TypeError(
        'transform function should return stream constructor');
    }

    stream = new Stream(opts);
    streams.push(stream);

    if(!first) {
      first = stream; 
    }

    if(typeof stream.pipe !== 'function') {
      throw new TypeError('stream is missing pipe() method');
    }

    if(previous && !io) {
      previous.pipe(stream); 
    }

    previous = stream;
  }

  if(!opts.input || !opts.output) {
    if(streams.length <= 1) {
      return first;
    }
    return streams;
  }

  // set up input stream
  stream = ast.parser(opts.input);

  // inject custom stream transformations
  for(i = 0;i < streams.length;i++) {
    stream = stream.pipe(streams[i]); 
  }
 
  // set up output stream
  stream
    .pipe(ast.stringify())
    .pipe(opts.output);

  if(cb) {
    opts.output
      .once('error', cb)
      .once('finish', cb);
  }

  return opts.output;
}

module.exports = transform;
