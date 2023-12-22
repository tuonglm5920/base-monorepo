import { SimpleWorker, Task } from '../src/core';

Object.defineProperty(global.URL, 'revokeObjectURL', {
  value: jest.fn(),
});

describe('simpleWorker', () => {
  it('should initialize correctly', () => {
    const simpleWorkerThread = new SimpleWorker();
    expect(simpleWorkerThread).toBeDefined();
  });

  it('should post messages correctly', () => {
    const simpleWorkerThread = new SimpleWorker();
    const mockTask: Task = {
      id: 1,
      args: [1, 2],
      doFunction: (): Promise<number> => Promise.resolve(3),
    };

    // Spy on postMessage to make sure it is called correctly
    const postMessageSpy = jest.spyOn(simpleWorkerThread.getWorkerForTesting(), 'postMessage');
    simpleWorkerThread.run(mockTask);
    expect(postMessageSpy).toHaveBeenCalledWith({
      type: '@Run',
      payload: {
        id: mockTask.id,
        args: mockTask.args,
        doFunction: mockTask.doFunction.toString(),
      },
    });
  });

  it('should clean up resources correctly', () => {
    // Mock the global Worker since Jest runs in a Node environment, not a browser environment
    const originWorker = global.Worker;
    const originCreateObjectURL = global.URL.createObjectURL;
    global.Worker = class {
      public terminate(): void {
        jest.fn();
      }
    } as unknown as typeof Worker;

    Object.defineProperty(global.URL, 'createObjectURL', {
      value: jest.fn(),
    });

    const postMessageSpy = jest.spyOn(global.Worker.prototype, 'terminate');
    const simpleWorkerThread = new SimpleWorker();
    simpleWorkerThread.destroy();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith(simpleWorkerThread.getBlobUrlForTesting());
    expect(postMessageSpy).toHaveBeenCalled();

    // Restore Worker & createObjectURL
    global.Worker = originWorker;
    Object.defineProperty(global.URL, 'createObjectURL', { value: originCreateObjectURL });
  });

  it('runs the sum task and returns the correct result', async () => {
    const sumTask = new Task((a: number, b: number) => Promise.resolve(a + b), 10, 20);
    const simpleWorkerThread = new SimpleWorker();

    // Mock the postMessage and onmessage to simulate worker behavior
    const postMessageSpy = jest.spyOn(simpleWorkerThread.getWorkerForTesting(), 'postMessage');
    simpleWorkerThread.getWorkerForTesting().onmessage = jest.fn().mockImplementationOnce(event => {
      event.data({ status: 'SUCCESS', result: 30 });
    });

    const result = await simpleWorkerThread.run(sumTask);

    expect(postMessageSpy).toHaveBeenCalledWith({
      type: '@Run',
      payload: {
        id: sumTask.id,
        args: [10, 20],
        doFunction: sumTask.doFunction.toString(),
      },
    });
    expect(result).toEqual({ status: 'SUCCESS', result: 30 });
  });
});
