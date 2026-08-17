/**
 * Minimal React Native type declarations for @munin/ui-native build.
 * react-native is a peer dependency — consumers provide the actual implementation.
 * These types are sufficient for the component interfaces we use.
 */

declare module 'react-native' {
  import type { ComponentType, ReactNode, RefObject } from 'react';

  // --- Style Types ---

  export interface ViewStyle {
    [key: string]: unknown;
  }

  export interface TextStyle extends ViewStyle {
    [key: string]: unknown;
  }

  export interface ImageStyle {
    [key: string]: unknown;
  }

  // --- Accessibility Types ---

  export type AccessibilityRole =
    | 'none'
    | 'button'
    | 'link'
    | 'search'
    | 'image'
    | 'text'
    | 'adjustable'
    | 'progressbar'
    | 'header'
    | 'summary'
    | 'list'
    | 'timer'
    | 'alert'
    | 'radiobutton_checked'
    | 'radiobutton_unchecked';

  export interface AccessibilityValue {
    min?: number;
    max?: number;
    now?: number;
    text?: string;
  }

  export type AccessibilityState = {
    disabled?: boolean;
    selected?: boolean;
    checked?: boolean | 'mixed';
    busy?: boolean;
    expanded?: boolean;
  };

  // --- View ---

  export interface ViewProps {
    accessible?: boolean;
    accessibilityRole?: AccessibilityRole;
    accessibilityLabel?: string;
    accessibilityValue?: AccessibilityValue;
    accessibilityState?: AccessibilityState;
    accessibilityHint?: string;
    style?: ViewStyle | ViewStyle[] | (ViewStyle | undefined | false)[];
    testID?: string;
    children?: ReactNode;
    onLayout?: (event: LayoutChangeEvent) => void;
  }

  export interface LayoutChangeEvent {
    nativeEvent: {
      layout: { x: number; y: number; width: number; height: number };
    };
  }

  export const View: ComponentType<ViewProps>;

  // --- Text ---

  export interface TextProps {
    accessible?: boolean;
    accessibilityRole?: AccessibilityRole;
    accessibilityLabel?: string;
    style?: TextStyle | TextStyle[] | (TextStyle | undefined | false)[];
    numberOfLines?: number;
    testID?: string;
    children?: ReactNode;
  }

  export const Text: ComponentType<TextProps>;

  // --- Pressable ---

  export interface PressableProps {
    accessible?: boolean;
    accessibilityRole?: AccessibilityRole;
    accessibilityLabel?: string;
    accessibilityValue?: AccessibilityValue;
    accessibilityState?: AccessibilityState;
    accessibilityHint?: string;
    style?: ViewStyle | ViewStyle[] | ((state: { pressed: boolean }) => ViewStyle | ViewStyle[]) | (ViewStyle | undefined | false)[];
    disabled?: boolean;
    onPress?: () => void;
    onLongPress?: () => void;
    testID?: string;
    children?: ReactNode | ((state: { pressed: boolean }) => ReactNode);
  }

  export const Pressable: ComponentType<PressableProps>;

  // --- TextInput ---

  export interface TextInputProps {
    accessible?: boolean;
    accessibilityRole?: AccessibilityRole;
    accessibilityLabel?: string;
    accessibilityValue?: AccessibilityValue;
    style?: TextStyle | TextStyle[] | (TextStyle | undefined | false)[];
    value?: string;
    defaultValue?: string;
    placeholder?: string;
    keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad' | 'decimal-pad';
    onChangeText?: (text: string) => void;
    onSubmitEditing?: () => void;
    maxLength?: number;
    editable?: boolean;
    testID?: string;
  }

  export const TextInput: ComponentType<TextInputProps>;

  // --- ScrollView ---

  export interface ScrollViewProps extends ViewProps {
    horizontal?: boolean;
    showsHorizontalScrollIndicator?: boolean;
    showsVerticalScrollIndicator?: boolean;
    contentContainerStyle?: ViewStyle | ViewStyle[];
    pagingEnabled?: boolean;
    scrollEnabled?: boolean;
  }

