interface Generator {
  /** Size of the blob. */
  size?: number;
  /** The degree of distortion (growth) of the blob. */
  growth?: number;
  /** The number of edges the blob will have. */
  edges?: number;
  /** A seed value for generating random numbers, which influences the shape of the blob. */
  seed?: number | null;
}

/**
 * Converts an angle from degrees to radians.
 *
 * @param {number} deg - The angle in degrees.
 * @returns {number} The angle in radians.
 */
const _toRad = (deg: number): number => deg * (Math.PI / 180.0);

/**
 * Divides a full circle (360 degrees) into equal parts.
 *
 * @param {number} count - The number of divisions.
 * @returns {number[]} An array of angles in degrees, representing each division.
 */
const _divide = (count: number): number[] => {
  const deg = 360 / count;

  return Array(count)
    .fill('a')
    .map((_, i) => i * deg);
};

/**
 * Creates a pseudo-random number generator function based on a given seed.
 *
 * @param {number} s - The seed for the random number generator.
 * @returns {() => number} A function that generates a pseudo-random number when called.
 */
const _randomDoubleGenerator = (s: number): (() => number) => {
  const mask = 0xffffffff;
  let m_w = (123456789 + s) & mask;
  let m_z = (987654321 - s) & mask;

  return (): number => {
    m_z = (36969 * (m_z & 65535) + (m_z >>> 16)) & mask;
    m_w = (18000 * (m_w & 65535) + (m_w >>> 16)) & mask;

    let result = ((m_z << 16) + (m_w & 65535)) >>> 0;
    result /= 4294967296;
    return result;
  };
};

/**
 * Calculates a radius value within a specified range based on an input value.
 *
 * @param {number} value - The input value to influence the radius.
 * @param {number} min - The minimum radius.
 * @param {number} max - The maximum radius.
 * @returns {number} The calculated radius.
 */
const _magicPoint = (value: number, min: number, max: number): number => {
  let radius = min + value * (max - min);
  if (radius > max) {
    radius = radius - min;
  } else if (radius < min) {
    radius = radius + min;
  }
  return radius;
};

/**
 * Calculates the coordinates of a point on a circle given its center, radius, and angle.
 *
 * @param {number} origin - The center of the circle.
 * @param {number} radius - The radius of the circle.
 * @param {number} degree - The angle in degrees from the circle's origin to the point.
 * @returns {[number, number]} A tuple representing the X and Y coordinates of the point.
 */
const _point = (origin: number, radius: number, degree: number): [number, number] => {
  const x = origin + radius * Math.cos(_toRad(degree));
  const y = origin + radius * Math.sin(_toRad(degree));
  return [Math.round(x), Math.round(y)];
};

/**
 * Randomly shuffles the elements of an array.
 *
 * @param {any[]} array - The array to shuffle.
 * @returns {any[]} The shuffled array.
 */
const _shuffle = (array: any[]): any[] => {
  array.sort(() => Math.random() - 0.5);
  return array;
};

/**
 * Creates a series of points to form a blob shape.
 *
 * @param {number} size - The overall size of the blob.
 * @param {number} minGrowth - The minimum growth or distortion of the blob.
 * @param {number} edgesCount - The number of edges the blob will have.
 * @param {number|null} seed - A seed value for random number generation, influencing the blob's shape.
 * @returns {{ destPoints: number[][], seedValue: number }} An object containing the generated points and the used seed value.
 */
const _createPoints = (
  size: number,
  minGrowth: number,
  edgesCount: number,
  seed: number | null,
): { destPoints: number[][]; seedValue: number } => {
  const outerRad = size / 2;
  const innerRad = minGrowth * (outerRad / 10);
  const center = size / 2;

  const slices = _divide(edgesCount);
  const maxRandomValue = _shuffle([99, 999, 9999, 99999, 999999])[0];
  const id = Math.floor(Math.random() * maxRandomValue);
  const seedValue = seed || id;
  const randVal = _randomDoubleGenerator(seedValue);
  const destPoints: number[][] = [];

  slices.forEach(degree => {
    const O = _magicPoint(randVal(), innerRad, outerRad);
    const end = _point(center, O, degree);
    destPoints.push(end);
  });
  return { destPoints, seedValue };
};

/**
 * Generates an SVG path string from a set of points.
 *
 * @param {Array<number[]>} points - An array of points (each a tuple of X and Y coordinates).
 * @returns {string} The SVG path string representing the shape formed by the points.
 */
const _createSvgPath = (points: string | any[]): string => {
  let svgPath = '';
  let mid = [(points[0][0] + points[1][0]) / 2, (points[0][1] + points[1][1]) / 2];
  svgPath += 'M' + mid[0] + ',' + mid[1];

  for (let i = 0; i < points.length; i++) {
    const p1 = points[(i + 1) % points.length];
    const p2 = points[(i + 2) % points.length];
    mid = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
    svgPath += 'Q' + p1[0] + ',' + p1[1] + ',' + mid[0] + ',' + mid[1];
  }
  svgPath += 'Z';
  return svgPath;
};

/**
 * Generates a blob shape based on specified properties. It uses internal functions to create points that form the shape and then constructs an SVG path.
 *
 * @param {Generator} config - The configuration object for generating the blob.
 * @param {number} [config.size=400] - The size of the blob. Default is 400.
 * @param {number} [config.growth=6] - The growth factor of the blob, affecting its distortion. Default is 6.
 * @param {number} [config.edges=6] - The number of edges for the blob. Default is 6.
 * @param {number|null} [config.seed=null] - An optional seed for random number generation, influencing the blob's shape. Default is null, which means a random seed will be generated.
 * @returns {{ path: string; seedValue: number }} An object containing the SVG path of the blob and the seed value used for generating the shape.
 */
const generator = ({
  size = 400,
  growth = 6,
  edges = 6,
  seed = null,
}: Generator): { path: string; seedValue: number } => {
  const { destPoints, seedValue } = _createPoints(size, growth, edges, seed);
  const path = _createSvgPath(destPoints);
  return { path, seedValue };
};

export { generator };
