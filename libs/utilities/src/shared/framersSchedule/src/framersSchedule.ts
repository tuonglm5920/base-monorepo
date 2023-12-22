export interface FramerData {
  /* The time in milliseconds since the last frame */
  delta: number;
  /* The current timestamp in milliseconds */
  timestamp: number;
}

/* Type for a frame function that receives frame data */
export type Framer = (data: FramerData) => void;

export class FramersSchedule {
  /* Identifier for the animation frame request */
  private _frameId: number | null;
  /* Identifier for the keep-alive animation frame request */
  private _keepAliveFrameId: number | null;
  /* Timestamp of the last executed frame */
  private _lastTimestamp: number | null;
  /* Array of frame functions to be executed */
  private _frames: Framer[];
  /* Array of keep-alive frame functions to be executed */
  private _keepAliveFrames: Framer[];
  /* Default time step in milliseconds */
  private _defaultTimestep: number;

  constructor() {
    this._frameId = null;
    this._keepAliveFrameId = null;
    this._lastTimestamp = null;
    this._frames = [];
    this._keepAliveFrames = [];
    this._defaultTimestep = (1 / 60) * 1000;
  }

  /* Handles the execution loop for keep-alive frames */
  private _handleWorkLoop = (timestamp: number): void => {
    if (this._lastTimestamp !== null) {
      const delta = timestamp - this._lastTimestamp;
      this._keepAliveFrames.forEach(frame => frame({ delta, timestamp }));
    }
    this._lastTimestamp = timestamp;
    this._keepAliveFrameId = requestAnimationFrame(this._handleWorkLoop);
  };

  /* Handles the execution of scheduled frames */
  private _handleSchedule = (timestamp: number): void => {
    this._frames.forEach(frame => frame({ delta: this._defaultTimestep, timestamp }));
    this._frameId = requestAnimationFrame(this._handleSchedule);
  };

  /* Returns the array of scheduled frames */
  public getFrames = (): Framer[] => this._frames;

  /* Cancels the animation frame requests */
  private _cancelFrame = (): void => {
    if (this._frameId !== null) {
      cancelAnimationFrame(this._frameId);
      this._frameId = null;
    }
    if (this._keepAliveFrameId !== null) {
      cancelAnimationFrame(this._keepAliveFrameId);
      this._keepAliveFrameId = null;
    }
  };

  /* Removes a frame from the specified array */
  private _removeFrame = (frames: Framer[], frame: Framer): void => {
    const taskIndex = frames.indexOf(frame);
    if (taskIndex !== -1) {
      frames.splice(taskIndex, 1);
    }
    if (frames.length === 0) {
      this._cancelFrame();
      this._lastTimestamp = null;
    }
  };

  /* Queues a frame for execution */
  public queue = (frame: Framer, keepAlive = false): FramersSchedule => {
    if (!this._frames.includes(frame)) {
      this._frames.push(frame);
    }
    if (keepAlive && !this._keepAliveFrames.includes(frame)) {
      this._keepAliveFrames.push(frame);
    }
    this._frameId = requestAnimationFrame(this._handleSchedule);
    this._keepAliveFrameId = requestAnimationFrame(this._handleWorkLoop);

    return this;
  };

  /* Removes a frame from execution */
  public remove = (frame: Framer): FramersSchedule => {
    this._removeFrame(this._frames, frame);
    this._removeFrame(this._keepAliveFrames, frame);

    return this;
  };

  /* Clears all scheduled and keep-alive frames */
  public clear = (): FramersSchedule => {
    this._frames = [];
    this._keepAliveFrames = [];
    this._cancelFrame();
    this._lastTimestamp = null;

    return this;
  };

  //#region For testing
  //#endregion
}
