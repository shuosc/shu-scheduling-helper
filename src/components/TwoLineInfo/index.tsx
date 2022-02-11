import React, { useMemo } from 'react';
import { IStackStyles, IStackTokens, ITextStyles, Shimmer, Stack, Text, useTheme } from '@fluentui/react';

const stackStyles: Partial<IStackStyles> = { root: { display: 'inline-flex' } };
const outerTokens: IStackTokens = { childrenGap: '2px' };
const secondLineTokens: IStackTokens = { childrenGap: '0 8px' };

export interface TwoLineInfoProps {
  first?: string;
  secondItems?: (string | null | undefined)[];
  firstWidth?: number | string;
  firstAriaLabel?: string;
  secondAriaLabel?: string;
  secondWidth?: number | string;
  loading?: boolean;
}

const TwoLineInfo: React.FC<TwoLineInfoProps> = ({
  first,
  secondItems = [],
  loading = false,
  firstWidth,
  secondWidth,
}) => {
  const theme = useTheme();
  const secondStyles = useMemo<Partial<ITextStyles>>(
    () => ({
      root: {
        color: theme.palette.neutralTertiary,
      },
    }),
    [theme]
  );
  return (
    <Stack tokens={outerTokens} styles={stackStyles}>
      <Text block>{loading ? <Shimmer width={firstWidth} /> : first || '-'}</Text>
      {loading ? (
        <Shimmer width={secondWidth} />
      ) : (
        <Stack horizontal wrap tokens={secondLineTokens}>
          {secondItems
            .filter((second) => second)
            .map((second, index) => (
              <Text variant="smallPlus" styles={secondStyles} key={index}>
                {second}
              </Text>
            ))}
        </Stack>
      )}
    </Stack>
  );
};

export default TwoLineInfo;
