import React from 'react';
import { IStackTokens, ITextStyles, mergeStyles, Stack, Text } from '@fluentui/react';
import logo from '../../assets/logo.png';

const logoClassName = mergeStyles({ width: '28px', height: '28px', userSelect: 'none', pointerEvents: 'none' });
const titleStyles: Partial<ITextStyles> = { root: { lineHeight: '1', letterSpacing: '1px' } };
const stackTokens: IStackTokens = { childrenGap: '8px' };

const Brand: React.FC = () => {
  return (
    <Stack horizontal verticalAlign="center" tokens={stackTokens}>
      <img className={logoClassName} src={logo} alt="SHU排课助手" aria-hidden />
      <Text variant="mediumPlus" styles={titleStyles}>
        SHU排课助手
      </Text>
    </Stack>
  );
};

export default Brand;
