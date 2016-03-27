var expect = require('chai').expect
  , mktransform = require('../../index');

describe('mktransform:', function() {
  
  it('should return undefined with no options', function(done) {
    var stream = mktransform();
    expect(stream).to.eql(undefined);
    done();
  });

  it('should use function argument', function(done) {
    function foo(through) {
      return through.transform(function(){}) 
    }
    var stream = mktransform(foo);
    expect(stream).to.be.an('object');
    done();
  });

  it('should use array argument', function(done) {
    function foo(through) {
      return through.transform(function(){}) 
    }
    var stream = mktransform([foo]);
    expect(stream).to.be.an('object');
    done();
  });

});
