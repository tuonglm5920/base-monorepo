import { getPassiveArg } from '../../getPassiveArg';
import { getDimensions } from './utils/getDimensions';
import { getParentOfElement } from './utils/getParentOfElement';
import { getScrollOfElement } from './utils/getScrollOfElement';
import { getVerticalPadding } from './utils/getVerticalPadding';
import { isOffsetElement } from './utils/isOffsetElement';
import { isWindow } from './utils/isWindow';
import { offsetTill } from './utils/offsetTill';

export interface StickyBoxConfig {
  /** The offset from the top for sticky behavior. */
  offsetTop?: number;
  /** The offset from the bottom for sticky behavior. */
  offsetBottom?: number;
  /** Indicates if the sticky behavior should be anchored to the bottom. */
  bottom?: boolean;
}

type StickyMode = 'stickyTop' | 'stickyBottom' | 'relative' | 'short' | null;

/**
 * Implements sticky behavior for HTML elements within a scrollable container.
 * This class enables the creation of elements that stick to a specific position on scroll,
 * facilitating an easy way to make elements remain fixed within a scrollable area.
 * FIXME: Should it have "onScroll", "onResize", "onModeChange" or "onUpdate" props ?
 * FIXME: Click anchor element to scroll
 */
export class Sticky {
  /** The options for the Sticky Box configuration. */
  private _options: Required<StickyBoxConfig>;
  /** List of unsubscribe functions. */
  private _unsubs: Array<() => void> = [];

  /** The HTML element representing the sticky element. */
  private _$stickyEl: HTMLElement;
  /** Dimensions of the sticky element. */
  private _dimensionsOfStickyElement: { height: number };

  /** The element representing the scroll of sticky element. */
  private _$scrollOfStickyElement: HTMLElement | Window;
  /** Dimensions of the scroll of sticky element. */
  private _scrollOfStickyElementDimensions: {
    height: number;
    offsetTop: number;
  };

  /** The parent of sticky element. */
  private _$parentOfStickyElement: HTMLElement | Window;
  /** Dimensions of the parent of stick element. */
  private _parentOfStickyElementDimensions: {
    height: number;
    naturalTop: number;
  };

  /** Represents the relative offset. */
  private _relativeOffset: number;
  /** Represents the mode of the Sticky. */
  private _mode: StickyMode;
  /** Indicates if the layout is scheduled. */
  private _isScheduled: boolean = false;
  /** The latest scroll position on the scroll pane. */
  private _latestScrollY: number;
  /** The supported type of sticky positioning */
  private _supportedStickyPosition: 'sticky' | '-webkit-sticky' | undefined = undefined;

  constructor({ $el, options }: { $el: HTMLElement; options: StickyBoxConfig }) {
    this._options = {
      bottom: options.bottom ?? false,
      offsetBottom: options.offsetBottom ?? 0,
      offsetTop: options.offsetTop ?? 0,
    };
    this._unsubs = [];

    this._$stickyEl = $el;
    this._dimensionsOfStickyElement = getDimensions({
      $el: this._$stickyEl,
      onChange: this._scheduleOnLayout,
      unsubs: this._unsubs,
      measure: ({ height }) => ({ height }),
    });

    this._$scrollOfStickyElement = getScrollOfElement($el);
    this._scrollOfStickyElementDimensions = getDimensions({
      $el: this._$scrollOfStickyElement,
      onChange: this._scheduleOnLayout,
      unsubs: this._unsubs,
      measure: ({ height, top }) => {
        const _scrollPaneIsOffsetEl =
          !isWindow(this._$scrollOfStickyElement) && isOffsetElement(this._$scrollOfStickyElement);
        return {
          height,
          offsetTop: _scrollPaneIsOffsetEl ? top : 0,
        };
      },
    });

    this._$parentOfStickyElement = getParentOfElement($el);
    this._parentOfStickyElementDimensions = getDimensions({
      $el: this._$parentOfStickyElement,
      onChange: this._scheduleOnLayout,
      unsubs: this._unsubs,
      measure: ({ height }) => {
        const parentPaddings = isWindow(this._$parentOfStickyElement)
          ? { top: 0, bottom: 0 }
          : getVerticalPadding(this._$parentOfStickyElement);
        return {
          height: height - parentPaddings.top - parentPaddings.bottom,
          naturalTop: isWindow(this._$parentOfStickyElement)
            ? 0
            : offsetTill({
                $el: this._$parentOfStickyElement,
                target: this._$scrollOfStickyElement,
              }) +
              parentPaddings.top +
              this._scrollOfStickyElementDimensions.offsetTop,
        };
      },
    });

    this._supportedStickyPosition = undefined;
    if (typeof CSS !== 'undefined' && CSS.supports) {
      if (CSS.supports('position', 'sticky')) {
        this._supportedStickyPosition = 'sticky';
      } else if (CSS.supports('position', '-webkit-sticky')) {
        this._supportedStickyPosition = '-webkit-sticky';
      }
    }

    this._relativeOffset = 0;
    this._isScheduled = false;
    this._latestScrollY = isWindow(this._$scrollOfStickyElement)
      ? window.scrollY
      : this._$scrollOfStickyElement.scrollTop;
    this._mode = this._onLayout();
    this._changeMode(this._mode);
  }

