import { Framer, FramersSchedule } from '../src/framersSchedule';

describe('FramersSchedule', () => {
  let framersSchedule: FramersSchedule;
  let mockFrame: Framer;
  let mockRequestAnimationFrame: jest.Mock;
  let mockCancelAnimationFrame: jest.Mock;

  beforeEach(() => {
    framersSchedule = new FramersSchedule();
    mockFrame = jest.fn();
    mockRequestAnimationFrame = jest.fn().mockImplementation(cb => setTimeout(() => cb(Date.now()), 0));
    mockCancelAnimationFrame = jest.fn().mockImplementation(id => clearTimeout(id));

    global.requestAnimationFrame = mockRequestAnimationFrame;
    global.cancelAnimationFrame = mockCancelAnimationFrame;
  });

  it('should queue and execute a frame', () => {
    return new Promise(done => {
      framersSchedule.queue(mockFrame);
      setTimeout(() => {
        expect(mockFrame).toHaveBeenCalled();
        done(undefined);
      }, 1);
    });
  });

  it('should remove a queued frame', () => {
    return new Promise(done => {
      framersSchedule.queue(mockFrame);
      framersSchedule.remove(mockFrame);
      setTimeout(() => {
        expect(mockFrame).not.toHaveBeenCalled();
        done(undefined);
      }, 1);
    });
  });

  it('should clear all frames', () => {
    return new Promise(done => {
      framersSchedule.queue(mockFrame);
      framersSchedule.clear();
      setTimeout(() => {
        expect(mockFrame).not.toHaveBeenCalled();
        done(undefined);
      }, 1);
    });
  });

  it('should handle keep-alive frames', () => {
    return new Promise(done => {
      framersSchedule.queue(mockFrame, true);
      setTimeout(() => {
        expect(mockFrame).toHaveBeenCalled();
        framersSchedule.clear();
        done(undefined);
      }, 1);
    });
  });
});
