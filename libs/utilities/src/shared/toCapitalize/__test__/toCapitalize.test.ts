import { toCapitalize } from '../src/toCapitalize';

describe('toCapitalize', () => {
  it('capitalizes the first letter and lowercases the rest', () => {
    expect(toCapitalize('heLLo')).toBe('Hello');
  });

  it('handles a single character', () => {
    expect(toCapitalize('A')).toBe('A');
    expect(toCapitalize('a')).toBe('A');
  });

  it('handles an empty string', () => {
    expect(toCapitalize('')).toBe('');
  });

  it('handles a string with the first letter already capitalized', () => {
    expect(toCapitalize('Hello')).toBe('Hello');
  });

  it('handles a string with all uppercase letters', () => {
    expect(toCapitalize('HELLO')).toBe('Hello');
  });

  it('handles a string with numbers and symbols', () => {
    expect(toCapitalize('123aBC')).toBe('123abc');
  });
});
