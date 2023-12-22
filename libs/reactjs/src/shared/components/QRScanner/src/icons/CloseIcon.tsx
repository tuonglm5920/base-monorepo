import { FC, HTMLAttributes } from 'react';
import { View } from '../../../View';

export const CloseIcon: FC<HTMLAttributes<HTMLSpanElement>> = props => {
  return (
    <View {...props} tagName="span">
      <View tagName="svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <View
          tagName="path"
          d="M6 18L18 6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <View
          tagName="path"
          d="M18 18L6 6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </View>
    </View>
  );
};
