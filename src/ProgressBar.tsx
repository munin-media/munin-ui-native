/**
 * ProgressBar — React Native renderer.
 * Renders a View track with animated View fill.
 * Consumes computeProgressBarState and getProgressBarAccessibility from @munin/ui-core.
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, type ViewStyle, type TextStyle } from 'react-native';
import {
  computeProgressBarState,
  getProgressBarAccessibility,
  type ProgressBarProps as CoreProps,
  type ProgressBarState,
} from '@munin/ui-core';
import type { ProgressBarStyles, ProgressBarRenderProps } from './types.js';

export interface ProgressBarProps extends CoreProps, ProgressBarStyles, ProgressBarRenderProps {
  /** Whether to animate width transitions */
  animated?: boolean;
  /** Animation duration in ms (default: 300) */
  animationDuration?: number;
  /** Test ID for testing */
  testID?: string;
}

export type { ProgressBarState };

export function ProgressBar(props: ProgressBarProps): React.ReactNode {
  const {
    animated = true,
    animationDuration = 300,
    testID,
    style,
    trackStyle,
    fillStyle,
    labelStyle,
    renderTrack,
    renderFill,
    renderLabel,
    ...coreProps
  } = props;

  const state = computeProgressBarState(coreProps);
  const a11y = getProgressBarAccessibility(coreProps, state);

  const animatedWidth = useRef(new Animated.Value(state.displayPercent)).current;

  useEffect(() => {
    if (animated) {
      Animated.timing(animatedWidth, {
        toValue: state.displayPercent,
        duration: animationDuration,
        useNativeDriver: false,
      }).start();
    } else {
      animatedWidth.setValue(state.displayPercent);
    }
  }, [state.displayPercent, animated, animationDuration, animatedWidth]);

  // Full render prop override
  if (renderTrack) {
    return renderTrack(state) as React.ReactElement;
  }

  const fillWidthStyle = animated
    ? {
        width: animatedWidth.interpolate({
          inputRange: [0, 100],
          outputRange: ['0%', '100%'],
        }),
      }
    : { width: `${state.displayPercent}%` };

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityValue={{
        min: a11y.valueMin,
        max: a11y.valueMax,
        now: a11y.valueNow,
      }}
      accessibilityLabel={a11y.label}
      style={[defaultStyles.track, trackStyle, style]}
      testID={testID}
    >
      {renderFill ? (
        renderFill(state)
      ) : (
        <Animated.View style={[defaultStyles.fill, fillWidthStyle as ViewStyle, fillStyle]} />
      )}
      {coreProps.showLabel && (
        renderLabel ? (
          renderLabel(state)
        ) : (
          <Text style={[defaultStyles.label, labelStyle]}>{state.formattedPercent}</Text>
        )
      )}
    </View>
  );
}

const defaultStyles: Record<string, ViewStyle | TextStyle> = {
  track: {
    overflow: 'hidden' as const,
    position: 'relative' as const,
  },
  fill: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    bottom: 0,
  },
  label: {
    position: 'absolute' as const,
  },
};
