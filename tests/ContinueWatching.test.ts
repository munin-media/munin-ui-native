/**
 * ContinueWatching component tests.
 * Tests the contract integration: state computation, filtering, accessibility.
 */

import { describe, it, expect } from 'vitest';
import {
  computeContinueWatchingState,
  getContinueWatchingAccessibility,
  getContinueWatchingItemAccessibility,
} from '@munin-media/ui-core';
import type { ProgressEntry } from '@munin-media/core';

const makeEntry = (overrides: Partial<ProgressEntry> = {}): ProgressEntry => ({
  userId: 'user-1',
  titleId: `title-${Math.random()}`,
  type: 'movie',
  currentSeconds: 3600,
  durationSeconds: 7200,
  percent: 0.5,
  isCompleted: false,
  lastUpdated: new Date('2024-01-15'),
  ...overrides,
});

describe('ContinueWatching', () => {
  describe('state computation (via ui-core)', () => {
    it('filters out completed items', () => {
      const items = [
        makeEntry({ titleId: 'a', isCompleted: false, percent: 0.5 }),
        makeEntry({ titleId: 'b', isCompleted: true, percent: 1.0 }),
      ];
      const state = computeContinueWatchingState({ items });
      expect(state.visibleItems).toHaveLength(1);
      expect(state.visibleItems[0]!.titleId).toBe('a');
    });

    it('filters out items with zero progress', () => {
      const items = [
        makeEntry({ titleId: 'a', percent: 0 }),
        makeEntry({ titleId: 'b', percent: 0.3 }),
      ];
      const state = computeContinueWatchingState({ items });
      expect(state.visibleItems).toHaveLength(1);
    });

    it('sorts by lastUpdated descending', () => {
      const items = [
        makeEntry({ titleId: 'old', lastUpdated: new Date('2024-01-01'), percent: 0.5 }),
        makeEntry({ titleId: 'new', lastUpdated: new Date('2024-01-15'), percent: 0.5 }),
      ];
      const state = computeContinueWatchingState({ items });
      expect(state.visibleItems[0]!.titleId).toBe('new');
    });

    it('limits items to maxVisible', () => {
      const items = Array.from({ length: 15 }, (_, i) =>
        makeEntry({ titleId: `t-${i}`, percent: 0.5 }),
      );
      const state = computeContinueWatchingState({ items, maxVisible: 5 });
      expect(state.visibleItems).toHaveLength(5);
      expect(state.hasMore).toBe(true);
    });

    it('isEmpty when no eligible items', () => {
      const state = computeContinueWatchingState({ items: [] });
      expect(state.isEmpty).toBe(true);
    });

    it('formats resume time correctly', () => {
      const items = [makeEntry({ currentSeconds: 3661, percent: 0.5 })]; // 1:01:01
      const state = computeContinueWatchingState({ items });
      expect(state.visibleItems[0]!.formattedResumeTime).toBe('1:01:01');
    });
  });

  describe('accessibility (via ui-core)', () => {
    it('returns list role with item count', () => {
      const props = { items: [makeEntry({ percent: 0.5 })] };
      const state = computeContinueWatchingState(props);
      const a11y = getContinueWatchingAccessibility(props, state);

      expect(a11y.role).toBe('list');
      expect(a11y.itemCount).toBe(1);
    });

    it('handles empty state label', () => {
      const props = { items: [] as ProgressEntry[] };
      const state = computeContinueWatchingState(props);
      const a11y = getContinueWatchingAccessibility(props, state);

      expect(a11y.label).toContain('No items');
    });

    it('generates item accessibility', () => {
      const itemA11y = getContinueWatchingItemAccessibility({
        titleId: 't-1',
        percent: 50,
        resumeSeconds: 1800,
        formattedResumeTime: '30:00',
        lastUpdated: new Date(),
      });

      expect(itemA11y.role).toBe('listitem');
      expect(itemA11y.label).toContain('30:00');
      expect(itemA11y.label).toContain('50%');
    });
  });
});
