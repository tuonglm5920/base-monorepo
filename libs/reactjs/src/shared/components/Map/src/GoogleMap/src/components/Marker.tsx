import { FC, PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
  lat?: number;
  lng?: number;
}

export const Marker: FC<Props> = ({ children }) => children;
