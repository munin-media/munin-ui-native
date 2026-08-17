/**
 * ImportWizard — React Native renderer.
 * Multi-step flow with Back/Next navigation.
 * Consumes computeImportWizardState and getImportWizardAccessibility from @munin/ui-core.
 */

import React, { useCallback, useState } from 'react';
import { View, Text, Pressable, type ViewStyle, type TextStyle } from 'react-native';
import {
  computeImportWizardState,
  getImportWizardAccessibility,
  getImportWizardStepAccessibility,
  type ImportWizardProps as CoreProps,
  type ImportWizardState,
  type ImportWizardStep,
  type ImportSource,
  type ImportWizardInput,
} from '@munin/ui-core';
import type { ImportWizardStyles, ImportWizardRenderProps } from './types.js';

export interface ImportWizardProps extends CoreProps, ImportWizardStyles, ImportWizardRenderProps {
  /** Called when navigating back */
  onBack?: () => void;
  /** Called when navigating forward */
  onNext?: () => void;
  /** Called when a source is selected */
  onSourceSelect?: (sourceId: string) => void;
  /** Called when a file is provided */
  onFileSelect?: (file: { name: string; size: number }) => void;
  /** Test ID for testing */
  testID?: string;
}

export type { ImportWizardState, ImportWizardStep, ImportSource };

