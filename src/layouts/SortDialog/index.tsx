import React, { useCallback, useMemo } from 'react';
import {
  ActionButton,
  Dialog,
  DialogType,
  IDialogContentProps,
  IIconProps,
  IModalProps,
  IStackTokens,
  Stack,
  useTheme,
} from '@fluentui/react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { changeFilterConditions, hideModel, selectFilterConditions, selectModalVisibility } from '../../app/store';
import SortByDropdown from './SortByDropdown';

const resetIconProps: IIconProps = { iconName: 'Delete' };
const mainTokens: IStackTokens = { childrenGap: '24px' };
const dropdownTokens: IStackTokens = { childrenGap: '8px' };
const dialogContentProps: IDialogContentProps = {
  type: DialogType.close,
  title: '排序',
  subText: '可选择至多 5 个排序依据',
};

const SortDialog: React.FC = () => {
  const theme = useTheme();
  const { sortBy } = useAppSelector(selectFilterConditions);
  const { sortDialog } = useAppSelector(selectModalVisibility);
  const dispatch = useAppDispatch();

  const modelProps = useMemo<IModalProps>(
    () => ({
      styles: { main: { width: '100% !important', maxWidth: '360px !important' } },
      isDarkOverlay: !theme.isInverted,
    }),
    [theme]
  );

  const onDismiss = useCallback(() => {
    dispatch(hideModel('sortDialog'));
  }, [dispatch]);
  const onReset = useCallback(() => {
    dispatch(changeFilterConditions({ sortBy: [] }));
  }, [dispatch]);

  return (
    <Dialog hidden={!sortDialog} onDismiss={onDismiss} modalProps={modelProps} dialogContentProps={dialogContentProps}>
      <Stack tokens={mainTokens}>
        <Stack.Item>
          <Stack tokens={dropdownTokens}>
            <SortByDropdown num={1} />
            <SortByDropdown num={2} />
            <SortByDropdown num={3} />
            <SortByDropdown num={4} />
            <SortByDropdown num={5} />
          </Stack>
        </Stack.Item>
        <Stack.Item>
          <ActionButton text="重置排序" iconProps={resetIconProps} disabled={sortBy.length === 0} onClick={onReset} />
        </Stack.Item>
      </Stack>
    </Dialog>
  );
};

export default SortDialog;
