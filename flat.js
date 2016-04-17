/**
 *  Flattens a stream to a single document.
 *
 *  Removes all DOCUMENT nodes but the first in the stream and all EOF nodes 
 *  except the last in the stream.
 *
 *  @function flat
 *
 *  @param through module for subclassing streams.
 *  @param ast module for working with ast nodes.
 *  @param opts options passed to the `transform` function.
 */
function flat(through, ast) {
   var Node = ast.Node
    , open = 0;

  function transform(chunk, encoding, cb) {

    if(Node.is(chunk, Node.EOF)) {
      open--; 
    }

    var nested = open && 
      (Node.is(chunk, Node.DOCUMENT) || Node.is(chunk, Node.EOF));

    if(!nested) {
      this.push(chunk);
    }

    if(Node.is(chunk, Node.DOCUMENT)) {
      open++; 
    }

    cb();
  }

  return through.transform(transform);
}

module.exports = flat;
