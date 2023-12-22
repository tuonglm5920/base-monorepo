import { escapeRegExp } from '../src/escapeRegexp';

describe('escapeRegExp', () => {
  it('should escape special characters', () => {
    const input = 'Hello (world)! *+?^${}[]|';
    const expectedOutput = 'Hello \\(world\\)! \\*\\+\\?\\^\\$\\{\\}\\[\\]\\|';

    expect(escapeRegExp(input)).toEqual(expectedOutput);
  });

  it('should return the same string if there are no special characters', () => {
    const input = 'Hello world';
    const expectedOutput = 'Hello world';

    expect(escapeRegExp(input)).toEqual(expectedOutput);
  });

  it('should return an empty string if the input is an empty string', () => {
    const input = '';
    const expectedOutput = '';

    expect(escapeRegExp(input)).toEqual(expectedOutput);
  });
});
