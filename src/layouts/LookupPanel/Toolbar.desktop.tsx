import React, { useMemo } from 'react';
import { ICommandBarItemProps } from '@fluentui/react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectCourseSelection, setCourseSelection } from '../../app/store';
import MultipleSelectActions from './MultipleSelectActions';
import ToolbarBase from './Toolbar.base';

const ToolbarDesktop: React.FC = () => {
  const courseSelection = useAppSelector(selectCourseSelection);
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

  return <ToolbarBase items={items} />;
};

export default ToolbarDesktop;
