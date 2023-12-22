import { FC } from 'react';

export interface Props {}

/**
 * This component demonstrates how "Appetize.io" can be used to embed a mobile app emulator within a web application.
 * For more information on Appetize.io and its capabilities, visit [Appetize.io](https://appetize.io/).
 *
 * @returns {React.ReactElement} A React element representing an iframe embedding the Appetize.io emulator.
 */
export const Appetize: FC<Props> = () => {
  return (
    <iframe
      title="Simulator"
      src="https://appetize.io/embed/8bnmakzrptf1hv9dq7v7bnteem?autoplay=true&device=iphone8&deviceColor=white"
      frameBorder="0"
      width="330"
      height="700"
    />
  );
};
