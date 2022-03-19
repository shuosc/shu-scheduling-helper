import React, { useCallback, useMemo } from 'react';
import { ActionButton, IButtonStyles, IIconProps, Label, mergeStyles, useTheme } from '@fluentui/react';
import constants from '../../app/constants';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectFilterConditions, showModel } from '../../app/store';
import { LimitationFilterState } from '../../app/enums';
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

const SearchAndFilters: React.FC = () => {
  const { limitations, regExpMode, sortBy } = useAppSelector(selectFilterConditions);
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const buttonStyles = useMemo<Partial<IButtonStyles>>(
    () => ({
      root: {
        height: '32px',
      },
      labelChecked: {
        fontWeight: 'bold',
        color: theme.palette.themePrimary,
      },
      iconChecked: {
        color: theme.palette.themePrimary,
      },
    }),
    [theme]
  );
  const additionalFiltersChecked = useMemo(
    () => regExpMode || Object.values(limitations).some((item) => item !== LimitationFilterState.DEFAULT),
    [limitations, regExpMode]
  );

  const onClickAdditionalFilter = useCallback(() => {
    dispatch(showModel('additionalFilterDialog'));
  }, [dispatch]);
  const onClickSort = useCallback(() => {
    dispatch(showModel('sortDialog'));
  }, [dispatch]);

  return (
    <div className={outerClassName}>
      <div className={innerClassName}>
        <SearchField fieldName="courseId" label="课程号：" width="160px" />
        <SearchField fieldName="courseName" label="课程名称：" width="220px" />
        <SearchField fieldName="credit" label="学分数：" width="120px" />
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
            <ActionButton
              text="其他筛选设置..."
              iconProps={filterIconProps}
              styles={buttonStyles}
              onClick={onClickAdditionalFilter}
              checked={additionalFiltersChecked}
            />
            <ActionButton
              text="排序..."
              iconProps={sortIconProps}
              styles={buttonStyles}
              onClick={onClickSort}
              checked={sortBy.length > 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilters;
