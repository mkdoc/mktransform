var through = require('through3')
  , ast = require('mkast');

/**
 *  Injects custom stream transform classes into the pipeline.
 *
 *  @function transform
 *  @param {Object} opts processing options.
 *  @param {Function} [cb] callback function.
 *
 *  @option {Array} transforms list of transform functions.
 *  @option {Readable} [input] input stream.
 *  @option {Writable} [output] output stream.
 *
 *  @returns an output stream.
 */
function transform(opts, cb) {
  opts = opts || {};

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

    Stream = func(through, ast);

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
    return first; 
  }

  stream = ast.parser(opts.input);

  for(i = 0;i < streams.length;i++) {
    stream = stream.pipe(streams[i]); 
  }
  
  stream.pipe(ast.stringify())
    .pipe(opts.output);

  if(cb) {
    opts.output
      .once('error', cb)
      .once('finish', cb);
  }

  return opts.output;
}

module.exports = transform;
