/**
 * RecommendationCard — React Native renderer.
 * Card layout: score + title + tags + reason.
 * Consumes computeRecommendationCardState and getRecommendationCardAccessibility from @munin/ui-core.
 */

import React from 'react';
import { View, Text, Pressable, type ViewStyle, type TextStyle } from 'react-native';
import {
  computeRecommendationCardState,
  getRecommendationCardAccessibility,
  type RecommendationCardProps as CoreProps,
  type RecommendationCardState,
} from '@munin/ui-core';
import type { RecommendationCardStyles, RecommendationCardRenderProps } from './types.js';

export interface RecommendationCardProps extends CoreProps, RecommendationCardStyles, RecommendationCardRenderProps {
  /** Test ID for testing */
  testID?: string;
}

export type { RecommendationCardState };

export const RecommendationCard = React.memo(function RecommendationCard(
  props: RecommendationCardProps,
): React.ReactNode {
  const {
    testID,
    style,
    scoreStyle,
    scoreTextStyle,
    titleStyle,
    tagContainerStyle,
    tagStyle,
    tagTextStyle,
    reasonStyle,
    renderScore,
    renderTags,
    renderReason,
    ...coreProps
  } = props;

  const state = computeRecommendationCardState(coreProps);
  const a11y = getRecommendationCardAccessibility(coreProps, state);

  return (
    <Pressable
      accessible
      accessibilityRole="button"
      accessibilityLabel={a11y.label}
      onPress={() => coreProps.onPress?.(state.titleId)}
      onLongPress={() => coreProps.onDismiss?.(state.titleId)}
      style={[defaultStyles.card, style]}
      testID={testID}
    >
      {/* Score */}
      {renderScore ? (
        renderScore(state)
      ) : (
        <View style={[defaultStyles.scoreBadge, scoreStyle]}>
          <Text style={[defaultStyles.scoreText, scoreTextStyle]}>
            {state.formattedScore}
          </Text>
        </View>
      )}

      {/* Title */}
      <Text style={[defaultStyles.title, titleStyle]} numberOfLines={2}>
        {state.titleId}
      </Text>

      {/* Tags */}
      {renderTags ? (
        renderTags(state)
      ) : (
        <View style={[defaultStyles.tagContainer, tagContainerStyle]}>
          {state.visibleTags.map((tag) => (
            <View key={tag} style={[defaultStyles.tag, tagStyle]}>
              <Text style={[defaultStyles.tagText, tagTextStyle]}>{tag}</Text>
            </View>
          ))}
          {state.hasMoreTags && (
            <View style={[defaultStyles.tag, tagStyle]}>
              <Text style={[defaultStyles.tagText, tagTextStyle]}>...</Text>
            </View>
          )}
        </View>
      )}

      {/* Reason */}
      {renderReason ? (
        renderReason(state)
      ) : (
        <Text style={[defaultStyles.reason, reasonStyle]} numberOfLines={3}>
          {state.reason}
        </Text>
      )}
    </Pressable>
  );
});

const defaultStyles: Record<string, ViewStyle | TextStyle> = {
  card: {},
  scoreBadge: {
    alignSelf: 'flex-start' as const,
  },
  scoreText: {},
  title: {},
  tagContainer: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
  },
  tag: {
    marginRight: 4,
    marginBottom: 4,
  },
  tagText: {},
  reason: {},
};
