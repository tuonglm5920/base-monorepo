import { sort } from './utils/sort';
import { sqDist } from './utils/sqDist';

/** A very fast static spatial index for 2D points based on a flat KD-tree. */
export class KDBush {
  /** Array holding all points packed together: [x1, y1, x2, y2, ...] */
  public data: number[];
  /** Total number of items in the spatial index */
  public numItems: number;
  /** Maximum number of items in a node */
  public nodeSize: number;
  /** Flat array of point coordinates: [x1, y1, x2, y2, ...] */
  private _coords: number[];
  /** Array of node IDs */
  private _ids: number[];
  /** Current position in the data array during tree construction */
  private _pos: number;
  /** Flag indicating whether the tree construction is finished */
  private _finished: boolean;

  constructor(numItems: number, nodeSize = 64) {
    if (isNaN(numItems) || numItems < 0) {
      throw new Error(`Unexpected numItems value: ${numItems}.`);
    }

    this.numItems = numItems;
    this.nodeSize = Math.min(Math.max(nodeSize, 2), 65535);

    this.data = [];
    this._ids = [];
    this._coords = [];
    this._pos = 0;
    this._finished = false;
  }

  /**
   * Adds a point to the spatial index.
   * @param x The x-coordinate of the point.
   * @param y The y-coordinate of the point.
   * @returns The index of the added point.
   */
  public add(x: number, y: number): number {
    const index = this._pos >> 1;
    this._ids.push(index);
    this._coords.push(x, y); // Dynamically adding coordinates
    this._pos += 2;
    return index;
  }

  /**
   * Finalizes the construction of the spatial index.
   * @returns The constructed KDBush instance.
   * @throws Throws an error if the added items don't match the expected count.
   */
  public finish(): KDBush {
    const numAdded = this._pos >> 1;
    if (numAdded !== this.numItems) {
      throw new Error(`Added ${numAdded} items when expected ${this.numItems}.`);
    }
    sort(this._ids, this._coords, this.nodeSize, 0, this.numItems - 1, 0);
    this._finished = true;
    return this;
  }

  /**
   * Finds items within a specified bounding box.
   * @param minX The minimum x-coordinate of the bounding box.
   * @param minY The minimum y-coordinate of the bounding box.
   * @param maxX The maximum x-coordinate of the bounding box.
   * @param maxY The maximum y-coordinate of the bounding box.
   * @returns An array of indices of items within the bounding box.
   * @throws Throws an error if data hasn't been indexed yet (call finish()).
   */
  public range(minX: number, minY: number, maxX: number, maxY: number): number[] {
    if (!this._finished) {
      throw new Error('Data not yet indexed - call finish().');
    }

    const result = [];
    for (let i = 0; i < this.numItems; i++) {
      const x = this._coords[2 * i];
      const y = this._coords[2 * i + 1];
      if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
        result.push(this._ids[i]);
      }
    }
    return result;
  }

  /**
   * Finds items within a specified radius from a query point.
   * @param qx The x-coordinate of the query point.
   * @param qy The y-coordinate of the query point.
   * @param r The radius from the query point.
   * @returns An array of indices of items within the given radius of the query point.
   * @throws Throws an error if data hasn't been indexed yet (call finish()).
   */
  public within(qx: number, qy: number, r: number): number[] {
    if (!this._finished) {
      throw new Error('Data not yet indexed - call finish().');
    }

    const result = [];
    const r2 = r * r;
    for (let i = 0; i < this.numItems; i++) {
      if (sqDist(this._coords[2 * i], this._coords[2 * i + 1], qx, qy) <= r2) {
        result.push(this._ids[i]);
      }
    }
    return result;
  }

  //#region For testing
  public getCoordsForTesting = (): typeof this._coords => {
    return this._coords;
  };
  public getIdsForTesting = (): typeof this._ids => {
    return this._ids;
  };
  //#endregion
}
