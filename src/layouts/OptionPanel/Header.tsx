import React from 'react';
import { IStackStyles, IStackTokens, Stack, Text } from '@fluentui/react';
import Brand from '../../components/Brand';

const tokens: IStackTokens = { childrenGap: '18px', padding: '0 24px' };
const styles: Partial<IStackStyles> = { root: { flex: '1' } };

const Header: React.FC = () => {
  return (
    <Stack horizontal verticalAlign="center" tokens={tokens} styles={styles}>
      <Brand />
      <Text variant="smallPlus">选项</Text>
    </Stack>
  );
};

export default Header;
