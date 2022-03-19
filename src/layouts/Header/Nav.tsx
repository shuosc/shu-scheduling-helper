import React, { useMemo } from 'react';
import { ICommandBarItemProps, ICommandBarStyles } from '@fluentui/react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectInitStatus, selectTabKey, setTabKey, showModel } from '../../app/store';
import { InitStatus, TabKey } from '../../app/enums';
import NavBase from './Nav.base';
import SpinnerItem from './SpinnerItem';

const commandBarStyles: Partial<ICommandBarStyles> = { root: { padding: '0 14px' } };

const Nav: React.FC = () => {
  const tabKey = useAppSelector(selectTabKey);
  const initStatus = useAppSelector(selectInitStatus);
  const dispatch = useAppDispatch();

  const items = useMemo<ICommandBarItemProps[]>(
    () => [
      {
        key: TabKey.TIME_TABLE,
        text: '课表',
        iconProps: { iconName: 'Table' },
        canCheck: true,
        checked: tabKey === TabKey.TIME_TABLE,
        onClick: () => {
          dispatch(setTabKey(TabKey.TIME_TABLE));
        },
      },
      {
        key: TabKey.MY_COURSES,
        text: '我的课程',
        iconProps: { iconName: 'GroupedList' },
        canCheck: true,
        checked: tabKey === TabKey.MY_COURSES,
        onClick: () => {
          dispatch(setTabKey(TabKey.MY_COURSES));
        },
      },
      {
        key: TabKey.LOOKUP_LIST,
        text: '检索',
        iconProps: { iconName: 'SearchAndApps' },
        canCheck: true,
        checked: tabKey === TabKey.LOOKUP_LIST,
        onClick: () => {
          dispatch(setTabKey(TabKey.LOOKUP_LIST));
        },
      },
    ],
    [tabKey, dispatch]
  );
  const farItems = useMemo<ICommandBarItemProps[]>(
    () => [
      ...(initStatus === InitStatus.LOADING
        ? [
            {
              key: 'INIT_LOADING',
              onRender: () => <SpinnerItem />,
            },
          ]
        : []),
      {
        key: 'OPTIONS',
        iconProps: { iconName: 'GlobalNavButton' },
        ariaLabel: '选项',
        iconOnly: true,
        onClick: () => {
          dispatch(showModel('optionsPanel'));
        },
      },
    ],
    [initStatus, dispatch]
  );

  return <NavBase items={items} farItems={farItems} styles={commandBarStyles} />;
};

export default Nav;
