import React, { useMemo } from 'react';
import { IStackItemStyles, IStackItemTokens, IStackTokens, Stack, useTheme } from '@fluentui/react';

const stackTokens: IStackTokens = { childrenGap: '8px' };
const stackItemTokens: IStackItemTokens = { padding: '12px' };

const MyCourses: React.FC = () => {
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
        <div>我的课程</div>
      </Stack.Item>
    </Stack>
  );
};

export default MyCourses;
