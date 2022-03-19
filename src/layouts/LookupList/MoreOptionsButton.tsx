import React, { useMemo } from 'react';
import {
  ActionButton,
  ContextualMenuItemType,
  IconButton,
  IContextualMenuProps,
  IIconProps,
  TooltipHost,
} from '@fluentui/react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { addCourseSelection, selectCourseKeys, selectCourseSelection } from '../../app/store';
import { ExtendedCourseKey } from '../../app/types';
import { getCourseKeyStr } from '../../utils';

const settingsIconProps: IIconProps = { iconName: 'Settings' };

export interface MoreOptionsButtonProps {
  courseKey: ExtendedCourseKey;
  loading?: boolean;
  courseName?: string;
  iconOnly?: boolean;
}

const MoreOptionsButton: React.FC<MoreOptionsButtonProps> = ({
  courseKey,
  loading = false,
  courseName,
  iconOnly = false,
}) => {
  const courseKeys = useAppSelector(selectCourseKeys);
  const courseSelection = useAppSelector(selectCourseSelection);
  const dispatch = useAppDispatch();
  const keysWithSameCourseId = useMemo(
    () =>
      courseKeys
        .filter((item) => item.courseId === courseKey.courseId && item.termId === courseKey.termId)
        .map((item) => getCourseKeyStr(item)),
    [courseKeys, courseKey]
  );
  const allSelected = useMemo(
    () => keysWithSameCourseId.every((key) => courseSelection?.[key]),
    [keysWithSameCourseId, courseSelection]
  );
  const menuProps = useMemo<IContextualMenuProps>(
    () => ({
      items: [
        {
          key: 'SELECT',
          text: '星标并选择此课程',
        },
        {
          key: 'DIVIDER',
          itemType: ContextualMenuItemType.Divider,
        },
        {
          key: 'ADD_MORE',
          iconProps: { iconName: 'MultiSelect' },
          disabled: allSelected,
          onClick: () => {
            dispatch(addCourseSelection(keysWithSameCourseId));
          },
          onRenderContent: (props, defaultRenders) => {
            return (
              <>
                {defaultRenders.renderCheckMarkIcon(props)}
                {defaultRenders.renderItemIcon(props)}
                <span className={props.classNames.label}>
                  选中当前检索条件下的所有 <b>{courseName || '-'}</b>{' '}
                  <small>&times; {keysWithSameCourseId.length}</small>
                </span>
                {defaultRenders.renderSecondaryText(props)}
                {defaultRenders.renderSubMenuIcon(props)}
              </>
            );
          },
        },
      ],
    }),
    [courseName, keysWithSameCourseId, allSelected, dispatch]
  );
  return iconOnly ? (
    <TooltipHost content="选项">
      <IconButton iconProps={settingsIconProps} menuProps={menuProps} disabled={loading} />
    </TooltipHost>
  ) : (
    <ActionButton text="选项" iconProps={settingsIconProps} menuProps={menuProps} disabled={loading} />
  );
};

export default MoreOptionsButton;
