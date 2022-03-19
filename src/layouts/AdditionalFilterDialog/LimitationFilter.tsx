import React, { useCallback } from 'react';
import { ChoiceGroup, IChoiceGroupOption, IChoiceGroupStyles, IStackTokens, Stack } from '@fluentui/react';
import constants from '../../app/constants';
import { LimitationFilterState, SpecialLimitationType } from '../../app/enums';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { changeFilterConditions, selectFilterConditions } from '../../app/store';
import Tag from '../../components/Tag';

const stackTokens: IStackTokens = { childrenGap: '4px 16px' };
const styles: Partial<IChoiceGroupStyles> = {
  flexContainer: { display: 'flex', flexFlow: 'row wrap' },
};
const options: IChoiceGroupOption[] = [
  { key: LimitationFilterState.DEFAULT, text: '默认', styles: { root: { margin: '0' } } },
  { key: LimitationFilterState.EXCLUDED, text: '排除', styles: { root: { margin: '0 0 0 12px' } } },
  { key: LimitationFilterState.EXCLUSIVE, text: '仅保留', styles: { root: { margin: '0 0 0 12px' } } },
];

export interface LimitationFilterProps {
  type: SpecialLimitationType;
}

const LimitationFilter: React.FC<LimitationFilterProps> = ({ type }) => {
  const { limitations } = useAppSelector(selectFilterConditions);
  const dispatch = useAppDispatch();

  const onChange = useCallback(
    (_, option?: IChoiceGroupOption) => {
      if (option?.key) {
        dispatch(
          changeFilterConditions({
            limitations: {
              ...limitations,
              [type]: option.key,
            },
          })
        );
      }
    },
    [dispatch, limitations, type]
  );

  return (
    <Stack horizontal verticalAlign="center" wrap tokens={stackTokens}>
      <Tag text={constants.LIMITATION_VALUE[type]} />
      <Stack.Item>
        <ChoiceGroup options={options} styles={styles} selectedKey={limitations[type]} onChange={onChange} />
      </Stack.Item>
    </Stack>
  );
};

export default LimitationFilter;