  export const ScrollView: ComponentType<ScrollViewProps>;

  // --- FlatList ---

  export interface ListRenderItemInfo<T> {
    item: T;
    index: number;
    separators: {
      highlight: () => void;
      unhighlight: () => void;
      updateProps: (select: 'leading' | 'trailing', newProps: object) => void;
    };
  }

  export interface FlatListProps<T> {
    data: T[] | null | undefined;
    renderItem: (info: ListRenderItemInfo<T>) => ReactNode;
    keyExtractor?: (item: T, index: number) => string;
    horizontal?: boolean;
    showsHorizontalScrollIndicator?: boolean;
    showsVerticalScrollIndicator?: boolean;
    snapToInterval?: number;
    snapToAlignment?: 'start' | 'center' | 'end';
    decelerationRate?: 'normal' | 'fast' | number;
    contentContainerStyle?: ViewStyle | ViewStyle[];
    style?: ViewStyle | ViewStyle[] | (ViewStyle | undefined | false)[];
    ListEmptyComponent?: ReactNode | ComponentType;
    ListHeaderComponent?: ReactNode | ComponentType;
    ListFooterComponent?: ReactNode | ComponentType;
    ItemSeparatorComponent?: ComponentType;
    accessible?: boolean;
    accessibilityRole?: AccessibilityRole;
    accessibilityLabel?: string;
    testID?: string;
    getItemLayout?: (data: T[] | null | undefined, index: number) => { length: number; offset: number; index: number };
    initialNumToRender?: number;
    maxToRenderPerBatch?: number;
    windowSize?: number;
    onEndReached?: () => void;
    onEndReachedThreshold?: number;
  }

  export class FlatList<T> extends React.Component<FlatListProps<T>> {}

  // --- SectionList ---

  export interface SectionListData<T> {
    data: T[];
    key?: string;
    renderItem?: (info: { item: T; index: number; section: SectionListData<T> }) => ReactNode;
    [key: string]: unknown;
  }

  export interface SectionListProps<T, S extends SectionListData<T> = SectionListData<T>> {
    sections: ReadonlyArray<S>;
    renderItem?: (info: { item: T; index: number; section: S }) => ReactNode;
    renderSectionHeader?: (info: { section: S }) => ReactNode;
    renderSectionFooter?: (info: { section: S }) => ReactNode;
    keyExtractor?: (item: T, index: number) => string;
    stickySectionHeadersEnabled?: boolean;
    style?: ViewStyle | ViewStyle[] | (ViewStyle | undefined | false)[];
    contentContainerStyle?: ViewStyle | ViewStyle[];
    ListEmptyComponent?: ReactNode | ComponentType;
    ListHeaderComponent?: ReactNode | ComponentType;
    ListFooterComponent?: ReactNode | ComponentType;
    accessible?: boolean;
    accessibilityRole?: AccessibilityRole;
    accessibilityLabel?: string;
    testID?: string;
  }

  export class SectionList<T, S extends SectionListData<T> = SectionListData<T>> extends React.Component<SectionListProps<T, S>> {}

  // --- Animated ---

  export namespace Animated {
    export class Value {
      constructor(value: number);
      setValue(value: number): void;
      interpolate(config: { inputRange: number[]; outputRange: number[] | string[] }): AnimatedInterpolation;
    }

    export interface AnimatedInterpolation {
      interpolate(config: { inputRange: number[]; outputRange: number[] | string[] }): AnimatedInterpolation;
    }

    export function timing(
      value: Value,
      config: { toValue: number; duration?: number; useNativeDriver?: boolean },
    ): CompositeAnimation;

    export interface CompositeAnimation {
      start(callback?: (result: { finished: boolean }) => void): void;
      stop(): void;
    }

    export const View: ComponentType<ViewProps & { style?: unknown }>;
    export const Text: ComponentType<TextProps & { style?: unknown }>;
  }

  // --- StyleSheet ---

  export namespace StyleSheet {
    export function create<T extends Record<string, ViewStyle | TextStyle | ImageStyle>>(
      styles: T,
    ): T;
    export function flatten(style: unknown): ViewStyle;
  }
}
