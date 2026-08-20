/**
 * RatingInput — React Native renderer.
 * Stars (Pressable row), slider, and numeric variants.
 * Consumes computeRatingInputState and getRatingInputAccessibility from @munin-media/ui-core.
 */

import React, { useCallback, useState } from 'react';
import { View, Text, Pressable, TextInput, type ViewStyle, type TextStyle } from 'react-native';
import {
  computeRatingInputState,
  getRatingInputAccessibility,
  type RatingInputProps as CoreProps,
  type RatingInputState,
  type RatingResult,
} from '@munin-media/ui-core';
import type { RatingInputStyles, RatingInputRenderProps } from './types.js';

export interface RatingInputProps extends CoreProps, RatingInputStyles, RatingInputRenderProps {
  /** Called when value changes during interaction */
  onChange?: (value: number) => void;
  /** Called when a tag is toggled */
  onTagToggle?: (tag: string) => void;
  /** Test ID for testing */
  testID?: string;
}

export type { RatingInputState, RatingResult };

export function RatingInput(props: RatingInputProps): React.ReactNode {
  const {
    onChange,
    onTagToggle,
    testID,
    style,
    starStyle,
    activeStarStyle,
    sliderTrackStyle,
    sliderThumbStyle,
    numericInputStyle,
    tagStyle,
    activeTagStyle,
    tagTextStyle,
    renderStar,
    renderSlider,
    renderNumericInput,
    renderTag,
    ...coreProps
  } = props;

  const variant = coreProps.variant ?? 'stars';
  const [currentValue, setCurrentValue] = useState(coreProps.value ?? (coreProps.min ?? 1));
  const [selectedTags, setSelectedTags] = useState<string[]>(coreProps.selectedTags ?? []);

  const effectiveProps: CoreProps = {
    ...coreProps,
    value: currentValue,
    selectedTags,
  };

  const state = computeRatingInputState(effectiveProps);
  const a11y = getRatingInputAccessibility(effectiveProps, state);

  const handleStarPress = useCallback(
    (value: number) => {
      setCurrentValue(value);
      onChange?.(value);
    },
    [onChange],
  );

  const handleNumericChange = useCallback(
    (text: string) => {
      const min = coreProps.min ?? 1;
      const max = coreProps.max ?? 10;
      const num = parseInt(text, 10);
      if (!isNaN(num) && num >= min && num <= max) {
        setCurrentValue(num);
        onChange?.(num);
      }
    },
    [onChange, coreProps.min, coreProps.max],
  );

  const handleTagPress = useCallback(
    (tag: string) => {
      setSelectedTags((prev) => {
        const next = prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag];
        return next;
      });
      onTagToggle?.(tag);
    },
    [onTagToggle],
  );

  const handleSubmit = useCallback(() => {
    coreProps.onRate?.({ score: currentValue, tags: selectedTags });
  }, [coreProps, currentValue, selectedTags]);

  const renderVariant = (): React.ReactNode => {
    switch (variant) {
      case 'stars':
        return renderStarsVariant();
      case 'slider':
        return renderSliderVariant();
      case 'numeric':
        return renderNumericVariant();
      default:
        return renderStarsVariant();
    }
  };

  const renderStarsVariant = (): React.ReactNode => {
    if (renderSlider && variant === 'slider') return renderSlider(state);

    return (
      <View style={defaultStyles.starsRow} accessibilityRole="adjustable">
        {state.steps.map((step) => {
          const isActive = step <= state.displayValue;
          if (renderStar) {
            return (
              <Pressable key={step} onPress={() => handleStarPress(step)}>
                {renderStar(step, isActive, state)}
              </Pressable>
            );
          }
          return (
            <Pressable
              key={step}
              accessible
              accessibilityRole="button"
              accessibilityLabel={`${step} star${step > 1 ? 's' : ''}`}
              accessibilityState={{ selected: isActive }}
              onPress={() => handleStarPress(step)}
              style={[defaultStyles.star, starStyle, isActive && activeStarStyle]}
            >
              <Text>{isActive ? '★' : '☆'}</Text>
            </Pressable>
          );
        })}
      </View>
    );
  };

  const renderSliderVariant = (): React.ReactNode => {
    if (renderSlider) return renderSlider(state);

    const min = coreProps.min ?? 1;
    const max = coreProps.max ?? 10;
    const percent = ((currentValue - min) / (max - min)) * 100;

    return (
      <View
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel={a11y.label}
        accessibilityValue={{ min: a11y.valueMin, max: a11y.valueMax, now: a11y.valueNow }}
        style={[defaultStyles.sliderContainer]}
      >
        <View style={[defaultStyles.sliderTrack, sliderTrackStyle]}>
          <View style={[defaultStyles.sliderFill, { width: `${percent}%` } as ViewStyle]} />
          <View style={[defaultStyles.sliderThumb, { left: `${percent}%` } as ViewStyle, sliderThumbStyle]} />
        </View>
        <Text>{state.displayValue}</Text>
      </View>
    );
  };

  const renderNumericVariant = (): React.ReactNode => {
    if (renderNumericInput) return renderNumericInput(state);

    return (
      <TextInput
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel={a11y.label}
        accessibilityValue={{ min: a11y.valueMin, max: a11y.valueMax, now: a11y.valueNow }}
        value={String(currentValue)}
        keyboardType="numeric"
        onChangeText={handleNumericChange}
        style={[defaultStyles.numericInput, numericInputStyle]}
        testID={testID ? `${testID}-input` : undefined}
      />
    );
  };

  return (
    <View
      accessible={false}
      style={[defaultStyles.container, style]}
      testID={testID}
    >
      {renderVariant()}
      {coreProps.suggestedTags && coreProps.suggestedTags.length > 0 && (
        <View style={defaultStyles.tagsRow}>
          {coreProps.suggestedTags.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            if (renderTag) {
              return (
                <Pressable key={tag} onPress={() => handleTagPress(tag)}>
                  {renderTag(tag, isSelected)}
                </Pressable>
              );
            }
            return (
              <Pressable
                key={tag}
                accessible
                accessibilityRole="button"
                accessibilityLabel={`Tag: ${tag}`}
                accessibilityState={{ selected: isSelected }}
                onPress={() => handleTagPress(tag)}
                style={[defaultStyles.tag, tagStyle, isSelected && activeTagStyle]}
              >
                <Text style={[defaultStyles.tagText, tagTextStyle]}>{tag}</Text>
              </Pressable>
            );
          })}
        </View>
      )}
      {coreProps.onRate && (
        <Pressable
          accessible
          accessibilityRole="button"
          accessibilityLabel="Submit rating"
          onPress={handleSubmit}
          style={defaultStyles.submitButton}
        >
          <Text>Submit</Text>
        </Pressable>
      )}
    </View>
  );
}

const defaultStyles: Record<string, ViewStyle | TextStyle> = {
  container: {},
  starsRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  star: {
    padding: 4,
  },
  sliderContainer: {
    alignItems: 'stretch' as const,
  },
  sliderTrack: {
    position: 'relative' as const,
    height: 4,
  },
  sliderFill: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    bottom: 0,
  },
  sliderThumb: {
    position: 'absolute' as const,
    top: -8,
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  numericInput: {},
  tagsRow: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 4,
    marginBottom: 4,
    borderRadius: 4,
  },
  tagText: {},
  submitButton: {
    alignItems: 'center' as const,
    padding: 8,
  },
};
