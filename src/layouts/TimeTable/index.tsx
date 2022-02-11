import React, { useMemo } from 'react';
import { IStackItemStyles, IStackItemTokens, IStackTokens, Stack, useTheme } from '@fluentui/react';

const stackTokens: IStackTokens = { childrenGap: '8px' };
const stackItemTokens: IStackItemTokens = { padding: '12px' };

const TimeTable: React.FC = () => {
  const theme = useTheme();
  const stackItemStyles = useMemo<Partial<IStackItemStyles>>(
    () => ({
      root: {
        background: theme.palette.white,
      },
    }),
    [theme]
  );
  return (
    <Stack tokens={stackTokens}>
      <Stack.Item tokens={stackItemTokens} styles={stackItemStyles}>
        {Array.from({ length: 40 }).map((_, index) => (
          <div key={index}>课表 {index + 1}</div>
        ))}
      </Stack.Item>
    </Stack>
  );
};

export default TimeTable;
