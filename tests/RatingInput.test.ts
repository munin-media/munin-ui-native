/**
 * RatingInput component tests.
 * Tests the contract integration: compute state, accessibility, variants.
 */

import { describe, it, expect } from 'vitest';
import { computeRatingInputState, getRatingInputAccessibility } from '@munin/ui-core';

describe('RatingInput', () => {
  describe('state computation (via ui-core)', () => {
    it('uses default min/max when not provided', () => {
      const state = computeRatingInputState({});
      expect(state.steps).toHaveLength(10);
      expect(state.steps[0]).toBe(1);
      expect(state.steps[9]).toBe(10);
    });

    it('respects custom min/max', () => {
      const state = computeRatingInputState({ min: 1, max: 5 });
      expect(state.steps).toHaveLength(5);
    });

    it('uses provided value as current', () => {
      const state = computeRatingInputState({ value: 7 });
      expect(state.currentValue).toBe(7);
      expect(state.displayValue).toBe(7);
    });

    it('defaults to min when no value provided', () => {
      const state = computeRatingInputState({ min: 3, max: 10 });
      expect(state.currentValue).toBe(3);
    });

    it('tracks selected tags', () => {
      const state = computeRatingInputState({ selectedTags: ['action', 'comedy'] });
      expect(state.selectedTags).toEqual(['action', 'comedy']);
    });
  });

  describe('accessibility (via ui-core)', () => {
    it('returns slider role', () => {
      const props = { value: 5 };
      const state = computeRatingInputState(props);
      const a11y = getRatingInputAccessibility(props, state);

      expect(a11y.role).toBe('slider');
      expect(a11y.valueNow).toBe(5);
      expect(a11y.valueMin).toBe(1);
      expect(a11y.valueMax).toBe(10);
    });

    it('includes variant in label', () => {
      const props = { value: 3, variant: 'slider' as const };
      const state = computeRatingInputState(props);
      const a11y = getRatingInputAccessibility(props, state);

      expect(a11y.label).toContain('slider');
    });
  });
});
