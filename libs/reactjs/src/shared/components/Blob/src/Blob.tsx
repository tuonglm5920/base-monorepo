import { HTMLAttributes, ReactNode, SVGProps, forwardRef, useMemo } from 'react';
import { v4 } from 'uuid';
import { View } from '../../View';
import { generator } from './utils/generator';

export interface Props {
  /** The number of frames in the animation sequence */ numberOfFrames?: number;
  /** The background of the blob, which can be an image, color, or linear gradient */
  background?:
    | { src: string }
    | string
    | Array<{
        offset: Exclude<SVGProps<SVGStopElement>['offset'], undefined>;
        color: string;
      }>;
  /** The size of the blob */
  size?: number;
  /** The number of edges or sides of the blob */
  edges?: number;
  /** The distortion level of the blob's shape */
  growth?: number;
  /** The duration of the animation in milliseconds */
  duration?: number;
  /** The number of times the animation should repeat, or 'indefinite' for an infinite loop */
  repeatCount?: number | 'indefinite';
  /** The class name to be applied to the blob container */
  containerClassName?: string;
  /** Additional native props to be passed to the blob container */
  containerNativeProps?: Omit<HTMLAttributes<HTMLOrSVGElement>, 'className'>;
}

export const Blob = forwardRef<SVGSVGElement, Props>((props, ref) => {
  const {
    numberOfFrames = 4,
    size = 200,
    edges = 8,
    growth = 4,
    duration = 4000,
    repeatCount = 'indefinite',
    containerClassName = '',
    containerNativeProps = {},
    background = [
      { offset: '0%', color: 'rgb(238, 205, 163)' },
      { offset: '100%', color: 'rgb(239, 98, 159)' },
    ],
  } = props;

  const values = useMemo(() => {
    if (numberOfFrames === 0) {
      console.warn('Blob: Number of frames must be greater than 0');
      return '';
    }
    const generators = new Set<string>();
    for (let i = 0; i < numberOfFrames; i++) {
      generators.add(generator({ size, growth, edges }).path);
    }
    const result = Array.from(generators);
    return [...result, result[0]].join(';');
  }, [edges, growth, numberOfFrames, size]);

  const viewBox = useMemo(() => `0 0 ${size} ${size}`, [size]);
  const dur = useMemo(() => `${duration}ms`, [duration]);

  const renderChildren = (): ReactNode => {
    if (typeof background === 'string') {
      return (
        <View tagName="path" fill={background}>
          <View tagName="animate" attributeName="d" dur={dur} repeatCount={repeatCount} values={values} />
        </View>
      );
    }

    if (Array.isArray(background)) {
      const id = `gradient-${v4()}`;
      return (
        <>
          <View tagName="defs">
            <View tagName="linearGradient" id={id} x1="0%" y1="0%" x2="0%" y2="100%">
              {background.map(({ color, offset }) => {
                return <View tagName="stop" key={offset + color} offset={offset} style={{ stopColor: color }}></View>;
              })}
            </View>
          </View>
          <View tagName="path" style={{ fill: `url(#${id})` }}>
            <View tagName="animate" attributeName="d" dur={dur} repeatCount={repeatCount} values={values} />
          </View>
        </>
      );
    }

    if (typeof background === 'object') {
      const id = `mask-${v4()}`;
      return (
        <>
          <View tagName="defs">
            <View tagName="clipPath" id={id}>
              <View tagName="path">
                <View tagName="animate" attributeName="d" dur={dur} repeatCount={repeatCount} values={values} />
              </View>
            </View>
          </View>
          <View
            tagName="image"
            href={background.src}
            style={{ width: '100%', height: '100%', clipPath: `url(#${id})` }}
            preserveAspectRatio="xMidYMid slice"
          />
        </>
      );
    }

    return null;
  };

  return (
    <View tagName="svg" {...containerNativeProps} ref={ref} className={containerClassName} viewBox={viewBox}>
      {renderChildren()}
    </View>
  );
});

Blob.displayName = 'Blob';
