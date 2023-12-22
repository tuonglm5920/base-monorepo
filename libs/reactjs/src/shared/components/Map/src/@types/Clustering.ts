import { ReactNode } from 'react';
import { Cluster, Point, PointExtendProps, Viewport } from 'utilities';

export interface ClusterConfig<P extends PointExtendProps> {
  /** Optional click event handler for clusters, providing the clicked cluster and the click event. */
  onClick?: (params: { cluster: Cluster<P>; event: MouseEvent }) => void;

  /** Function to render a React node for each cluster. */
  render: (cluster: Cluster<P>) => ReactNode;
}

export interface PointConfig<P extends PointExtendProps> {
  /** Optional click event handler for points, providing the clicked point and the click event. */
  onClick?: (params: { point: Point<P>; event: MouseEvent }) => void;

  /** Function to render a React node for each point. */
  render: (point: Point<P>) => ReactNode;
}

export interface Clustering<P extends PointExtendProps> {
  /** Array of points to be clustered. */
  points: Point<P>[];

  /** Optional callback to handle changes in the viewport. */
  onViewportChange?: (viewport: Viewport) => void;

  /** Flag to enable or disable zooming when a cluster is clicked. */
  disableExpansionZoomOnClickCluster?: boolean;

  /** Configuration for rendering and interacting with clusters. */
  cluster: ClusterConfig<P>;

  /** Configuration for rendering and interacting with individual points. */
  point: PointConfig<P>;
}
