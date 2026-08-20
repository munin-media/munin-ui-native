/**
 * @munin-media/ui-native — Style and render prop type definitions.
 * All components accept style overrides and render props for full customization.
 */

import type { ViewStyle, TextStyle } from 'react-native';
import type { ReactNode } from 'react';
import type {
  ProgressBarState,
  SeriesTrackerState,
  SeasonDisplayState,
  EpisodeDisplayState,
  RatingInputState,
  ContinueWatchingState,
  ContinueWatchingItem,
  CollectionListState,
  CollectionDisplayItem,
  RecommendationCardState,
  ImportWizardState,
  ImportWizardStep,
} from '@munin-media/ui-core';

// --- ProgressBar Styles ---

export interface ProgressBarStyles {
  style?: ViewStyle;
  trackStyle?: ViewStyle;
  fillStyle?: ViewStyle;
  labelStyle?: TextStyle;
}

export interface ProgressBarRenderProps {
  renderTrack?: (state: ProgressBarState) => ReactNode;
  renderFill?: (state: ProgressBarState) => ReactNode;
  renderLabel?: (state: ProgressBarState) => ReactNode;
}

// --- SeriesTracker Styles ---

export interface SeriesTrackerStyles {
  style?: ViewStyle;
  headerStyle?: ViewStyle;
  seasonHeaderStyle?: ViewStyle;
  episodeCellStyle?: ViewStyle;
  episodeTextStyle?: TextStyle;
}

export interface SeriesTrackerRenderProps {
  renderHeader?: (state: SeriesTrackerState) => ReactNode;
  renderSeasonHeader?: (season: SeasonDisplayState) => ReactNode;
  renderEpisodeCell?: (episode: EpisodeDisplayState) => ReactNode;
  renderEmpty?: () => ReactNode;
}

// --- RatingInput Styles ---

export interface RatingInputStyles {
  style?: ViewStyle;
  starStyle?: ViewStyle;
  activeStarStyle?: ViewStyle;
  sliderTrackStyle?: ViewStyle;
  sliderThumbStyle?: ViewStyle;
  numericInputStyle?: TextStyle;
  tagStyle?: ViewStyle;
  activeTagStyle?: ViewStyle;
  tagTextStyle?: TextStyle;
}

export interface RatingInputRenderProps {
  renderStar?: (index: number, isActive: boolean, state: RatingInputState) => ReactNode;
  renderSlider?: (state: RatingInputState) => ReactNode;
  renderNumericInput?: (state: RatingInputState) => ReactNode;
  renderTag?: (tag: string, isSelected: boolean) => ReactNode;
}

// --- ContinueWatching Styles ---

export interface ContinueWatchingStyles {
  style?: ViewStyle;
  cardStyle?: ViewStyle;
  titleStyle?: TextStyle;
  progressStyle?: ViewStyle;
  resumeTimeStyle?: TextStyle;
}

export interface ContinueWatchingRenderProps {
  renderCard?: (item: ContinueWatchingItem) => ReactNode;
  renderEmpty?: (state: ContinueWatchingState) => ReactNode;
  renderShowMore?: (state: ContinueWatchingState) => ReactNode;
}

// --- CollectionList Styles ---

export interface CollectionListStyles {
  style?: ViewStyle;
  itemStyle?: ViewStyle;
  nameStyle?: TextStyle;
  countStyle?: TextStyle;
  typeStyle?: TextStyle;
}

export interface CollectionListRenderProps {
  renderItem?: (item: CollectionDisplayItem) => ReactNode;
  renderEmpty?: (state: CollectionListState) => ReactNode;
}

// --- RecommendationCard Styles ---

export interface RecommendationCardStyles {
  style?: ViewStyle;
  scoreStyle?: ViewStyle;
  scoreTextStyle?: TextStyle;
  titleStyle?: TextStyle;
  tagContainerStyle?: ViewStyle;
  tagStyle?: ViewStyle;
  tagTextStyle?: TextStyle;
  reasonStyle?: TextStyle;
}

export interface RecommendationCardRenderProps {
  renderScore?: (state: RecommendationCardState) => ReactNode;
  renderTags?: (state: RecommendationCardState) => ReactNode;
  renderReason?: (state: RecommendationCardState) => ReactNode;
}

// --- ImportWizard Styles ---

export interface ImportWizardStyles {
  style?: ViewStyle;
  stepIndicatorStyle?: ViewStyle;
  stepDotStyle?: ViewStyle;
  activeStepDotStyle?: ViewStyle;
  completedStepDotStyle?: ViewStyle;
  contentStyle?: ViewStyle;
  navigationStyle?: ViewStyle;
  buttonStyle?: ViewStyle;
  buttonTextStyle?: TextStyle;
  disabledButtonStyle?: ViewStyle;
}

export interface ImportWizardRenderProps {
  renderStepIndicator?: (steps: ImportWizardStep[], currentStep: number) => ReactNode;
  renderStepContent?: (state: ImportWizardState) => ReactNode;
  renderNavigation?: (state: ImportWizardState) => ReactNode;
}
