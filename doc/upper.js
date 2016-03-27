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
