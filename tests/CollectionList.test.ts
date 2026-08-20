/**
 * CollectionList component tests.
 * Tests the contract integration: state computation, accessibility.
 */

import { describe, it, expect } from 'vitest';
import {
  computeCollectionListState,
  getCollectionListAccessibility,
  getCollectionItemAccessibility,
} from '@munin-media/ui-core';
import type { Collection } from '@munin-media/core';

const makeCollection = (overrides: Partial<Collection> = {}): Collection => ({
  collectionId: `col-${Math.random()}`,
  userId: 'user-1',
  name: 'My List',
  type: 'manual',
  items: ['title-1', 'title-2'],
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

describe('CollectionList', () => {
  describe('state computation (via ui-core)', () => {
    it('maps collections to display items', () => {
      const collections = [
        makeCollection({ collectionId: 'c1', name: 'Watchlist', items: ['a', 'b', 'c'] }),
      ];
      const state = computeCollectionListState({ collections });
      expect(state.items).toHaveLength(1);
      expect(state.items[0]!.name).toBe('Watchlist');
      expect(state.items[0]!.itemCount).toBe(3);
      expect(state.items[0]!.formattedCount).toBe('3 items');
    });

    it('handles singular item count', () => {
      const collections = [makeCollection({ items: ['a'] })];
      const state = computeCollectionListState({ collections });
      expect(state.items[0]!.formattedCount).toBe('1 item');
    });

    it('detects empty state', () => {
      const state = computeCollectionListState({ collections: [] });
      expect(state.isEmpty).toBe(true);
      expect(state.totalCount).toBe(0);
    });
  });

  describe('accessibility (via ui-core)', () => {
    it('returns list role', () => {
      const props = { collections: [makeCollection()] };
      const state = computeCollectionListState(props);
      const a11y = getCollectionListAccessibility(props, state);

      expect(a11y.role).toBe('list');
      expect(a11y.itemCount).toBe(1);
    });

    it('generates item accessibility', () => {
      const item = { collectionId: 'c1', name: 'Favorites', type: 'manual' as const, itemCount: 5, formattedCount: '5 items' };
      const a11y = getCollectionItemAccessibility(item);

      expect(a11y.role).toBe('listitem');
      expect(a11y.label).toContain('Favorites');
      expect(a11y.label).toContain('5 items');
    });
  });
});