  /** Schedules the layout update for the sticky element based on scroll position and options. */
  private _scheduleOnLayout = (): void => {
    if (!this._isScheduled) {
      const rafId = requestAnimationFrame(() => {
        const nextMode = this._onLayout();
        if (nextMode !== this._mode) {
          this._changeMode(nextMode);
        } else if (nextMode === 'stickyBottom' && !this._options.bottom) {
          // ensure it still is at bottom
          const { height: viewportHeight } = this._scrollOfStickyElementDimensions;
          const { height: nodeHeight } = this._dimensionsOfStickyElement;
          this._$stickyEl.style.top = `${viewportHeight - nodeHeight - this._options.offsetBottom}px`;
        } else if (nextMode === 'relative') {
          const { height: viewportHeight, offsetTop: scrollPaneOffset } = this._scrollOfStickyElementDimensions;
          const { height: parentHeight, naturalTop } = this._parentOfStickyElementDimensions;
          const { height: nodeHeight } = this._dimensionsOfStickyElement;
          const relativeOffset = Math.max(
            0,
            scrollPaneOffset +
              this._latestScrollY +
              viewportHeight -
              (naturalTop + nodeHeight + this._options.offsetBottom),
          );
          if (this._options.bottom) {
            const nextBottom = Math.max(0, parentHeight - nodeHeight - relativeOffset);
            this._$stickyEl.style.bottom = `${nextBottom}px`;
          } else {
            this._$stickyEl.style.top = `${relativeOffset}px`;
          }
        }
        this._isScheduled = false;
      });
      this._unsubs.push(() => cancelAnimationFrame(rafId));
    }
    this._isScheduled = true;
  };

  /** Checks if the sticky box position is too low based on the scroll position. */
  private _isBoxTooLow = (scrollY: number): boolean => {
    const { offsetTop: scrollPaneOffset, height: viewportHeight } = this._scrollOfStickyElementDimensions;
    const { naturalTop } = this._parentOfStickyElementDimensions;
    const { height: nodeHeight } = this._dimensionsOfStickyElement;

    if (
      scrollY + scrollPaneOffset + viewportHeight >=
      naturalTop + nodeHeight + this._relativeOffset + this._options.offsetBottom
    ) {
      return true;
    }
    return false;
  };

  /** Determines the layout mode based on current dimensions and scroll positions. */
  private _onLayout = (): StickyMode => {
    const { height: viewportHeight } = this._scrollOfStickyElementDimensions;
    const { height: nodeHeight } = this._dimensionsOfStickyElement;
    if (nodeHeight + this._options.offsetTop + this._options.offsetBottom <= viewportHeight) {
      return 'short';
    } else {
      if (this._isBoxTooLow(this._latestScrollY)) {
        return 'stickyBottom';
      } else {
        return 'relative';
      }
    }
  };

  /** Changes the mode of the sticky element and adjusts its positioning accordingly. */
  private _changeMode = (newMode: StickyMode): void => {
    if (!this._supportedStickyPosition) {
      return;
    }

    const prevMode = this._mode;
    this._mode = newMode;
    if (prevMode === 'relative') {
      this._relativeOffset = -1;
    }
    if (newMode === 'short') {
      this._$stickyEl.style.position = this._supportedStickyPosition;
      if (this._options.bottom) {
        this._$stickyEl.style.bottom = `${this._options.offsetBottom}px`;
      } else {
        this._$stickyEl.style.top = `${this._options.offsetTop}px`;
      }
      return;
    }

    const { height: viewportHeight, offsetTop: scrollPaneOffset } = this._scrollOfStickyElementDimensions;
    const { height: parentHeight, naturalTop } = this._parentOfStickyElementDimensions;
    const { height: nodeHeight } = this._dimensionsOfStickyElement;
    if (newMode === 'relative') {
      this._$stickyEl.style.position = 'relative';
      this._relativeOffset =
        prevMode === 'stickyTop'
          ? Math.max(0, scrollPaneOffset + this._latestScrollY - naturalTop + this._options.offsetTop)
          : Math.max(
              0,
              scrollPaneOffset +
                this._latestScrollY +
                viewportHeight -
                (naturalTop + nodeHeight + this._options.offsetBottom),
            );
      if (this._options.bottom) {
        const nextBottom = Math.max(0, parentHeight - nodeHeight - this._relativeOffset);
        this._$stickyEl.style.bottom = `${nextBottom}px`;
      } else {
        this._$stickyEl.style.top = `${this._relativeOffset}px`;
      }
    } else {
      this._$stickyEl.style.position = this._supportedStickyPosition;
      if (newMode === 'stickyBottom') {
        if (this._options.bottom) {
          this._$stickyEl.style.bottom = `${this._options.offsetBottom}px`;
        } else {
          this._$stickyEl.style.top = `${viewportHeight - nodeHeight - this._options.offsetBottom}px`;
        }
      } else {
        // stickyTop
        if (this._options.bottom) {
          this._$stickyEl.style.bottom = `${viewportHeight - nodeHeight - this._options.offsetBottom}px`;
        } else {
          this._$stickyEl.style.top = `${this._options.offsetTop}px`;
        }
      }
    }
  };

