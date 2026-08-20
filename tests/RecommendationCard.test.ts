/**
 * RecommendationCard component tests.
 * Tests the contract integration: state computation, accessibility.
 */

import { describe, it, expect } from 'vitest';
import {
  computeRecommendationCardState,
  getRecommendationCardAccessibility,
} from '@munin-media/ui-core';
import type { Recommendation } from '@munin-media/core';

const makeRecommendation = (overrides: Partial<Recommendation> = {}): Recommendation => ({
  titleId: 'title-1',
  score: 0.87,
  matchingTags: ['thriller', 'mystery', 'crime', 'noir'],
  reason: 'High affinity with thriller and mystery tags',
  ...overrides,
});

describe('RecommendationCard', () => {
  describe('state computation (via ui-core)', () => {
    it('computes display score as percentage', () => {
      const state = computeRecommendationCardState({
        recommendation: makeRecommendation({ score: 0.87 }),
      });
      expect(state.displayScore).toBe(87);
      expect(state.formattedScore).toBe('87% match');
    });

    it('limits visible tags to maxTags', () => {
      const state = computeRecommendationCardState({
        recommendation: makeRecommendation(),
        maxTags: 2,
      });
      expect(state.visibleTags).toHaveLength(2);
      expect(state.hasMoreTags).toBe(true);
    });

    it('defaults maxTags to 3', () => {
      const state = computeRecommendationCardState({
        recommendation: makeRecommendation(),
      });
      expect(state.visibleTags).toHaveLength(3);
      expect(state.hasMoreTags).toBe(true);
    });

    it('hasMoreTags is false when all tags fit', () => {
      const state = computeRecommendationCardState({
        recommendation: makeRecommendation({ matchingTags: ['a', 'b'] }),
      });
      expect(state.hasMoreTags).toBe(false);
    });
  });

  describe('accessibility (via ui-core)', () => {
    it('returns button role', () => {
      const props = { recommendation: makeRecommendation() };
      const state = computeRecommendationCardState(props);
      const a11y = getRecommendationCardAccessibility(props, state);

      expect(a11y.role).toBe('button');
      expect(a11y.label).toContain('87% match');
    });

    it('includes tags in label', () => {
      const props = { recommendation: makeRecommendation() };
      const state = computeRecommendationCardState(props);
      const a11y = getRecommendationCardAccessibility(props, state);

      expect(a11y.label).toContain('thriller');
    });

    it('includes reason in label', () => {
      const props = { recommendation: makeRecommendation() };
      const state = computeRecommendationCardState(props);
      const a11y = getRecommendationCardAccessibility(props, state);

      expect(a11y.label).toContain('High affinity');
    });
  });
});
