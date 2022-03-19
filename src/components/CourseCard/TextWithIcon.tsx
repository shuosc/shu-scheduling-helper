import React, { useMemo } from 'react';
import { Icon, IIconStyles, IStackTokens, Shimmer, Stack, Text, useTheme } from '@fluentui/react';

const stackTokens: IStackTokens = { childrenGap: '4px' };

export interface TextWithIconProps {
  text?: string;
  iconName: string;
  ariaLabel?: string;
  loading?: boolean;
}

const TextWithIcon: React.FC<TextWithIconProps> = ({ text, iconName, ariaLabel, loading = false }) => {
  const theme = useTheme();

  const iconStyles = useMemo<Partial<IIconStyles>>(
    () => ({
      root: {
        color: theme.palette.neutralSecondary,
      },
    }),
    [theme]
  );

  return (
    <Stack horizontal verticalAlign="center" tokens={stackTokens}>
      <Icon iconName={iconName} ariaLabel={ariaLabel} styles={iconStyles} />
      {loading ? <Shimmer width="24px" /> : <Text>{text || '-'}</Text>}
    </Stack>
  );
};

export default TextWithIcon;
