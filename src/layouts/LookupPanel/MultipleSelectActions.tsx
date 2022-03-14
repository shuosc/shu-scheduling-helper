import React from 'react';
import { ContextualMenuItemType, DefaultButton, IStackTokens, Link, Stack, Text } from '@fluentui/react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectCourseSelectionCount, setCourseSelection } from '../../app/store';

const stackTokens: IStackTokens = { childrenGap: '0 16px' };

const MultipleSelectActions: React.FC = () => {
  const selectionCount = useAppSelector(selectCourseSelectionCount);
  const dispatch = useAppDispatch();
  return (
    <Stack horizontal verticalAlign="center" tokens={stackTokens} wrap>
      <DefaultButton
        text="批量操作"
        primary={selectionCount > 0}
        disabled={selectionCount <= 0}
        menuProps={{
          shouldFocusOnMount: true,
          items: [
            {
              key: 'ADD_STAR',
              text: '设为星标',
              iconProps: { iconName: 'AddFavorite' },
            },
            {
              key: 'DIVIDER',
              itemType: ContextualMenuItemType.Divider,
            },
            {
              key: 'CANCEL_STAR',
              text: '取消星标',
              iconProps: { iconName: 'Unfavorite' },
            },
          ],
        }}
      />
      <Stack.Item>
        <Stack horizontal verticalAlign="center" tokens={stackTokens} wrap>
          <Stack.Item>
            <Text>已选中 {selectionCount} 行</Text>
          </Stack.Item>
          <Stack.Item>
            <Link
              onClick={() => {
                dispatch(setCourseSelection(null));
              }}
            >
              取消选择
            </Link>
          </Stack.Item>
        </Stack>
      </Stack.Item>
    </Stack>
  );
};

export default MultipleSelectActions;