export function ImportWizard(props: ImportWizardProps): React.ReactNode {
  const {
    onBack,
    onNext,
    onSourceSelect,
    onFileSelect,
    testID,
    style,
    stepIndicatorStyle,
    stepDotStyle,
    activeStepDotStyle,
    completedStepDotStyle,
    contentStyle,
    navigationStyle,
    buttonStyle,
    buttonTextStyle,
    disabledButtonStyle,
    renderStepIndicator,
    renderStepContent,
    renderNavigation,
    ...coreProps
  } = props;

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const [hasFile, setHasFile] = useState(false);
  const [hasMappingConfirmed, setHasMappingConfirmed] = useState(false);

  const input: ImportWizardInput = {
    props: coreProps,
    currentStep,
    selectedSourceId,
    hasFile,
    hasMappingConfirmed,
  };

  const state = computeImportWizardState(input);
  const a11y = getImportWizardAccessibility(input, state);

  const handleNext = useCallback(() => {
    if (!state.canProceed) return;
    setCurrentStep((prev) => prev + 1);
    onNext?.();
  }, [state.canProceed, onNext]);

  const handleBack = useCallback(() => {
    if (!state.canGoBack) return;
    setCurrentStep((prev) => prev - 1);
    onBack?.();
  }, [state.canGoBack, onBack]);

  const handleSourceSelect = useCallback(
    (sourceId: string) => {
      setSelectedSourceId(sourceId);
      onSourceSelect?.(sourceId);
    },
    [onSourceSelect],
  );

  const handleFileSelect = useCallback(
    (file: { name: string; size: number }) => {
      setHasFile(true);
      onFileSelect?.(file);
    },
    [onFileSelect],
  );

  const handleMappingConfirm = useCallback(() => {
    setHasMappingConfirmed(true);
  }, []);

  const handleComplete = useCallback(() => {
    coreProps.onComplete?.({
      sourceId: selectedSourceId ?? '',
      itemsImported: 0,
      itemsSkipped: 0,
      errors: 0,
    });
  }, [coreProps, selectedSourceId]);

  // --- Step Indicator ---

  const renderStepIndicatorDefault = (): React.ReactNode => {
    if (renderStepIndicator) {
      return renderStepIndicator(state.steps, state.currentStep);
    }

    return (
      <View style={[defaultStyles.stepIndicator, stepIndicatorStyle]}>
        {state.steps.map((step) => {
          const stepA11y = getImportWizardStepAccessibility(step, state.currentStep);
          const dotStyles = [
            defaultStyles.stepDot,
            stepDotStyle,
            step.status === 'active' && activeStepDotStyle,
            step.status === 'completed' && completedStepDotStyle,
          ];

          return (
            <View
              key={step.index}
              accessible
              accessibilityLabel={stepA11y.label}
              style={dotStyles as ViewStyle[]}
            />
          );
        })}
      </View>
    );
  };

  // --- Step Content ---

  const renderStepContentDefault = (): React.ReactNode => {
    if (renderStepContent) {
      return renderStepContent(state);
    }

    switch (currentStep) {
      case 0:
        return renderSourceSelection();
      case 1:
        return renderFileUpload();
      case 2:
        return renderPreview();
      case 3:
        return renderConfirmation();
      default:
        return null;
    }
  };

  const renderSourceSelection = (): React.ReactNode => (
    <View style={defaultStyles.stepContent}>
      <Text style={defaultStyles.stepTitle}>Select Import Source</Text>
      {coreProps.availableSources.map((source) => (
        <Pressable
          key={source.id}
          accessible
          accessibilityRole="button"
          accessibilityLabel={`${source.name}: ${source.description}`}
          accessibilityState={{ selected: selectedSourceId === source.id }}
          onPress={() => handleSourceSelect(source.id)}
          style={[
            defaultStyles.sourceItem,
            selectedSourceId === source.id && defaultStyles.sourceItemSelected,
          ]}
        >
          <Text>{source.name}</Text>
          <Text>{source.description}</Text>
        </Pressable>
      ))}
    </View>
  );

  const renderFileUpload = (): React.ReactNode => (
    <View style={defaultStyles.stepContent}>
      <Text style={defaultStyles.stepTitle}>Upload File</Text>
      <Pressable
        accessible
        accessibilityRole="button"
        accessibilityLabel="Select file to import"
        onPress={() => handleFileSelect({ name: 'import.json', size: 0 })}
        style={defaultStyles.uploadButton}
      >
        <Text>{hasFile ? 'File selected ✓' : 'Select file...'}</Text>
      </Pressable>
    </View>
  );

  const renderPreview = (): React.ReactNode => (
    <View style={defaultStyles.stepContent}>
      <Text style={defaultStyles.stepTitle}>Preview & Map</Text>
      <Pressable
        accessible
        accessibilityRole="button"
        accessibilityLabel="Confirm field mapping"
        onPress={handleMappingConfirm}
        style={defaultStyles.confirmButton}
      >
        <Text>{hasMappingConfirmed ? 'Mapping confirmed ✓' : 'Confirm mapping'}</Text>
      </Pressable>
    </View>
  );

  const renderConfirmation = (): React.ReactNode => (
    <View style={defaultStyles.stepContent}>
      <Text style={defaultStyles.stepTitle}>Confirm Import</Text>
      <Text>
        Source: {state.selectedSource?.name ?? 'Unknown'}
      </Text>
      <Pressable
        accessible
        accessibilityRole="button"
        accessibilityLabel="Start import"
        onPress={handleComplete}
        style={defaultStyles.confirmButton}
      >
        <Text>Start Import</Text>
      </Pressable>
    </View>
  );

  // --- Navigation ---

  const renderNavigationDefault = (): React.ReactNode => {
    if (renderNavigation) {
      return renderNavigation(state);
    }

    return (
      <View style={[defaultStyles.navigation, navigationStyle]}>
        <Pressable
          accessible
          accessibilityRole="button"
          accessibilityLabel="Go back"
          disabled={!state.canGoBack}
          onPress={handleBack}
          style={[defaultStyles.button, buttonStyle, !state.canGoBack && disabledButtonStyle]}
        >
          <Text style={[defaultStyles.buttonText, buttonTextStyle]}>Back</Text>
        </Pressable>
        {!state.isComplete && (
          <Pressable
            accessible
            accessibilityRole="button"
            accessibilityLabel="Go to next step"
            disabled={!state.canProceed}
            onPress={handleNext}
            style={[defaultStyles.button, buttonStyle, !state.canProceed && disabledButtonStyle]}
          >
            <Text style={[defaultStyles.buttonText, buttonTextStyle]}>Next</Text>
          </Pressable>
        )}
        <Pressable
          accessible
          accessibilityRole="button"
          accessibilityLabel="Cancel import"
          onPress={coreProps.onCancel}
          style={[defaultStyles.button, buttonStyle]}
        >
          <Text style={[defaultStyles.buttonText, buttonTextStyle]}>Cancel</Text>
        </Pressable>
      </View>
    );
  };

  if (state.isComplete) {
    return (
      <View
        accessible
        accessibilityLabel="Import complete"
        style={[defaultStyles.container, style]}
        testID={testID}
      >
        <Text>Import complete!</Text>
      </View>
    );
  }

  return (
    <View
      accessible
      accessibilityRole="summary"
      accessibilityLabel={a11y.label}
      style={[defaultStyles.container, style]}
      testID={testID}
    >
      {renderStepIndicatorDefault()}
      <Text>{a11y.stepLabel}</Text>
      <View style={[defaultStyles.content, contentStyle]}>
        {renderStepContentDefault()}
      </View>
      {state.validationErrors.length > 0 && (
        <View style={defaultStyles.errors}>
          {state.validationErrors.map((error, i) => (
            <Text key={i} style={defaultStyles.errorText}>{error}</Text>
          ))}
        </View>
      )}
      {renderNavigationDefault()}
    </View>
  );
}

const defaultStyles: Record<string, ViewStyle | TextStyle> = {
  container: {},
  stepIndicator: {
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  content: {
    flex: 1,
  },
  stepContent: {},
  stepTitle: {},
  navigation: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
  },
  button: {
    padding: 12,
    alignItems: 'center' as const,
  },
  buttonText: {},
  sourceItem: {
    padding: 12,
    marginVertical: 4,
  },
  sourceItemSelected: {},
  uploadButton: {
    padding: 12,
    alignItems: 'center' as const,
  },
  confirmButton: {
    padding: 12,
    alignItems: 'center' as const,
  },
  errors: {},
  errorText: {},
};
