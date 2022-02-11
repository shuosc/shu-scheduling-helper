import React, { useMemo } from 'react';
import { ICommandBarItemProps } from '@fluentui/react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectCourseSelection, setCourseSelection } from '../../app/store';
import MultipleSelectActions from './MultipleSelectActions';
import ToolbarBase from './Toolbar.base';

const Toolbar: React.FC = () => {
  const courseSelection = useAppSelector(selectCourseSelection);
  const dispatch = useAppDispatch();

  const items = useMemo<ICommandBarItemProps[]>(
    () => [
      {
        key: 'MULTIPLE_SELECTION',
        text: '多选',
        iconProps: { iconName: 'MultiSelect' },
        disabled: !!courseSelection,
        onClick: () => {
          dispatch(setCourseSelection({}));
        },
      },
    ],
    [courseSelection, dispatch]
  );

  return (
    <>
      <ToolbarBase items={items} />
      {courseSelection && <MultipleSelectActions />}
    </>
  );
};

export default Toolbar;
