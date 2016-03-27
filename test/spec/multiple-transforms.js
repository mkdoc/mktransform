var expect = require('chai').expect
  , fs = require('fs')
  , ast = require('mkast')
  , Node = ast.Node
  , mktransform = require('../../index')
  , upper1 = require('../fixtures/upper1')
  , upper2 = require('../fixtures/upper2')
  , utils = require('../util');

function assert(result) {
  // open document
  expect(result[0].type).to.eql(Node.DOCUMENT);

  expect(result[1].type).to.eql(Node.HEADING);
  expect(result[1].firstChild.literal).to.eql('PROJECT');
  expect(result[2].type).to.eql(Node.PARAGRAPH);
  expect(result[3].type).to.eql(Node.HEADING);
  expect(result[3].firstChild.literal).to.eql('INSTALL');

  // eof main document
  expect(result[4].type).to.eql(Node.EOF);
}

describe('mktransform:', function() {
  
  it('should transform with multiple streams', function(done) {
    var source = 'test/fixtures/headings.md'
      , target = 'target/headings.json.log'
      , data = ast.parse('' + fs.readFileSync(source))

    // mock file for correct relative path
    // mkcat normally injects this info
    data.file = source;

    var input = ast.serialize(data)
      , output = fs.createWriteStream(target)
      , opts = {
          input: input,
          output: output,
          transforms: [upper1, upper2]
        };
    
    mktransform(opts);

    output.once('finish', function() {
      var result = utils.result(target);
      assert(result);
      done();
    })
  });

});
