import { ComponentProps, FC } from 'react';
import { UseSticky, useSticky } from '../../../hooks';
import { View } from '../../View';

export type Props = UseSticky & Pick<ComponentProps<'div'>, 'children' | 'className' | 'style'>;

export const Sticky: FC<Props> = ({ offsetTop, offsetBottom, bottom, children, className, style }) => {
  const ref = useSticky({ offsetTop, offsetBottom, bottom });

  return (
    <View disableStrict className={className} style={style} ref={ref}>
      {children}
    </View>
  );
};
