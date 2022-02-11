import React, { useMemo } from 'react';
import {
  ActionButton,
  ChoiceGroup,
  DefaultButton,
  IChoiceGroupOption,
  IChoiceGroupOptionStyles,
  IChoiceGroupStyles,
  IContextualMenuProps,
  IIconProps,
  IPanelStyles,
  IStackTokens,
  Label,
  Panel,
  PanelType,
  Stack,
} from '@fluentui/react';
import constants from '../../app/constants';
import { useAppDispatch, useAppSelector, useTermsMenuItems } from '../../app/hooks';
import {
  selectActiveTerm,
  selectDarkMode,
  selectInitStatus,
  selectShowOptionsPanel,
  setDarkMode,
  setShowOptionsPanel,
} from '../../app/store';
import { DarkMode, InitStatus } from '../../app/enums';
import Header from './Header';

const contentTokens: IStackTokens = { childrenGap: '20px' };
const actionsTokens: IStackTokens = { childrenGap: '8px' };
const styles: Partial<IPanelStyles> = { content: { padding: '20px 24px' } };
const colorSchemeOptionStyles: Partial<IChoiceGroupOptionStyles> = {
  labelWrapper: { margin: '6px 8px 2px', height: '30px' },
};
const colorSchemeStyles: Partial<IChoiceGroupStyles> = { flexContainer: { maxWidth: '245px' } };
const undoIconProps: IIconProps = { iconName: 'Undo' };
const redoIconProps: IIconProps = { iconName: 'Redo' };
const termSelectIconProps: IIconProps = { iconName: 'Calendar' };

const colorSchemeOptions: IChoiceGroupOption[] = [
  { key: DarkMode.OFF, iconProps: { iconName: 'Sunny' }, styles: colorSchemeOptionStyles },
  { key: DarkMode.ON, iconProps: { iconName: 'ClearNight' }, styles: colorSchemeOptionStyles },
  { key: DarkMode.AUTO },
].map((item) => ({
  ...item,
  text: constants.DARK_MODE_NAME[item.key as DarkMode],
}));

const Option: React.FC = () => {
  const show = useAppSelector(selectShowOptionsPanel);
  const initStatus = useAppSelector(selectInitStatus);
  const activeTerm = useAppSelector(selectActiveTerm);
  const darkMode = useAppSelector(selectDarkMode);
  const termsMenuItems = useTermsMenuItems();
  const dispatch = useAppDispatch();

  const termsMenuProps = useMemo<IContextualMenuProps>(
    () => ({
      shouldFocusOnMount: true,
      items: termsMenuItems,
    }),
    [termsMenuItems]
  );

  return (
    <Panel
      isOpen={show}
      onDismiss={() => dispatch(setShowOptionsPanel(false))}
      onRenderHeader={() => <Header />}
      headerText="SHU排课助手"
      type={PanelType.custom}
      customWidth="400px"
      isLightDismiss
      closeButtonAriaLabel="关闭"
      styles={styles}
    >
      <Stack tokens={contentTokens}>
        <Stack.Item>
          <Stack horizontal tokens={actionsTokens}>
            <ActionButton text="撤销" iconProps={undoIconProps} disabled />
            <ActionButton text="重做" iconProps={redoIconProps} disabled />
          </Stack>
        </Stack.Item>
        {!!activeTerm && (
          <Stack.Item>
            <Label>选择学期</Label>
            <DefaultButton
              iconProps={termSelectIconProps}
              menuProps={termsMenuProps}
              text={activeTerm.termName}
              disabled={initStatus !== InitStatus.SUCCEEDED}
            />
          </Stack.Item>
        )}
        <Stack.Item>
          <Label>颜色主题</Label>
          <ChoiceGroup
            options={colorSchemeOptions}
            selectedKey={darkMode}
            styles={colorSchemeStyles}
            onChange={(_, option) => dispatch(setDarkMode(option!.key as DarkMode))}
          />
        </Stack.Item>
      </Stack>
    </Panel>
  );
};

export default Option;
