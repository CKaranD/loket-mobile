import { useEffect, useRef } from 'react';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import type { FlashListRef } from '@shopify/flash-list';
import { Message } from '@/types';

type ListItem = Message | { date: string };

// How close (px) to the latest message counts as "reading the latest".
export const NEAR_LATEST_THRESHOLD = 120;

export const getNewestMessageId = (items: ListItem[]): number | undefined => {
  const newest = items.find((item): item is Message => !('date' in item));
  return newest?.id;
};

/**
 * The list is inverted (offset 0 = latest message). FlashList's
 * maintainVisibleContentPosition holds the viewport when a message is
 * prepended, which hides it below the fold, and its autoscrollToTopThreshold
 * is typed but not implemented (2.3.x). So scroll to the latest ourselves,
 * but only when the reader was already at the latest; someone reading history
 * stays put.
 */
export const shouldAutoScrollToLatest = ({
  previousNewestId,
  newestId,
  offsetBeforeUpdate,
}: {
  previousNewestId: number | undefined;
  newestId: number | undefined;
  offsetBeforeUpdate: number;
}): boolean =>
  previousNewestId !== undefined &&
  newestId !== undefined &&
  newestId !== previousNewestId &&
  offsetBeforeUpdate <= NEAR_LATEST_THRESHOLD;

export const useAutoScrollToLatest = (
  items: ListItem[],
  listRef: React.RefObject<FlashListRef<ListItem> | null>,
  enabled: boolean,
) => {
  const offsetRef = useRef(0);
  const previousNewestIdRef = useRef<number | undefined>(undefined);
  const newestId = getNewestMessageId(items);

  // Decide during render, before FlashList re-lays out and its position
  // adjustment emits a scroll event that would overwrite the pre-insert offset.
  const scrollPending = useRef(false);
  if (newestId !== previousNewestIdRef.current) {
    scrollPending.current =
      enabled &&
      shouldAutoScrollToLatest({
        previousNewestId: previousNewestIdRef.current,
        newestId,
        offsetBeforeUpdate: offsetRef.current,
      });
    previousNewestIdRef.current = newestId;
  }

  useEffect(() => {
    if (!scrollPending.current) {
      return;
    }
    scrollPending.current = false;
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, [newestId, listRef]);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    offsetRef.current = event.nativeEvent.contentOffset.y;
  };

  return { onScroll };
};
