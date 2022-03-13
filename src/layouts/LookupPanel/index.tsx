import React, { useMemo } from 'react';
import { IStackItemStyles, IStackItemTokens, IStackTokens, mergeStyles, Stack, useTheme } from '@fluentui/react';
import constants from '../../app/constants';
import { useAppSelector } from '../../app/hooks';
import { selectCourseTotal } from '../../app/store';
import ResultTable from './ResultTable';
import ResultTableDesktop from './ResultTable.desktop';
import Toolbar from './Toolbar';
import ToolbarDesktop from './Toolbar.desktop';
import SearchAndFilters from './SearchAndFilters';
import DataDescription from './DataDescription';

const stackTokens: IStackTokens = { childrenGap: '8px' };
const stackItemTokens: IStackItemTokens = { padding: '12px' };
const noResultStackItemTokens: IStackItemTokens = { padding: '60px 12px' };
const resultTableWrapperClassName = mergeStyles({
  display: 'block',
  [constants.MEDIA_WIDE_DESKTOP_SCREEN]: {
    display: 'none',
  },
});
const desktopResultTableWrapperClassName = mergeStyles({
  display: 'none',
  [constants.MEDIA_WIDE_DESKTOP_SCREEN]: {
    display: 'block',
  },
});

const LookupPanel: React.FC = () => {
  const theme = useTheme();
  const stackItemStyles = useMemo<Partial<IStackItemStyles>>(
    () => ({
      root: {
        background: theme.palette.white,
      },
    }),
    [theme]
  );
  const noResultStackItemStyles = useMemo<Partial<IStackItemStyles>>(
    () => ({
      root: {
        background: theme.palette.white,
        color: theme.palette.neutralTertiary,
        textAlign: 'center',
      },
    }),
    [theme]
  );

  const courseTotal = useAppSelector(selectCourseTotal);

  return (
    <Stack tokens={stackTokens}>
      <Stack.Item tokens={stackItemTokens} styles={stackItemStyles}>
        <SearchAndFilters />
      </Stack.Item>
      {courseTotal > 0 ? (
        <Stack.Item tokens={stackItemTokens} styles={stackItemStyles}>
          <div className={resultTableWrapperClassName}>
            <Toolbar />
            <ResultTable />
            <Toolbar />
          </div>
          <div className={desktopResultTableWrapperClassName}>
            <ToolbarDesktop />
            <ResultTableDesktop />
            <ToolbarDesktop />
          </div>
        </Stack.Item>
      ) : (
        <Stack.Item tokens={noResultStackItemTokens} styles={noResultStackItemStyles}>
          没有匹配的记录
        </Stack.Item>
      )}
      <Stack.Item tokens={stackItemTokens} styles={stackItemStyles}>
        <DataDescription />
      </Stack.Item>
    </Stack>
  );
};

export default LookupPanel;