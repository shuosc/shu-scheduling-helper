import React from 'react';
import { ColumnActionsMode, IColumn } from '@fluentui/react';
import { CourseListItem } from '../../app/types';
import NumberCapacity from '../../components/NumberCapacity';
import TwoLineInfo from '../../components/TwoLineInfo';
import MoreOptionsButton from './MoreOptionsButton';
import ResultTableBase from './ResultTable.base';
import ToggleStarButton from './ToggleStarButton';

const columns: IColumn[] = [
  {
    key: 'STAR',
    name: '星标',
    columnActionsMode: ColumnActionsMode.disabled,
    minWidth: 32,
    maxWidth: 32,
    styles: { cellTitle: { justifyContent: 'center' } },
    onRender: (item: CourseListItem) => <ToggleStarButton loading={!item.loaded} courseKey={item} iconOnly />,
  },
  {
    key: 'NUMBER_CAPACITY',
    name: '人数',
    columnActionsMode: ColumnActionsMode.disabled,
    minWidth: 50,
    maxWidth: 50,
    styles: { cellTitle: { justifyContent: 'center' } },
    onRender: (item: CourseListItem) => (
      <NumberCapacity loading={!item.loaded} number={item.course?.number} capacity={item.course?.capacity} />
    ),
  },
  {
    key: 'COURSE_INFO',
    name: '课程',
    columnActionsMode: ColumnActionsMode.disabled,
    minWidth: 80,
    maxWidth: 260,
    isMultiline: true,
    onRender: (item: CourseListItem) => (
      <TwoLineInfo
        loading={!item.loaded}
        first={item.course?.courseName}
        secondItems={[item.course?.courseId, item.course?.credit ? `${item.course?.credit}学分` : undefined]}
        firstWidth="64px"
        secondWidth="48px"
      />
    ),
  },
  {
    key: 'TEACHER_INFO',
    name: '教师',
    columnActionsMode: ColumnActionsMode.disabled,
    minWidth: 80,
    maxWidth: 160,
    isMultiline: true,
    flexGrow: 1,
    onRender: (item: CourseListItem) => (
      <TwoLineInfo
        loading={!item.loaded}
        first={item.course?.teacherName}
        secondItems={[item.course?.teacherId, item.course?.teacherTitle]}
        firstWidth="48px"
        secondWidth="24px"
      />
    ),
  },
  {
    key: 'CLASS_TIME',
    name: '上课时间',
    columnActionsMode: ColumnActionsMode.disabled,
    minWidth: 140,
    maxWidth: 180,
    isMultiline: true,
    flexGrow: 1,
    onRender: (item: CourseListItem) => (
      <TwoLineInfo
        loading={!item.loaded}
        first={item.course?.classTime}
        secondItems={item.course?.limitations}
        firstWidth="48px"
        secondWidth="18px"
        tag
      />
    ),
  },
  {
    key: 'POSITION',
    name: '地点',
    columnActionsMode: ColumnActionsMode.disabled,
    minWidth: 60,
    maxWidth: 100,
    isMultiline: true,
    flexGrow: 1,
    onRender: (item: CourseListItem) => (
      <TwoLineInfo
        loading={!item.loaded}
        first={item.course?.campus}
        secondItems={[item.course?.position]}
        firstWidth="28px"
        secondWidth="24px"
      />
    ),
  },
  {
    key: 'ACTIONS',
    name: '操作',
    columnActionsMode: ColumnActionsMode.disabled,
    minWidth: 52,
    maxWidth: 52,
    onRender: (item: CourseListItem) => (
      <MoreOptionsButton loading={!item.loaded} courseKey={item} courseName={item.course?.courseName} iconOnly />
    ),
  },
];

const ResultTableDesktop: React.FC = () => {
  return <ResultTableBase columns={columns} />;
};

export default ResultTableDesktop;
