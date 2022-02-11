import React from 'react';
import { ChoiceGroup, IChoiceGroupOption, IChoiceGroupStyles } from '@fluentui/react';

const styles: IChoiceGroupStyles = {
  flexContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
};
const options: IChoiceGroupOption[] = (
  [
    {
      key: 'ALL',
      text: '全部',
    },
    {
      key: 'NON_STARRED',
      text: '未星标',
    },
    {
      key: 'STARRED',
      text: '已星标',
    },
  ] as IChoiceGroupOption[]
).map((item) => ({
  ...item,
  styles: {
    root: {
      marginTop: '3px',
      '&:not(:first-child)': {
        marginLeft: '12px',
      },
    },
  },
}));

const FilterStar: React.FC = () => {
  return (
    <div>
      <ChoiceGroup options={options} label="显示设置：" defaultSelectedKey="ALL" styles={styles} />
    </div>
  );
};

export default FilterStar;
