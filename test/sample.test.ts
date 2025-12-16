import { expect } from 'chai';
import { describe, it } from 'mocha';

describe('Sample Test Suite', () => {
  it('should pass a basic test', () => {
    expect(true).to.be.true;
  });

  it('should perform basic arithmetic', () => {
    const sum = 2 + 2;
    expect(sum).to.equal(4);
  });
});
