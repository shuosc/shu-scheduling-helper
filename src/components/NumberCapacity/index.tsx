import React, { useMemo } from 'react';
import { IStackItemStyles, IStackStyles, mergeStyles, Shimmer, Stack, Text, useTheme } from '@fluentui/react';

const stackStyles: Partial<IStackStyles> = {
  root: { display: 'inline-flex', width: '50px', height: '37px', lineHeight: '12px' },
};
const stackItemStyles: Partial<IStackItemStyles> = {
  root: { minWidth: '30px', textAlign: 'center', padding: '3px' },
};

export interface NumberCapacityProps {
  number?: string;
  capacity?: string;
  loading?: boolean;
}

const NumberCapacity: React.FC<NumberCapacityProps> = ({ number, capacity, loading = false }) => {
  const theme = useTheme();
  const fractionBarClassName = useMemo(
    () =>
      mergeStyles({
        width: '20px',
        height: '0',
        borderTop: `1px solid ${theme.palette.neutralTertiary}`,
        transform: 'rotate(-45deg) scale(0.5)',
      }),
    [theme]
  );
  return (
    <Stack horizontalAlign="center" styles={stackStyles}>
      <Stack.Item align="start" styles={stackItemStyles}>
        {loading ? (
          <Shimmer width="18px" />
        ) : (
          <Text variant="smallPlus" block>
            {number || '-'}
          </Text>
        )}
      </Stack.Item>
      <span className={fractionBarClassName} />
      <Stack.Item align="end" styles={stackItemStyles}>
        {loading ? (
          <Shimmer width="18px" />
        ) : (
          <Text variant="smallPlus" block>
            {capacity || '-'}
          </Text>
        )}
      </Stack.Item>
    </Stack>
  );
};

export default NumberCapacity;
