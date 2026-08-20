/**
 * SeriesTracker component tests.
 * Tests the contract integration: state computation, accessibility.
 */

import { describe, it, expect } from 'vitest';
import {
  computeSeriesTrackerState,
  getSeriesTrackerAccessibility,
  getSeasonAccessibility,
} from '@munin-media/ui-core';
import type { SeriesProgress } from '@munin-media/core';

const makeSeries = (overrides: Partial<SeriesProgress> = {}): SeriesProgress => ({
  userId: 'user-1',
  seriesId: 'series-1',
  seasons: [
    {
      seasonId: 's1',
      seasonNumber: 1,
      episodes: [
        { episodeId: 'e1', episodeNumber: 1, currentSeconds: 2400, durationSeconds: 2400, percent: 1.0, isCompleted: true },
        { episodeId: 'e2', episodeNumber: 2, currentSeconds: 1200, durationSeconds: 2400, percent: 0.5, isCompleted: false },
        { episodeId: 'e3', episodeNumber: 3, currentSeconds: 0, durationSeconds: 2400, percent: 0, isCompleted: false },
      ],
      percent: 0.5,
      totalEpisodes: 3,
      completedEpisodes: 1,
    },
  ],
  overallPercent: 0.5,
  totalEpisodes: 3,
  completedEpisodes: 1,
  lastWatchedEpisodeId: 'e2',
  lastUpdated: new Date(),
  ...overrides,
});

describe('SeriesTracker', () => {
  describe('state computation (via ui-core)', () => {
    it('maps seasons to display state', () => {
      const state = computeSeriesTrackerState({ series: makeSeries() });
      expect(state.seasons).toHaveLength(1);
      expect(state.seasons[0]!.seasonNumber).toBe(1);
      expect(state.seasons[0]!.percent).toBe(50);
    });

    it('computes episode statuses', () => {
      const state = computeSeriesTrackerState({ series: makeSeries() });
      const episodes = state.seasons[0]!.episodes;
      expect(episodes[0]!.status).toBe('completed');
      expect(episodes[1]!.status).toBe('in-progress');
      expect(episodes[2]!.status).toBe('unwatched');
    });

    it('respects expandedSeason', () => {
      const state = computeSeriesTrackerState({ series: makeSeries(), expandedSeason: 1 });
      expect(state.seasons[0]!.isExpanded).toBe(true);
    });

    it('all seasons collapsed by default', () => {
      const state = computeSeriesTrackerState({ series: makeSeries() });
      expect(state.seasons[0]!.isExpanded).toBe(false);
    });

    it('computes overall progress', () => {
      const state = computeSeriesTrackerState({ series: makeSeries() });
      expect(state.overallPercent).toBe(50);
      expect(state.formattedOverall).toBe('50%');
      expect(state.completedEpisodes).toBe(1);
      expect(state.totalEpisodes).toBe(3);
    });
  });

  describe('accessibility (via ui-core)', () => {
    it('returns group role for series', () => {
      const props = { series: makeSeries() };
      const state = computeSeriesTrackerState(props);
      const a11y = getSeriesTrackerAccessibility(props, state);

      expect(a11y.role).toBe('group');
      expect(a11y.label).toContain('50%');
      expect(a11y.label).toContain('1 of 3');
    });

    it('returns season accessibility with expanded state', () => {
      const season = {
        seasonNumber: 1,
        percent: 50,
        episodes: [],
        isExpanded: true,
        completedEpisodes: 1,
        totalEpisodes: 3,
      };
      const a11y = getSeasonAccessibility(season);

      expect(a11y.role).toBe('group');
      expect(a11y.expanded).toBe(true);
      expect(a11y.label).toContain('Season 1');
    });
  });
});
