import React, { useMemo } from 'react';
import { CommandBar, ContextualMenuItemType, ICommandBarItemProps, ICommandBarStyles } from '@fluentui/react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { loadCourseDetails, selectCourseMaxPage, selectCoursePage, showModel } from '../../app/store';

const commandBarStyles: Partial<ICommandBarStyles> = { root: { padding: '0' } };

const onReduceData = () => void 0;

export interface ToolbarBaseProps {
  items: ICommandBarItemProps[];
}

const ToolbarBase: React.FC<ToolbarBaseProps> = ({ items }) => {
  const coursePage = useAppSelector(selectCoursePage);
  const courseMaxPage = useAppSelector(selectCourseMaxPage);
  const dispatch = useAppDispatch();

  const farItems = useMemo<ICommandBarItemProps[]>(
    () => [
      {
        key: 'PAGE_COUNT',
        text: `${coursePage} / ${courseMaxPage} 页`,
        subMenuProps:
          courseMaxPage > 1
            ? {
                items: [
                  {
                    key: 'FIRST_PAGE',
                    text: '第 1 页',
                    iconProps: { iconName: 'PageLeft' },
                    disabled: coursePage <= 1,
                    onClick: () => {
                      dispatch(loadCourseDetails({ offset: 0, limit: 10 }));
                    },
                  },
                  {
                    key: 'LAST_PAGE',
                    text: `第 ${courseMaxPage} 页`,
                    iconProps: { iconName: 'PageRight' },
                    disabled: coursePage >= courseMaxPage,
                    onClick: () => {
                      dispatch(loadCourseDetails({ offset: courseMaxPage * 10 - 10, limit: 10 }));
                    },
                  },
                  {
                    key: 'DIVIDER',
                    itemType: ContextualMenuItemType.Divider,
                  },
                  {
                    key: 'JUMP_TO',
                    text: '跳转到页码...',
                    iconProps: { iconName: 'NumberField' },
                    disabled: courseMaxPage === 1,
                    onClick: () => {
                      dispatch(showModel('jumpToDialog'));
                    },
                  },
                ],
              }
            : undefined,
      },
      {
        key: 'PREVIOUS_PAGE',
        text: '上一页',
        iconProps: { iconName: 'Back' },
        iconOnly: true,
        disabled: coursePage <= 1,
        onClick: () => {
          dispatch(loadCourseDetails({ offset: coursePage * 10 - 20, limit: 10 }));
        },
      },
      {
        key: 'NEXT_PAGE',
        text: '下一页',
        iconProps: { iconName: 'Forward' },
        iconOnly: true,
        disabled: coursePage >= courseMaxPage,
        onClick: () => {
          dispatch(loadCourseDetails({ offset: coursePage * 10, limit: 10 }));
        },
      },
    ],
    [courseMaxPage, coursePage, dispatch]
  );

  return <CommandBar items={items} farItems={farItems} styles={commandBarStyles} onReduceData={onReduceData} />;
};

export default ToolbarBase;
