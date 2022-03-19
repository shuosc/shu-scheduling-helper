import React, { useCallback, useMemo } from 'react';
import { ISpinButtonStyles, mergeStyles, Position, SpinButton } from '@fluentui/react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { changeFilterConditions, selectFilterConditions } from '../../../app/store';

const wrapperClassName = mergeStyles({ width: '100px' });
const styles: Partial<ISpinButtonStyles> = { labelWrapper: { marginBottom: '0' } };

const regExp = /^([1-9][0-9]{0,3}|不限)$/;
const regExpNum = /^[1-9][0-9]{0,3}$/;

const onValidate = (value: string) => {
  value = value.trim();
  if (regExp.test(value)) {
    return value;
  } else if (value === '0' || value === '') {
    return '不限';
  }
};
const onIncrement = (value: string) => {
  if (value === '9999') {
    return '9999';
  } else if (value !== '不限') {
    return (parseInt(value, 10) + 1).toString();
  } else {
    return '1';
  }
};
const onDecrement = (value: string) => {
  if (value === '1' || value === '不限') {
    return '不限';
  } else if (value !== '不限') {
    return (parseInt(value, 10) - 1).toString();
  }
};

const FilterRemainingCapacity: React.FC = () => {
  const filterConditions = useAppSelector(selectFilterConditions);
  const dispatch = useAppDispatch();

  const value = useMemo(
    () => (filterConditions.remainingCapacity > 0 ? filterConditions.remainingCapacity.toString() : '不限'),
    [filterConditions.remainingCapacity]
  );
  const onChange = useCallback(
    (_, newValue?: string) => {
      dispatch(
        changeFilterConditions({
          remainingCapacity: newValue && regExpNum.test(newValue) ? parseInt(newValue, 10) : 0,
        })
      );
    },
    [dispatch]
  );

  return (
    <div className={wrapperClassName}>
      <SpinButton
        value={value}
        label="容量至少剩余："
        labelPosition={Position.top}
        styles={styles}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
        onValidate={onValidate}
        onChange={onChange}
      />
    </div>
  );
};

export default FilterRemainingCapacity;
