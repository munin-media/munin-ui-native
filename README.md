# @munin/ui-native

React Native renderer for Munin UI components. Headless, unstyled, accessible.

## Overview

Renders Munin UI components using React Native primitives (`View`, `Text`, `Pressable`, `FlatList`, `SectionList`, `Animated`). Consumes `@munin/ui-core` for state computation and accessibility — no duplicated logic.

**Headless/unstyled** — consumers apply their own theme (Tamagui, NativeWind, StyleSheet).

## Components

| Component | Primitives Used | Accessibility |
|-----------|----------------|---------------|
| `ProgressBar` | View + Animated.View | `progressbar` role + value |
| `SeriesTracker` | SectionList + Pressable | `group` role + expanded state |
| `RatingInput` | Pressable row / TextInput | `adjustable`/`slider` role |
| `ContinueWatching` | Horizontal FlatList | `list` role + item labels |
| `CollectionList` | Vertical FlatList | `list` role + item labels |
| `RecommendationCard` | Pressable card | `button` role + label |
| `ImportWizard` | Multi-step View + Pressable | `form` role + step labels |

## Installation

```bash
yarn add @munin/ui-native
```

### Peer Dependencies

```json
{
  "react": ">=18.0.0",
  "react-native": ">=0.72.0",
  "@munin/ui-core": "^0.1.0"
}
```

Optional:
- `@munin/hooks` — for data fetching integration
- `react-native-reanimated` — for advanced animations

## Usage

```tsx
import { ProgressBar } from '@munin/ui-native';

<ProgressBar
  percent={0.73}
  isCompleted={false}
  showLabel
  trackStyle={{ height: 8, borderRadius: 4, backgroundColor: '#333' }}
  fillStyle={{ backgroundColor: '#0f0' }}
  labelStyle={{ color: '#fff', fontSize: 12 }}
/>
```

### Render Props (Full Customization)

```tsx
import { ProgressBar } from '@munin/ui-native';

<ProgressBar
  percent={0.73}
  isCompleted={false}
  renderTrack={(state) => (
    <MyCustomProgressView percent={state.displayPercent} />
  )}
/>
```

### Style Props

Every sub-element accepts a style override prop:

```tsx
<SeriesTracker
  series={seriesData}
  seasonHeaderStyle={{ padding: 12, backgroundColor: '#1a1a1a' }}
  episodeCellStyle={{ height: 48, paddingHorizontal: 16 }}
  episodeTextStyle={{ color: '#ccc' }}
/>
```

## Architecture

```
@munin/ui-core (contracts, state, accessibility)
      ↓ consumed by
@munin/ui-native (this package — RN primitives)
      ↓ consumed by
Your app (applies Tamagui/NativeWind/StyleSheet theme)
```

## Development

```bash
yarn install
yarn build       # tsc → dist/
yarn typecheck   # tsc --noEmit
yarn test        # vitest
```

## License

MIT
