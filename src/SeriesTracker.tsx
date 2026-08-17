/**
 * SeriesTracker — React Native renderer.
 * SectionList with season sections, expandable, episode cells.
 * Consumes computeSeriesTrackerState and getSeriesTrackerAccessibility from @munin/ui-core.
 */

import React, { useCallback, useState } from 'react';
import { View, Text, Pressable, SectionList, type ViewStyle, type TextStyle, type SectionListData } from 'react-native';
import {
  computeSeriesTrackerState,
  getSeriesTrackerAccessibility,
  getSeasonAccessibility,
  type SeriesTrackerProps as CoreProps,
  type SeriesTrackerState,
  type SeasonDisplayState,
  type EpisodeDisplayState,
} from '@munin/ui-core';
import type { SeriesTrackerStyles, SeriesTrackerRenderProps } from './types.js';

export interface SeriesTrackerProps extends CoreProps, SeriesTrackerStyles, SeriesTrackerRenderProps {
  /** Called when a season header is toggled */
  onSeasonToggle?: (seasonNumber: number) => void;
  /** Test ID for testing */
  testID?: string;
}

export type { SeriesTrackerState, SeasonDisplayState, EpisodeDisplayState };

interface SectionData extends SectionListData<EpisodeDisplayState> {
  season: SeasonDisplayState;
  data: EpisodeDisplayState[];
}

export function SeriesTracker(props: SeriesTrackerProps): React.ReactNode {
  const {
    onSeasonToggle,
    onEpisodeSelect,
    testID,
    style,
    headerStyle,
    seasonHeaderStyle,
    episodeCellStyle,
    episodeTextStyle,
    renderHeader,
    renderSeasonHeader,
    renderEpisodeCell,
    renderEmpty,
    ...coreProps
  } = props;

  const [localExpanded, setLocalExpanded] = useState<number | undefined>(coreProps.expandedSeason);

  const effectiveProps: CoreProps = {
    ...coreProps,
    expandedSeason: localExpanded,
  };

  const state = computeSeriesTrackerState(effectiveProps);
  const a11y = getSeriesTrackerAccessibility(effectiveProps, state);

  const handleSeasonToggle = useCallback(
    (seasonNumber: number) => {
      setLocalExpanded((prev) => (prev === seasonNumber ? undefined : seasonNumber));
      onSeasonToggle?.(seasonNumber);
    },
    [onSeasonToggle],
  );

  const sections: SectionData[] = state.seasons.map((season) => ({
    season,
    data: season.isExpanded ? season.episodes : [],
  }));

  const renderSectionHeaderFn = useCallback(
    ({ section }: { section: SectionData }) => {
      const { season } = section;
      const seasonA11y = getSeasonAccessibility(season);

      if (renderSeasonHeader) {
        return renderSeasonHeader(season) as React.ReactElement;
      }

      return (
        <Pressable
          accessible
          accessibilityRole="button"
          accessibilityLabel={seasonA11y.label}
          accessibilityState={{ expanded: seasonA11y.expanded }}
          onPress={() => handleSeasonToggle(season.seasonNumber)}
          style={[defaultStyles.seasonHeader, seasonHeaderStyle]}
        >
          <Text>
            Season {season.seasonNumber} — {season.percent}%
          </Text>
          <Text>
            {season.completedEpisodes}/{season.totalEpisodes}
          </Text>
        </Pressable>
      );
    },
    [renderSeasonHeader, seasonHeaderStyle, handleSeasonToggle],
  );

  const renderItemFn = useCallback(
    ({ item }: { item: EpisodeDisplayState; index: number; section: SectionData }) => {
      if (renderEpisodeCell) {
        return renderEpisodeCell(item) as React.ReactElement;
      }

      return (
        <Pressable
          accessible
          accessibilityRole="button"
          accessibilityLabel={`Episode ${item.episodeNumber}: ${item.status}, ${item.percent}%`}
          onPress={() => onEpisodeSelect?.(item.episodeId)}
          style={[defaultStyles.episodeCell, episodeCellStyle]}
        >
          <Text style={[defaultStyles.episodeText, episodeTextStyle]}>
            E{item.episodeNumber}
          </Text>
          <Text style={[defaultStyles.episodeText, episodeTextStyle]}>
            {item.status} ({item.percent}%)
          </Text>
        </Pressable>
      );
    },
    [renderEpisodeCell, episodeCellStyle, episodeTextStyle, onEpisodeSelect],
  );

  if (state.seasons.length === 0 && renderEmpty) {
    return renderEmpty() as React.ReactElement;
  }

  return (
    <View
      accessible
      accessibilityRole="summary"
      accessibilityLabel={a11y.label}
      style={[defaultStyles.container, style]}
      testID={testID}
    >
      {renderHeader && renderHeader(state)}
      <SectionList<EpisodeDisplayState, SectionData>
        sections={sections}
        renderSectionHeader={renderSectionHeaderFn}
        renderItem={renderItemFn}
        keyExtractor={(item) => item.episodeId}
        stickySectionHeadersEnabled={false}
        style={[headerStyle]}
      />
    </View>
  );
}

const defaultStyles: Record<string, ViewStyle | TextStyle> = {
  container: {},
  seasonHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  episodeCell: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  episodeText: {},
};
