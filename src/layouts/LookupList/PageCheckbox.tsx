import React, { useMemo } from 'react';
import { Checkbox, ICheckboxStyles, mergeStyles } from '@fluentui/react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { addCourseSelection, removeCourseSelection, selectCourseItems, selectCourseSelection } from '../../app/store';
import { getCourseKeyStr } from '../../utils';

const wrapperClassName = mergeStyles({ padding: '11px 3px' });
const checkboxStyles: Partial<ICheckboxStyles> = { checkbox: { margin: '0' } };

const PageCheckbox: React.FC = () => {
  const courseSelection = useAppSelector(selectCourseSelection);
  const courseItems = useAppSelector(selectCourseItems);
  const dispatch = useAppDispatch();

  const keys = useMemo(() => courseItems.map((item) => getCourseKeyStr(item)), [courseItems]);
  const numSelected = useMemo(
    () => (courseSelection ? keys.filter((key) => courseSelection[key]).length : 0),
    [keys, courseSelection]
  );
  const checked = useMemo(() => numSelected > 0 && numSelected === courseItems.length, [courseItems, numSelected]);
  const disabled = useMemo(() => courseItems.length === 0, [courseItems]);
  const indeterminate = useMemo(() => !checked && numSelected > 0, [checked, numSelected]);

  return (
    <div className={wrapperClassName}>
      <Checkbox
        checked={checked}
        indeterminate={indeterminate}
        disabled={disabled}
        styles={checkboxStyles}
        onChange={() => {
          if (!checked) {
            dispatch(addCourseSelection(keys));
          } else {
            dispatch(removeCourseSelection(keys));
          }
        }}
      />
    </div>
  );
};

export default PageCheckbox;
