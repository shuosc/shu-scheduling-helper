import React, { useMemo } from 'react';
import { ContextualMenuItemType, ICommandBarItemProps, IContextualMenuItem, mergeStyles } from '@fluentui/react';
import constants from '../../app/constants';
import { useAppDispatch, useAppSelector, useTermsMenuItems } from '../../app/hooks';
import { selectActiveTerm, selectDarkMode, selectInitStatus, selectUpdateStatus, setDarkMode } from '../../app/store';
import { DarkMode, InitStatus, UpdateStatus } from '../../app/enums';
import Brand from '../../components/Brand';
import NavBase from './Nav.base';
import SpinnerItem from './SpinnerItem';
import UpdateMessageBar from './UpdateMessageBar';

const brandClassName = mergeStyles({ margin: 'auto 24px auto 0' });
const brandItem: ICommandBarItemProps = {
  key: 'BRAND',
  onRender: () => (
    <div className={brandClassName}>
      <Brand />
    </div>
  ),
};

const useTermSelectItem = (): ICommandBarItemProps => {
  const initStatus = useAppSelector(selectInitStatus);
  const activeTerm = useAppSelector(selectActiveTerm);
  const termsMenuItems = useTermsMenuItems();

  return useMemo(
    () => ({
      key: 'TERM',
      iconProps: { iconName: 'Calendar' },
      ...(termsMenuItems.length > 0
        ? {
            text: activeTerm ? activeTerm.termName : '未选择学期',
            secondaryText: '切换学期',
            subMenuProps: {
              items: termsMenuItems,
            },
            disabled: initStatus !== InitStatus.SUCCEEDED,
          }
        : {
            text: '暂无可用的学期',
            disabled: true,
          }),
    }),
    [activeTerm, initStatus, termsMenuItems]
  );
};

const useUpdateStatusItems = (): ICommandBarItemProps[] => {
  const initStatus = useAppSelector(selectInitStatus);
  const updateStatus = useAppSelector(selectUpdateStatus);

  return useMemo(() => {
    if (initStatus === InitStatus.LOADING || updateStatus === UpdateStatus.UPDATING) {
      return [
        {
          key: 'INIT_LOADING',
          onRender: () => (
            <SpinnerItem text={updateStatus === UpdateStatus.UPDATING ? '正在更新数据…' : '正在检查数据更新…'} />
          ),
        },
      ];
    } else if (initStatus === InitStatus.SUCCEEDED && updateStatus === UpdateStatus.SUCCEEDED) {
      return [];
    } else {
      return [
        {
          key: 'INIT_FAILED',
          onRender: () => <UpdateMessageBar inline />,
        },
      ];
    }
  }, [initStatus, updateStatus]);
};

const useColorSchemeItems = () => {
  const darkMode = useAppSelector(selectDarkMode);
  const dispatch = useAppDispatch();

  return useMemo<IContextualMenuItem[]>(
    () =>
      [
        { key: DarkMode.OFF, canCheck: true },
        { key: DarkMode.ON, canCheck: true },
        { key: 'DIVIDER', itemType: ContextualMenuItemType.Divider },
        { key: DarkMode.AUTO, canCheck: true },
      ].map((item) =>
        item.canCheck
          ? {
              ...item,
              text: constants.DARK_MODE_NAME[item.key],
              iconProps: { iconName: constants.DARK_MODE_ICON_NAME[item.key] },
              checked: darkMode === item.key,
              onClick: () => {
                dispatch(setDarkMode(item.key));
              },
            }
          : item
      ),
    [darkMode, dispatch]
  );
};

const NavDesktop: React.FC = () => {
  const termSelectItem = useTermSelectItem();
  const updateStatusItems = useUpdateStatusItems();
  const colorSchemeItems = useColorSchemeItems();
  const items = useMemo<ICommandBarItemProps[]>(
    () => [
      brandItem,
      termSelectItem,
      {
        key: 'UNDO',
        text: '撤销',
        split: true,
        iconProps: { iconName: 'Undo' },
        subMenuProps: {
          items: [],
        },
        disabled: true,
      },
      {
        key: 'REDO',
        text: '重做',
        split: true,
        iconProps: { iconName: 'Redo' },
        iconOnly: true,
        disabled: true,
      },
    ],
    [termSelectItem]
  );
  const farItems = useMemo<ICommandBarItemProps[]>(
    () => [
      ...updateStatusItems,
      {
        key: 'COLOR_SCHEME',
        text: '颜色主题',
        iconProps: { iconName: 'Color' },
        subMenuProps: {
          items: colorSchemeItems,
        },
      },
    ],
    [updateStatusItems, colorSchemeItems]
  );

  return <NavBase items={items} farItems={farItems} />;
};

export default NavDesktop;
