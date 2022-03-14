import React, { useMemo } from 'react';
import { ICommandBarItemProps } from '@fluentui/react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectCourseSelection, setCourseSelection } from '../../app/store';
import MultipleSelectActions from './MultipleSelectActions';
import ToolbarBase from './Toolbar.base';
import { useWrapperClassNames } from './Toolbar.common';

const ToolbarDesktop: React.FC = () => {
  const courseSelection = useAppSelector(selectCourseSelection);
  const wrapperClassNames = useWrapperClassNames(true);
  const dispatch = useAppDispatch();

  const items = useMemo<ICommandBarItemProps[]>(
    () => [
      courseSelection
        ? {
            key: 'MULTIPLE_SELECTION',
            onRender: () => <MultipleSelectActions />,
          }
        : {
            key: 'MULTIPLE_SELECTION',
            text: '多选',
            iconProps: { iconName: 'MultiSelect' },
            onClick: () => {
              dispatch(setCourseSelection({}));
            },
          },
    ],
    [courseSelection, dispatch]
  );

  return (
    <>
      <div className={wrapperClassNames.content}>
        <ToolbarBase items={items} />
      </div>
      <div className={wrapperClassNames.border} />
      <div className={wrapperClassNames.mask} />
    </>
  );
};

export default ToolbarDesktop;
