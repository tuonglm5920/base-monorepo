import { KDBush } from '../src/kdbush';

describe('KDBush', () => {
  let kdBush: KDBush;
  const numItems = 10;
  const nodeSize = 64;

  beforeEach(() => {
    kdBush = new KDBush(numItems, nodeSize);
  });

  it('should initialize with the given number of items', () => {
    expect(kdBush.numItems).toBe(numItems);
    expect(kdBush.nodeSize).toBe(nodeSize);
  });

  it('should add points correctly', () => {
    kdBush.add(10, 20);
    kdBush.add(30, 40);

    expect(kdBush.getCoordsForTesting()).toEqual([10, 20, 30, 40]);
  });

  it('should throw error if finish is called before all points are added', () => {
    kdBush.add(10, 20);

    expect(() => {
      kdBush.finish();
    }).toThrow('Added 1 items when expected 10.');
  });

  it('should finish indexing without errors', () => {
    for (let i = 0; i < numItems; i++) {
      kdBush.add(i * 10, i * 10);
    }

    expect(() => {
      kdBush.finish();
    }).not.toThrow();
  });

  it('should find points within a given range', () => {
    for (let i = 0; i < numItems; i++) {
      kdBush.add(i * 10, i * 10);
    }
    kdBush.finish();

    const results = kdBush.range(20, 20, 40, 40);
    expect(results).toEqual([2, 3, 4]);
  });

  it('should find points within a given radius', () => {
    for (let i = 0; i < numItems; i++) {
      kdBush.add(i * 10, i * 10);
    }
    kdBush.finish();

    const results = kdBush.within(20, 20, 15);
    expect(results).toContain(2);
  });
});
