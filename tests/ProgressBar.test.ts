/**
 * ProgressBar component tests.
 * Tests the contract integration: compute state, accessibility, style props, render props.
 */

import { describe, it, expect } from 'vitest';
import { computeProgressBarState, getProgressBarAccessibility } from '@munin/ui-core';

describe('ProgressBar', () => {
  describe('state computation (via ui-core)', () => {
    it('clamps percent to 0-100', () => {
      const state = computeProgressBarState({ percent: 1.5, isCompleted: false });
      expect(state.displayPercent).toBe(100);
    });

    it('handles zero percent', () => {
      const state = computeProgressBarState({ percent: 0, isCompleted: false });
      expect(state.displayPercent).toBe(0);
      expect(state.formattedPercent).toBe('0%');
    });

    it('rounds to nearest integer', () => {
      const state = computeProgressBarState({ percent: 0.736, isCompleted: false });
      expect(state.displayPercent).toBe(74);
      expect(state.formattedPercent).toBe('74%');
    });

    it('marks as complete when isCompleted is true', () => {
      const state = computeProgressBarState({ percent: 0.8, isCompleted: true });
      expect(state.isComplete).toBe(true);
    });

    it('marks as complete when percent >= 1', () => {
      const state = computeProgressBarState({ percent: 1.0, isCompleted: false });
      expect(state.isComplete).toBe(true);
    });
  });

  describe('accessibility (via ui-core)', () => {
    it('returns progressbar role', () => {
      const props = { percent: 0.5, isCompleted: false };
      const state = computeProgressBarState(props);
      const a11y = getProgressBarAccessibility(props, state);

      expect(a11y.role).toBe('progressbar');
      expect(a11y.valueNow).toBe(50);
      expect(a11y.valueMin).toBe(0);
      expect(a11y.valueMax).toBe(100);
    });

    it('uses custom label when provided', () => {
      const props = { percent: 0.3, isCompleted: false, label: 'Movie progress' };
      const state = computeProgressBarState(props);
      const a11y = getProgressBarAccessibility(props, state);

      expect(a11y.label).toBe('Movie progress');
    });

    it('generates default label from percent', () => {
      const props = { percent: 0.75, isCompleted: false };
      const state = computeProgressBarState(props);
      const a11y = getProgressBarAccessibility(props, state);

      expect(a11y.label).toBe('Progress: 75%');
    });
  });
});
