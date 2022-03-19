import React from 'react';
import { ColumnActionsMode, IColumn } from '@fluentui/react';
import { CourseListItem } from '../../app/types';
import CourseCard from '../../components/CourseCard';
import ResultTableBase from './ResultTable.base';
import MoreOptionsButton from './MoreOptionsButton';
import ToggleStarButton from './ToggleStarButton';

const columns: IColumn[] = [
  {
    key: 'COURSE',
    name: '课程',
    columnActionsMode: ColumnActionsMode.disabled,
    minWidth: 200,
    isMultiline: true,
    onRender: (item: CourseListItem) => (
      <CourseCard loading={!item.loaded} course={item.course}>
        <ToggleStarButton loading={!item.loaded} courseKey={item} />
        <MoreOptionsButton loading={!item.loaded} courseKey={item} courseName={item.course?.courseName} />
      </CourseCard>
    ),
  },
];

const ResultTable: React.FC = () => {
  return <ResultTableBase columns={columns} />;
};

export default ResultTable;
