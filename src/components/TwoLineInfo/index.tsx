import React, { useMemo } from 'react';
import { IStackTokens, ITextStyles, Shimmer, Stack, Text, useTheme } from '@fluentui/react';
import Tag from '../Tag';

const outerTokens: IStackTokens = { childrenGap: '2px' };
const secondLineTokens: IStackTokens = { childrenGap: '0 8px' };
const secondLineTagsTokens: IStackTokens = { childrenGap: '4px' };

export interface TwoLineInfoProps {
  first?: string;
  secondItems?: (string | null | undefined)[];
  firstWidth?: number | string;
  firstAriaLabel?: string;
  secondAriaLabel?: string;
  secondWidth?: number | string;
  loading?: boolean;
  tag?: boolean;
}

const TwoLineInfo: React.FC<TwoLineInfoProps> = ({
  first,
  secondItems = [],
  loading = false,
  firstWidth,
  secondWidth,
  tag = false,
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
    <Stack tokens={outerTokens}>
      <Text block>{loading ? <Shimmer width={firstWidth} /> : first || '-'}</Text>
      {loading ? (
        <Shimmer width={secondWidth} />
      ) : (
        <Stack horizontal wrap tokens={tag ? secondLineTagsTokens : secondLineTokens}>
          {secondItems
            .filter((second) => second)
            .map((second, index) =>
              tag ? (
                <Tag key={index} text={second as string} />
              ) : (
                <Text variant="smallPlus" styles={secondStyles} key={index}>
                  {second}
                </Text>
              )
            )}
        </Stack>
      )}
    </Stack>
  );
};

export default TwoLineInfo;
