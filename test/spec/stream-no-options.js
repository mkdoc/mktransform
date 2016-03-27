var expect = require('chai').expect
  , mktransform = require('../../index');

describe('mktransform:', function() {
  
  it('should return undefined with no options', function(done) {
    var stream = mktransform();
    expect(stream).to.eql(undefined);
    done();
  });

});
