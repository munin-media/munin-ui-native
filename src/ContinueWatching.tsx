/**
 * ContinueWatching — React Native renderer.
 * Horizontal FlatList with cards, snap-to-item.
 * Consumes computeContinueWatchingState and getContinueWatchingAccessibility from @munin/ui-core.
 */

import React, { useCallback } from 'react';
import { View, Text, Pressable, FlatList, type ViewStyle, type TextStyle, type ListRenderItemInfo } from 'react-native';
import {
  computeContinueWatchingState,
  getContinueWatchingAccessibility,
  getContinueWatchingItemAccessibility,
  type ContinueWatchingProps as CoreProps,
  type ContinueWatchingState,
  type ContinueWatchingItem,
} from '@munin/ui-core';
import type { ContinueWatchingStyles, ContinueWatchingRenderProps } from './types.js';

export interface ContinueWatchingProps extends CoreProps, ContinueWatchingStyles, ContinueWatchingRenderProps {
  /** Width of each card for snap-to-item */
  cardWidth?: number;
  /** Called when "show more" is pressed */
  onShowMore?: () => void;
  /** Test ID for testing */
  testID?: string;
}

export type { ContinueWatchingState, ContinueWatchingItem };

export function ContinueWatching(props: ContinueWatchingProps): React.ReactNode {
  const {
    cardWidth,
    onShowMore,
    testID,
    style,
    cardStyle,
    titleStyle,
    progressStyle,
    resumeTimeStyle,
    renderCard,
    renderEmpty,
    renderShowMore,
    ...coreProps
  } = props;

  const state = computeContinueWatchingState(coreProps);
  const a11y = getContinueWatchingAccessibility(coreProps, state);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<ContinueWatchingItem>) => {
      if (renderCard) {
        return renderCard(item) as React.ReactElement;
      }

      const itemA11y = getContinueWatchingItemAccessibility(item);

      return (
        <Pressable
          accessible
          accessibilityRole="button"
          accessibilityLabel={itemA11y.label}
          onPress={() => coreProps.onResume?.(item.titleId)}
          style={[defaultStyles.card, cardWidth ? { width: cardWidth } : undefined, cardStyle]}
        >
          <Text style={[defaultStyles.title, titleStyle]} numberOfLines={1}>
            {item.titleId}
          </Text>
          <View style={[defaultStyles.progressTrack, progressStyle]}>
            <View style={[defaultStyles.progressFill, { width: `${item.percent}%` } as ViewStyle]} />
          </View>
          <Text style={[defaultStyles.resumeTime, resumeTimeStyle]}>
            {item.formattedResumeTime}
          </Text>
        </Pressable>
      );
    },
    [renderCard, cardStyle, titleStyle, progressStyle, resumeTimeStyle, cardWidth, coreProps],
  );

  if (state.isEmpty) {
    if (renderEmpty) {
      return renderEmpty(state) as React.ReactElement;
    }
    return (
      <View
        accessible
        accessibilityLabel={a11y.label}
        style={[defaultStyles.container, style]}
        testID={testID}
      >
        <Text>{coreProps.emptyMessage ?? 'Nothing to continue watching'}</Text>
      </View>
    );
  }

  return (
    <View
      accessible={false}
      style={[defaultStyles.container, style]}
      testID={testID}
    >
      <FlatList
        data={state.visibleItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.titleId}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={cardWidth}
        snapToAlignment="start"
        decelerationRate="fast"
        accessibilityRole="list"
        accessibilityLabel={a11y.label}
      />
      {state.hasMore && (
        renderShowMore ? (
          renderShowMore(state)
        ) : (
          <Pressable
            accessible
            accessibilityRole="button"
            accessibilityLabel="Show more items"
            onPress={onShowMore}
            style={defaultStyles.showMore}
          >
            <Text>Show more</Text>
          </Pressable>
        )
      )}
    </View>
  );
}

const defaultStyles: Record<string, ViewStyle | TextStyle> = {
  container: {},
  card: {
    marginRight: 8,
  },
  title: {},
  progressTrack: {
    overflow: 'hidden' as const,
    position: 'relative' as const,
  },
  progressFill: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    bottom: 0,
  },
  resumeTime: {},
  showMore: {
    alignItems: 'center' as const,
    padding: 8,
  },
};
