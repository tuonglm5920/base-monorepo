import { inputMask } from '../src/inputMask';

describe('inputMask utility', () => {
  let inputElement: HTMLInputElement;

  beforeEach(() => {
    // Set up our document body
    document.body.innerHTML = `
      <input id="test-input" placeholder="____-__-__" data-slots="_" data-accept="\\d" />
    `;
    inputElement = document.getElementById('test-input') as HTMLInputElement;
  });

  it('should apply mask correctly on creation', () => {
    const mask = inputMask(inputElement);
    mask.create();

    inputElement.value = '20231025';
    inputElement.dispatchEvent(new Event('input'));

    // Check if the input value is formatted according to the mask
    expect(inputElement.value).toBe('2023-10-25');
  });

  it('should format user input according to mask', () => {
    const mask = inputMask(inputElement);
    mask.create();

    inputElement.value = '12345678';
    inputElement.dispatchEvent(new Event('input'));

    expect(inputElement.value).toBe('1234-56-78');
  });

  it('should remove mask on destruction', () => {
    const mask = inputMask(inputElement);
    mask.create();
    mask.destroy();

    inputElement.value = '20231025';
    inputElement.dispatchEvent(new Event('input'));

    // The value should not be formatted after mask is destroyed
    expect(inputElement.value).toBe('20231025');
  });

  // Additional tests can include edge cases, like handling non-numeric inputs,
  // testing backspace functionality, handling partial inputs, etc.
});
