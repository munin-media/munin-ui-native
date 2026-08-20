/**
 * ImportWizard component tests.
 * Tests the contract integration: state machine, step validation, accessibility.
 */

import { describe, it, expect } from 'vitest';
import {
  computeImportWizardState,
  getImportWizardAccessibility,
  getImportWizardStepAccessibility,
  type ImportWizardInput,
} from '@munin-media/ui-core';

const makeInput = (overrides: Partial<ImportWizardInput> = {}): ImportWizardInput => ({
  props: {
    availableSources: [
      { id: 'trakt', name: 'Trakt', description: 'Import from Trakt.tv', acceptedFormats: ['json'] },
      { id: 'csv', name: 'CSV', description: 'Generic CSV import', acceptedFormats: ['csv'] },
    ],
  },
  currentStep: 0,
  selectedSourceId: null,
  hasFile: false,
  hasMappingConfirmed: false,
  ...overrides,
});

describe('ImportWizard', () => {
  describe('state computation (via ui-core)', () => {
    it('starts at step 0 with 4 steps', () => {
      const state = computeImportWizardState(makeInput());
      expect(state.currentStep).toBe(0);
      expect(state.steps).toHaveLength(4);
    });

    it('cannot proceed without source selection on step 0', () => {
      const state = computeImportWizardState(makeInput());
      expect(state.canProceed).toBe(false);
      expect(state.validationErrors).toContain('Please select an import source');
    });

    it('can proceed after source selection', () => {
      const state = computeImportWizardState(makeInput({ selectedSourceId: 'trakt' }));
      expect(state.canProceed).toBe(true);
      expect(state.validationErrors).toHaveLength(0);
    });

    it('cannot proceed on step 1 without file', () => {
      const state = computeImportWizardState(makeInput({ currentStep: 1, selectedSourceId: 'trakt' }));
      expect(state.canProceed).toBe(false);
    });

    it('can proceed on step 1 with file', () => {
      const state = computeImportWizardState(makeInput({ currentStep: 1, selectedSourceId: 'trakt', hasFile: true }));
      expect(state.canProceed).toBe(true);
    });

    it('resolves selected source object', () => {
      const state = computeImportWizardState(makeInput({ selectedSourceId: 'trakt' }));
      expect(state.selectedSource).not.toBeNull();
      expect(state.selectedSource!.name).toBe('Trakt');
    });

    it('canGoBack is false on step 0', () => {
      const state = computeImportWizardState(makeInput());
      expect(state.canGoBack).toBe(false);
    });

    it('canGoBack is true on step 1', () => {
      const state = computeImportWizardState(makeInput({ currentStep: 1, selectedSourceId: 'trakt' }));
      expect(state.canGoBack).toBe(true);
    });

    it('marks steps as completed/active/pending', () => {
      const state = computeImportWizardState(makeInput({ currentStep: 2, selectedSourceId: 'trakt', hasFile: true }));
      expect(state.steps[0]!.status).toBe('completed');
      expect(state.steps[1]!.status).toBe('completed');
      expect(state.steps[2]!.status).toBe('error'); // hasMappingConfirmed is false
      expect(state.steps[3]!.status).toBe('pending');
    });
  });

  describe('accessibility (via ui-core)', () => {
    it('returns form role', () => {
      const input = makeInput();
      const state = computeImportWizardState(input);
      const a11y = getImportWizardAccessibility(input, state);

      expect(a11y.role).toBe('form');
      expect(a11y.label).toBe('Import Wizard');
    });

    it('generates step label', () => {
      const input = makeInput({ currentStep: 1, selectedSourceId: 'trakt' });
      const state = computeImportWizardState(input);
      const a11y = getImportWizardAccessibility(input, state);

      expect(a11y.stepLabel).toContain('Step 2 of 4');
      expect(a11y.stepLabel).toContain('Upload File');
    });

    it('generates step accessibility', () => {
      const step = { index: 0, name: 'Select Source', status: 'active' as const };
      const a11y = getImportWizardStepAccessibility(step, 0);

      expect(a11y.role).toBe('group');
      expect(a11y.current).toBe(true);
      expect(a11y.label).toContain('Select Source');
    });
  });
});
