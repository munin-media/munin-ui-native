/**
 * CollectionList — React Native renderer.
 * Vertical FlatList with collection items.
 * Consumes computeCollectionListState and getCollectionListAccessibility from @munin/ui-core.
 */

import React, { useCallback } from 'react';
import { View, Text, Pressable, FlatList, type ViewStyle, type TextStyle, type ListRenderItemInfo } from 'react-native';
import {
  computeCollectionListState,
  getCollectionListAccessibility,
  getCollectionItemAccessibility,
  type CollectionListProps as CoreProps,
  type CollectionListState,
  type CollectionDisplayItem,
} from '@munin/ui-core';
import type { CollectionListStyles, CollectionListRenderProps } from './types.js';

export interface CollectionListProps extends CoreProps, CollectionListStyles, CollectionListRenderProps {
  /** Called when a new collection should be created */
  onCreate?: () => void;
  /** Test ID for testing */
  testID?: string;
}

export type { CollectionListState, CollectionDisplayItem };

export function CollectionList(props: CollectionListProps): React.ReactNode {
  const {
    onCreate,
    testID,
    style,
    itemStyle,
    nameStyle,
    countStyle,
    typeStyle,
    renderItem: renderItemProp,
    renderEmpty,
    ...coreProps
  } = props;

  const state = computeCollectionListState(coreProps);
  const a11y = getCollectionListAccessibility(coreProps, state);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<CollectionDisplayItem>) => {
      if (renderItemProp) {
        return renderItemProp(item) as React.ReactElement;
      }

      const itemA11y = getCollectionItemAccessibility(item);

      return (
        <Pressable
          accessible
          accessibilityRole="button"
          accessibilityLabel={itemA11y.label}
          onPress={() => coreProps.onSelect?.(item.collectionId)}
          onLongPress={() => coreProps.onDelete?.(item.collectionId)}
          style={[defaultStyles.item, itemStyle]}
        >
          <View style={defaultStyles.itemContent}>
            <Text style={[defaultStyles.name, nameStyle]}>{item.name}</Text>
            <Text style={[defaultStyles.type, typeStyle]}>{item.type}</Text>
          </View>
          <Text style={[defaultStyles.count, countStyle]}>{item.formattedCount}</Text>
        </Pressable>
      );
    },
    [renderItemProp, itemStyle, nameStyle, countStyle, typeStyle, coreProps],
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
        <Text>{coreProps.emptyMessage ?? 'No collections'}</Text>
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
        data={state.items}
        renderItem={renderItem}
        keyExtractor={(item) => item.collectionId}
        accessibilityRole="list"
        accessibilityLabel={a11y.label}
      />
    </View>
  );
}

const defaultStyles: Record<string, ViewStyle | TextStyle> = {
  container: {},
  item: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  itemContent: {
    flex: 1,
  },
  name: {},
  type: {},
  count: {},
};
