import React, { useMemo } from 'react';
import { Checkbox, FocusZone, mergeStyles } from '@fluentui/react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { addCourseSelection, removeCourseSelection, selectCourseSelection } from '../../app/store';
import { ExtendedCourseKey } from '../../app/types';
import { getCourseKeyStr } from '../../utils';

const wrapperClassName = mergeStyles({ padding: '6px 3px' });

export interface RowCheckboxProps {
  item: ExtendedCourseKey;
}

const RowCheckbox: React.FC<RowCheckboxProps> = ({ item }) => {
  const courseSelection = useAppSelector(selectCourseSelection);
  const dispatch = useAppDispatch();

  const key = useMemo(() => getCourseKeyStr(item), [item]);

  return (
    <FocusZone disabled className={wrapperClassName}>
      <Checkbox
        checked={courseSelection?.[key] || false}
        onChange={() => {
          if (!courseSelection?.[key]) {
            dispatch(addCourseSelection([key]));
          } else {
            dispatch(removeCourseSelection([key]));
          }
        }}
      />
    </FocusZone>
  );
};

export default RowCheckbox;
