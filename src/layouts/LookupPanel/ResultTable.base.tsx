import React, { useCallback, useMemo } from 'react';
import { ColumnActionsMode, DetailsList, IColumn, IDetailsListStyles, SelectionMode } from '@fluentui/react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { addCourseSelection, removeCourseSelection, selectCourseItems, selectCourseSelection } from '../../app/store';
import { CourseListItem } from '../../app/types';
import { getCourseKeyStr } from '../../utils';
import PageCheckbox from './PageCheckbox';
import RowCheckbox from './RowCheckbox';

const listStyles: Partial<IDetailsListStyles> = { root: { marginBottom: '8px' }, headerWrapper: { marginTop: '-8px' } };
const selectionColumn: IColumn = {
  key: 'SELECTION',
  name: '',
  columnActionsMode: ColumnActionsMode.disabled,
  minWidth: 26,
  maxWidth: 26,
  onRender: (item: CourseListItem) => <RowCheckbox item={item} />,
  onRenderHeader: () => <PageCheckbox />,
};

export interface BaseResultTableProps {
  columns: IColumn[];
}

const ResultTableBase: React.FC<BaseResultTableProps> = ({ columns }) => {
  const courseListItems = useAppSelector(selectCourseItems);
  const courseSelection = useAppSelector(selectCourseSelection);
  const dispatch = useAppDispatch();

  const mergedColumns = useMemo<IColumn[]>(
    () => (courseSelection ? [selectionColumn, ...columns] : columns),
    [columns, courseSelection]
  );
  const onItemInvoked = useCallback(
    (item: CourseListItem) => {
      const key = getCourseKeyStr(item);
      if (!courseSelection?.[key]) {
        dispatch(addCourseSelection([key]));
      } else {
        dispatch(removeCourseSelection([key]));
      }
    },
    [dispatch, courseSelection]
  );

  return (
    <DetailsList
      items={courseListItems}
      columns={mergedColumns}
      styles={listStyles}
      getKey={getCourseKeyStr}
      selectionMode={SelectionMode.none}
      onItemInvoked={onItemInvoked}
    />
  );
};

export default ResultTableBase;
