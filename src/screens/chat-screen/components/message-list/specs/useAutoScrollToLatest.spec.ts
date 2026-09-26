import {
  getNewestMessageId,
  NEAR_LATEST_THRESHOLD,
  shouldAutoScrollToLatest,
} from '../useAutoScrollToLatest';
import { Message } from '@/types';

const message = (id: number) => ({ id }) as Message;

describe('getNewestMessageId', () => {
  it('skips date separators and returns the first message id', () => {
    expect(getNewestMessageId([{ date: 'Today' }, message(9), message(8)])).toBe(9);
  });

  it('is undefined for an empty list', () => {
    expect(getNewestMessageId([])).toBeUndefined();
  });
});

describe('shouldAutoScrollToLatest', () => {
  it('scrolls when a new message arrives while reading the latest', () => {
    expect(
      shouldAutoScrollToLatest({ previousNewestId: 8, newestId: 9, offsetBeforeUpdate: 0 }),
    ).toBe(true);
  });

  it('scrolls when just within the threshold', () => {
    expect(
      shouldAutoScrollToLatest({
        previousNewestId: 8,
        newestId: 9,
        offsetBeforeUpdate: NEAR_LATEST_THRESHOLD,
      }),
    ).toBe(true);
  });

  it('stays put when the reader has scrolled up into history', () => {
    expect(
      shouldAutoScrollToLatest({
        previousNewestId: 8,
        newestId: 9,
        offsetBeforeUpdate: NEAR_LATEST_THRESHOLD + 1,
      }),
    ).toBe(false);
  });

  it('does not scroll on the first load of the conversation', () => {
    expect(
      shouldAutoScrollToLatest({ previousNewestId: undefined, newestId: 9, offsetBeforeUpdate: 0 }),
    ).toBe(false);
  });

  it('does not scroll when the newest message is unchanged (e.g. older page loaded)', () => {
    expect(
      shouldAutoScrollToLatest({ previousNewestId: 9, newestId: 9, offsetBeforeUpdate: 0 }),
    ).toBe(false);
  });
});
