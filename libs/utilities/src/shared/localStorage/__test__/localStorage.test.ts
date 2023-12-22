import { localStorage } from '../src/localStorage';

describe('localStorage', () => {
  it('can set and get an item', () => {
    localStorage.setItem('key', 'value');
    expect(localStorage.getItem('key')).toBe('value');
  });

  it('can remove an item', () => {
    localStorage.setItem('key', 'value');
    localStorage.removeItem('key');
    expect(localStorage.getItem('key')).toBeNull();
  });

  it('can clear all items', () => {
    localStorage.setItem('key1', 'value1');
    localStorage.setItem('key2', 'value2');
    localStorage.clear();
    expect(localStorage.getItem('key1')).toBeNull();
    expect(localStorage.getItem('key2')).toBeNull();
  });
});
