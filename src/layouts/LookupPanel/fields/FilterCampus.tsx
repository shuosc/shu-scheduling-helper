import React, { useCallback, useMemo } from 'react';
import { Dropdown, DropdownMenuItemType, IDropdownOption, ResponsiveMode } from '@fluentui/react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { changeFilterConditions, selectFilterConditions } from '../../../app/store';

const options: IDropdownOption[] = [
  {
    key: 'ALL',
    text: '全部',
  },
  {
    key: 'DIVIDER',
    text: '-',
    itemType: DropdownMenuItemType.Divider,
  },
  ...['宝山', '延长', '嘉定'].map((campus) => ({
    key: campus,
    text: campus,
  })),
];

const FilterCampus: React.FC = () => {
  const filterConditions = useAppSelector(selectFilterConditions);
  const dispatch = useAppDispatch();

  const selectedKey = useMemo(() => filterConditions.campus || 'ALL', [filterConditions.campus]);
  const onChange = useCallback(
    (_, option?: IDropdownOption, index?: number) => {
      if (option && index != null) {
        dispatch(
          changeFilterConditions({
            campus: index >= 2 ? (option.key as string) : null,
          })
        );
      }
    },
    [dispatch]
  );

  return (
    <div>
      <Dropdown
        selectedKey={selectedKey}
        options={options}
        label="校区："
        responsiveMode={ResponsiveMode.large}
        onChange={onChange}
      />
    </div>
  );
};

export default FilterCampus;
