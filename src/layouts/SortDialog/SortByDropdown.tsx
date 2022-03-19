import React, { useCallback, useMemo } from 'react';
import {
  Dropdown,
  Icon,
  IDropdownOption,
  IIconStyles,
  IRenderFunction,
  IStackTokens,
  mergeStyles,
  ResponsiveMode,
  SelectableOptionMenuItemType,
  Stack,
  useTheme,
} from '@fluentui/react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { changeFilterConditions, selectFilterConditions } from '../../app/store';
import { SortByKey } from '../../app/enums';
import { SortBy } from '../../app/types';
import { isSortByMutex } from './utils';

const optionTokens: IStackTokens = { childrenGap: '8px' };

const dropdownOptions: IDropdownOption<SortBy | null>[] = [
  { key: 'DEFAULT', text: '默认：按课程号和教师号排序', data: null },
  ...[
    { key: SortByKey.CREDITS, text: '学分数' },
    { key: SortByKey.NUMBER, text: '选课人数' },
    { key: SortByKey.CAPACITY, text: '课程总容量' },
    { key: SortByKey.REMAINING_CAPACITY, text: '剩余课程容量' },
  ]
    .map<IDropdownOption<SortBy | null>[]>(({ key, text }) => [
      { key: `${key}_DIVIDER`, text: '-', itemType: SelectableOptionMenuItemType.Divider },
      { key: `${key}_ASC`, text, data: { key, descending: false } },
      { key: `${key}_DESC`, text, data: { key, descending: true } },
    ])
    .reduce((acc, cur) => {
      acc.push(...cur);
      return acc;
    }, []),
];

interface OptionProps {
  option: IDropdownOption;
}

const Option: React.FC<OptionProps> = ({ option }) => {
  const theme = useTheme();

  const iconStyles: Partial<IIconStyles> = useMemo(
    () => ({
      root: {
        fontSize: '16px',
        color: option.disabled ? theme.semanticColors.disabledText : theme.palette.themePrimary,
      },
    }),
    [theme, option.disabled]
  );
  const descriptionClassName = useMemo(
    () =>
      mergeStyles({
        color: theme.palette.neutralTertiary,
      }),
    [theme]
  );

  return (
    <Stack horizontal verticalAlign="center" tokens={optionTokens}>
      <Icon iconName={option.data.descending ? 'Descending' : 'Ascending'} styles={iconStyles} />
      <Stack.Item>
        {option.text}
        <span className={descriptionClassName}>（{option.data.descending ? '降序' : '升序'}）</span>
      </Stack.Item>
    </Stack>
  );
};

const onRenderOption: IRenderFunction<IDropdownOption<SortBy | null>> = (option, defaultRender) => {
  return option?.data ? <Option option={option} /> : defaultRender?.(option) || null;
};

const onRenderTitle: IRenderFunction<IDropdownOption<SortBy | null>[]> = (options, defaultRender) => {
  return options?.[0]?.data ? <Option option={options[0]} /> : defaultRender?.(options) || null;
};

export interface SortByDropdownProps {
  num: number;
}

const SortByDropdown: React.FC<SortByDropdownProps> = ({ num }) => {
  const { sortBy } = useAppSelector(selectFilterConditions);
  const dispatch = useAppDispatch();

  const filteredOptions = useMemo(
    () =>
      dropdownOptions
        .filter((option) => !sortBy.slice(0, num - 1).some((item) => (option.key as string).startsWith(item.key)))
        .map((option) =>
          option.data
            ? {
                ...option,
                disabled: isSortByMutex(sortBy.slice(0, num - 1), option.data),
              }
            : option
        ),
    [num, sortBy]
  );
  const selectedKey = useMemo(() => {
    if (sortBy.length === num - 1) {
      return 'DEFAULT';
    } else if (sortBy.length < num - 1) {
      return null;
    } else {
      return `${sortBy[num - 1].key}_${sortBy[num - 1].descending ? 'DESC' : 'ASC'}`;
    }
  }, [num, sortBy]);

  const onChange = useCallback(
    (_, option?: IDropdownOption<SortBy | null>) => {
      dispatch(
        changeFilterConditions({
          sortBy: [...sortBy.slice(0, num - 1), ...(option?.data ? [option.data] : [])],
        })
      );
    },
    [dispatch, num, sortBy]
  );

  return (
    <Dropdown
      options={filteredOptions}
      disabled={sortBy.length < num - 1}
      label={`排序依据 ${num}：`}
      placeholder="---"
      selectedKey={selectedKey}
      responsiveMode={ResponsiveMode.large}
      onChange={onChange}
      onRenderOption={onRenderOption}
      onRenderTitle={onRenderTitle}
    />
  );
};

export default SortByDropdown;
