export type ModifierKey = (typeof MODIFIER_KEYS)[keyof typeof MODIFIER_KEYS];

/** Ánh xạ giá trị "event.key" của KeyboardEvent về một giá trị ngay cả khi giữ "Shift" */
export const MODIFIER_KEYS = {
  Alt: 'Alt',
  AltGraph: 'AltGraph',
  CapsLock: 'CapsLock',
  Control: 'Control',
  Hyper: 'Hyper',
  Meta: 'Meta',
  NumLock: 'NumLock',
  ScrollLock: 'ScrollLock',
  Shift: 'Shift',
  Super: 'Super',
  Symbol: 'Symbol',
  SymbolLock: 'SymbolLock',
} as const;
