import { getPassiveArg } from '../src/getPassiveArg';

describe('getPassiveArg function', () => {
  it('should return { passive: true } when passive listeners are supported', () => {
    const result = getPassiveArg();
    expect(result).toEqual({ passive: true });
  });
  it('TODO: Test case for not support passive', () => {
    expect(true).toEqual(true);
  });
});