  /** Handles scroll events and triggers mode changes based on scroll position. */
  private _onScroll = (scrollY: number): void => {
    if (scrollY === this._latestScrollY) {
      return;
    }
    const scrollDelta = scrollY - this._latestScrollY;
    this._latestScrollY = scrollY;
    if (this._mode === 'short') {
      return;
    }

    const { offsetTop: scrollPaneOffset, height: viewportHeight } = this._scrollOfStickyElementDimensions;
    const { naturalTop, height: parentHeight } = this._parentOfStickyElementDimensions;
    const { height: nodeHeight } = this._dimensionsOfStickyElement;

    /** Logic
      - If short box ==> Simple css sticky
      - If long box ==> Mode can be "stickyBottom" | "stickyTop" | "relative"
      - If box is "relative" ==> 2 cases are "scroll up" to archive "stickyTop" & "scroll down" to archive "stickyBottom"
      - If box is "stickyBottom" => 2 cases are "scroll up" to archive "stickyTop" & "scroll down" to archive "relative"
      - If box is "stickyTop" => 2 cases are "scroll up" to archive "relative" & "scroll down" to archive "stickyBottom"
    */
    if (scrollDelta > 0) {
      // scroll down
      if (this._mode === 'stickyTop') {
        if (scrollY + scrollPaneOffset + this._options.offsetTop > naturalTop) {
          const topOffset = Math.max(0, scrollPaneOffset + this._latestScrollY - naturalTop + this._options.offsetTop);
          if (
            scrollY + scrollPaneOffset + viewportHeight <=
            naturalTop + nodeHeight + topOffset + this._options.offsetBottom
          ) {
            this._changeMode('relative');
          } else {
            this._changeMode('stickyBottom');
          }
        }
      } else if (this._mode === 'relative') {
        if (this._isBoxTooLow(scrollY)) {
          this._changeMode('stickyBottom');
        }
      }
    } else {
      // scroll up
      if (this._mode === 'stickyBottom') {
        if (scrollPaneOffset + scrollY + viewportHeight < naturalTop + parentHeight + this._options.offsetBottom) {
          const bottomOffset = Math.max(
            0,
            scrollPaneOffset +
              this._latestScrollY +
              viewportHeight -
              (naturalTop + nodeHeight + this._options.offsetBottom),
          );
          if (scrollPaneOffset + scrollY + this._options.offsetTop >= naturalTop + bottomOffset) {
            this._changeMode('relative');
          } else {
            this._changeMode('stickyTop');
          }
        }
      } else if (this._mode === 'relative') {
        if (scrollPaneOffset + scrollY + this._options.offsetTop < naturalTop + this._relativeOffset) {
          this._changeMode('stickyTop');
        }
      }
    }
  };

  /** Initializes sticky behavior by setting up event listeners on the scroll pane element. */
  public create = (): void => {
    const scrollPaneEl = this._$scrollOfStickyElement;
    const handleScroll = isWindow(scrollPaneEl)
      ? (): void => this._onScroll(window.scrollY)
      : (): void => this._onScroll(scrollPaneEl.scrollTop);

    this._$scrollOfStickyElement.addEventListener('scroll', handleScroll, getPassiveArg());
    this._$scrollOfStickyElement.addEventListener('mousewheel', handleScroll, getPassiveArg());
    this._unsubs.push(
      () => this._$scrollOfStickyElement.removeEventListener('scroll', handleScroll),
      () => this._$scrollOfStickyElement.removeEventListener('mousewheel', handleScroll),
    );
  };

  /** Removes all event listeners and cleans up resources to disable sticky behavior. */
  public destroy = (): void => {
    this._unsubs.forEach(fn => fn());
  };

  //#region For testing
  //#endregion
}
