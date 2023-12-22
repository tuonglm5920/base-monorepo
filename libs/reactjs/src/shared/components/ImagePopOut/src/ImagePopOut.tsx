import { HTMLAttributes, forwardRef } from 'react';
import { View } from '../../View';
import './styles.css';

export interface Props extends HTMLAttributes<HTMLElement> {
  /** The background image URL */
  background: string;

  /** The foreground image URL */
  foreground: string;

  /** An optional fallback URL for foreground if the background fails to load or is unavailable */
  fallback?: string;

  /** Alternative text for the fallback */
  alt?: string;
}

/**
 * `ImagePopOut` is a component that displays an image with a pop-out effect.
 *
 * @link https://css-tricks.com/lets-create-an-image-pop-out-effect-with-svg-clip-path
 */
export const ImagePopOut = forwardRef<HTMLElement, Props>((props, ref) => {
  const { background, foreground, fallback, alt, ...htmlAttributes } = props;

  return (
    <View {...htmlAttributes} ref={ref} tagName="figure">
      <View
        tagName="svg"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 -10 100 120"
        className="ImagePopOut__container"
        aria-hidden="true"
      >
        <View tagName="defs">
          <View tagName="clipPath" id="ImagePopOut__maskImage" clipPathUnits="userSpaceOnUse">
            <View tagName="path" d="M100 63A50 50 0 110 70C0 42 20 0 48 0c27 0 52 42 52 70z" />
          </View>
          <View tagName="clipPath" id="ImagePopOut__maskBackground" clipPathUnits="userSpaceOnUse">
            <View tagName="path" d="M190 101a50 50 0 01-50 50 50 50 0 01-50-50 50 50 0 0150-50 50 50 0 0150 50z" />
          </View>
        </View>
        <View tagName="g" clipPath="url(#ImagePopOut__maskImage)" transform="translate(0 -7)">
          <View
            tagName="image"
            clipPath="url(#ImagePopOut__maskBackground)"
            width="120"
            height="120"
            x="70"
            y="38"
            href={background}
            transform="translate(-90 -31)"
          />
          <View
            tagName="image"
            width="120"
            height="144"
            x="-15"
            y="0"
            fill="none"
            className="ImagePopOut__foreground"
            href={foreground}
          />
        </View>
      </View>

      {fallback && <img src={fallback} alt={alt} loading="lazy" className="ImagePopOut__fallback" />}
    </View>
  );
});

ImagePopOut.displayName = 'ImagePopOut';
