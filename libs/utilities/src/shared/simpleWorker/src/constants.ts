/**
 * Enumeration for SimpleWorker states.
 * @enum {string}
 * @readonly
 */
export enum SimpleWorkerState {
  /** State indicating that an error has occurred in the SimpleWorker process. */
  ERROR = 'ERROR',

  /** State indicating that the SimpleWorker process has completed successfully. */
  SUCCESS = 'SUCCESS',
}

/**
 * The string constant containing the script to be used by a worker.
 * @readonly
 */
export const SIMPLE_WROKER_SCRIPT = `
onmessage = function (event) {
  // WorkerScriptRequest
  const data = event.data;
  const type = data.type;
  const payload = data.payload;
  switch (type) {
    case("@Run"):
      const func = new Function("return " + payload.doFunction)();
      func(...payload.args).then(function (result) {
        // WorkerScriptRespones
        self.postMessage({
          hasError: false,
          result: result
        });
      }).catch(function (error) {
        // WorkerScriptRespones
        self.postMessage({
          hasError: true,
          message: error
        });
      });
      break;
    default:
      // WorkerScriptRespones
      self.postMessage({
        hasError: true,
        message: "Action not exist"
      });
      break;
  }
}
`;
