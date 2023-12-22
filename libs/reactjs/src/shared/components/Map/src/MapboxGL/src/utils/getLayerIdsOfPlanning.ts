import { Planning } from '../../../@types/Planning';

/**
 * Generates and returns layer identifiers for a given planning object.
 * The function creates unique identifiers for the inner and outer layers
 * of the planning polygon, ensuring each layer can be distinctly referenced.
 *
 * @param {Planning} planning - The planning object from which to generate layer IDs.
 * @returns {{ inner: string; outter: string }} An object containing the 'inner' and 'outer'
 * layer IDs, constructed based on the 'uid' property of the planning object.
 */
export const getLayerIdsOfPlanning = (planning: Planning): { inner: string; outter: string } => {
  return {
    inner: `polygon__inner__${planning.uid}`,
    outter: `polygon__outter__${planning.uid}`,
  };
};
