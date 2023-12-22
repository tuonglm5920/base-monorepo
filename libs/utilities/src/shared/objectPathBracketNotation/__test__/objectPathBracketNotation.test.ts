import { objectPathBracketNotation } from '../src/objectPathBracketNotation';

describe('objectPathBracketNotation', () => {
  it('should handle simple dot notation', () => {
    expect(objectPathBracketNotation('part1.part2.part3')).toEqual(['part1', 'part2', 'part3']);
  });

  it('should handle bracket notation without quotes', () => {
    expect(objectPathBracketNotation('part1[part2][part3]')).toEqual(['part1', 'part2', 'part3']);
  });

  it('should handle bracket notation with quotes', () => {
    expect(objectPathBracketNotation('part1["part2"]["part3"]')).toEqual(['part1', 'part2', 'part3']);
  });

  it('should handle mixed notation types', () => {
    expect(objectPathBracketNotation('part1.part2["part3"].part4')).toEqual(['part1', 'part2', 'part3', 'part4']);
  });

  it('should handle escaped quotes within bracket notation', () => {
    expect(objectPathBracketNotation('part1["part\\"2"]["part\'3"]')).toEqual(['part1', 'part"2', "part'3"]);
  });

  it('should handle strings with no path delimiters as a single part', () => {
    expect(objectPathBracketNotation('part1')).toEqual(['part1']);
  });

  it('should handle empty string input', () => {
    expect(objectPathBracketNotation('')).toEqual([]);
  });
});
