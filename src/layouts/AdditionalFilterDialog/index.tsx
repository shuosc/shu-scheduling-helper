import React, { useCallback, useMemo } from 'react';
import {
  ActionButton,
  Dialog,
  DialogType,
  IDialogContentProps,
  IIconProps,
  IModalProps,
  IStackTokens,
  ITextStyles,
  Separator,
  Stack,
  Text,
  Toggle,
  useTheme,
} from '@fluentui/react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { changeFilterConditions, hideModel, selectFilterConditions, selectModalVisibility } from '../../app/store';
import { LimitationFilterState, SpecialLimitationType } from '../../app/enums';
import LimitationFilter from './LimitationFilter';

const resetIconProps: IIconProps = { iconName: 'Delete' };
const mainTokens: IStackTokens = { childrenGap: '24px' };
const choiceGroupTokens: IStackTokens = { childrenGap: '12px', padding: '8px 4px' };

const dialogContentProps: IDialogContentProps = {
  type: DialogType.close,
  title: '其他筛选设置',
};

const AdditionalFilterDialog: React.FC = () => {
  const theme = useTheme();
  const { regExpMode } = useAppSelector(selectFilterConditions);
  const { additionalFilterDialog } = useAppSelector(selectModalVisibility);
  const dispatch = useAppDispatch();

  const modelProps = useMemo<IModalProps>(
    () => ({
      styles: { main: { width: '100% !important', maxWidth: '360px !important' } },
      isDarkOverlay: !theme.isInverted,
    }),
    [theme]
  );
  const descriptionTextStyles = useMemo<Partial<ITextStyles>>(
    () => ({ root: { color: theme.palette.neutralTertiary } }),
    [theme]
  );

  const onRegExpModeChange = useCallback(
    (_, checked?: boolean) => {
      if (checked != null) {
        dispatch(
          changeFilterConditions({
            regExpMode: checked,
          })
        );
      }
    },
    [dispatch]
  );
  const onReset = useCallback(() => {
    dispatch(
      changeFilterConditions({
        courseId: '',
        courseName: '',
        credit: '',
        teacherId: '',
        teacherName: '',
        classTime: '',
        campus: null,
        excludeSelected: false,
        remainingCapacity: 0,
        limitations: {
          [SpecialLimitationType.LIMITED_IN_NUMBER]: LimitationFilterState.DEFAULT,
          [SpecialLimitationType.NOT_SELECTABLE]: LimitationFilterState.DEFAULT,
          [SpecialLimitationType.NOT_UNSELECTABLE]: LimitationFilterState.DEFAULT,
        },
        sortBy: [],
        regExpMode: false,
      })
    );
    dispatch(hideModel('additionalFilterDialog'));
  }, [dispatch]);

  const onDismiss = useCallback(() => {
    dispatch(hideModel('additionalFilterDialog'));
  }, [dispatch]);

  return (
    <Dialog
      hidden={!additionalFilterDialog}
      onDismiss={onDismiss}
      modalProps={modelProps}
      dialogContentProps={dialogContentProps}
    >
      <Stack tokens={mainTokens}>
        <Stack.Item>
          <Separator>选课限制</Separator>
          <Stack tokens={choiceGroupTokens}>
            <LimitationFilter type={SpecialLimitationType.LIMITED_IN_NUMBER} />
            <LimitationFilter type={SpecialLimitationType.NOT_SELECTABLE} />
            <LimitationFilter type={SpecialLimitationType.NOT_UNSELECTABLE} />
          </Stack>
        </Stack.Item>
        <Stack.Item>
          <Separator>高级设置</Separator>
          <Toggle
            label="正则表达式模式："
            onText="开"
            offText="关"
            checked={regExpMode}
            onChange={onRegExpModeChange}
          />
          <Text variant="smallPlus" styles={descriptionTextStyles}>
            开启后，搜索时支持输入正则表达式。请勿输入过于复杂的表达式，如遇页面卡死，请手动刷新。
          </Text>
          <Separator />
          <ActionButton text="重置全部筛选条件" iconProps={resetIconProps} onClick={onReset} />
        </Stack.Item>
      </Stack>
    </Dialog>
  );
};

export default AdditionalFilterDialog;
