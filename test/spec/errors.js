var expect = require('chai').expect
  , mktransform = require('../../index');

describe('mktransform:', function() {
  
  it('should throw error on non-function', function(done) {
    function fn() {
      mktransform({transforms: ['foo']});
    }
    expect(fn).throws(/transform function expected/i);
    done();
  });

  it('should throw error on non-function return value', function(done) {
    function foo() {
      return false;
    }
    function fn() {
      mktransform({transforms: [foo]});
    }
    expect(fn).throws(/transform function should return stream constructor/i);
    done();
  });

  it('should throw error on stream without pipe function', function(done) {
    function foo() {
      function bar() {
      
      }
      return bar;
    }
    function fn() {
      mktransform({transforms: [foo]});
    }
    expect(fn).throws(/stream is missing pipe\(\) method/i);
    done();
  });

});
