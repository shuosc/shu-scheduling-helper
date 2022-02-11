import React from 'react';
import { ActionButton, IButtonStyles, IIconProps, Label, mergeStyles } from '@fluentui/react';
import constants from '../../app/constants';
import SearchField from './fields/SearchField';
import FilterCampus from './fields/FilterCampus';
import FilterConflict from './fields/FilterConflict';
import FilterRemainingCapacity from './fields/FilterRemainingCapacity';
import FilterStar from './fields/FilterStar';

const filterIconProps: IIconProps = { iconName: 'FilterSettings' };
const sortIconProps: IIconProps = { iconName: 'SortLines' };
const outerClassName = mergeStyles({
  padding: '4px',
  [constants.MEDIA_DESKTOP_SCREEN]: {
    padding: '0 8px 8px',
  },
});
const innerClassName = mergeStyles({
  display: 'flex',
  flexFlow: 'row wrap',
  margin: '-4px -8px',
  '> *': {
    margin: '4px 8px',
  },
});
const buttonContainerClassName = mergeStyles({ margin: '0 -9px' });
const buttonStyles: Partial<IButtonStyles> = {
  root: {
    height: '32px',
  },
};

const SearchAndFilters: React.FC = () => {
  return (
    <div className={outerClassName}>
      <div className={innerClassName}>
        <SearchField fieldName="courseId" label="课程号：" width="140px" />
        <SearchField fieldName="courseName" label="课程名称：" width="220px" />
        <SearchField fieldName="credit" label="学分数：" width="100px" />
        <SearchField fieldName="teacherId" label="教师号：" width="140px" />
        <SearchField fieldName="teacherName" label="教师姓名：" width="160px" />
        <SearchField fieldName="classTime" label="上课时间：" width="180px" />
        <FilterCampus />
        <FilterConflict />
        <FilterRemainingCapacity />
        <FilterStar />
        <div>
          <Label>更多选项：</Label>
          <div className={buttonContainerClassName}>
            <ActionButton text="其他筛选设置..." iconProps={filterIconProps} styles={buttonStyles} />
            <ActionButton text="排序..." iconProps={sortIconProps} styles={buttonStyles} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilters;
