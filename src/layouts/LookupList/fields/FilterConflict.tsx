import React from 'react';
import { IToggleStyles, Toggle } from '@fluentui/react';

const toggleStyles: Partial<IToggleStyles> = {
  root: {
    margin: '0',
  },
  container: {
    alignItems: 'center',
    marginTop: '5px',
  },
};

const FilterConflict: React.FC = () => {
  return (
    <div>
      <Toggle label="筛除时间冲突课程：" onText="是" offText="否" styles={toggleStyles} />
    </div>
  );
};

export default FilterConflict;
