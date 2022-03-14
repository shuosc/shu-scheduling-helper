import { useMemo } from 'react';
import { mergeStyleSets, useTheme } from '@fluentui/react';

export const useWrapperClassNames = (desktop: boolean, courseSelection?: Record<string, true> | null) => {
  const theme = useTheme();

  return useMemo(
    () =>
      mergeStyleSets({
        content: {
          position: 'sticky',
          top: desktop ? '-8px' : '45px',
          zIndex: '2',
          background: theme.palette.white,
          padding: !desktop && courseSelection ? '0 0 6px' : undefined,
        },
        border: {
          position: 'sticky',
          top: desktop ? '36px' : courseSelection ? '127px' : '89px',
          zIndex: '1',
          borderBottom: `1px solid ${theme.palette.neutralLighter}`,
          margin: '0 -12px -1px',
        },
        mask: {
          position: 'sticky',
          top: desktop ? '35px' : courseSelection ? '126px' : '88px',
          zIndex: '1',
          margin: '0 -12px',
          borderBottom: `1px solid ${theme.palette.white}`,
          pointerEvents: 'none',
        },
      }),
    [courseSelection, desktop, theme]
  );
};
