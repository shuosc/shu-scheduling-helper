import React, { useMemo } from 'react';
import {
  IStackItemStyles,
  IStackItemTokens,
  IStackTokens,
  ITextStyles,
  mergeStyles,
  Stack,
  Text,
  useTheme,
} from '@fluentui/react';
import constants from '../../app/constants';
import { useAppSelector } from '../../app/hooks';
import { selectCourseObsoleted, selectCourseTimeSpent, selectCourseTotal } from '../../app/store';
import ResultTable from './ResultTable';
import ResultTableDesktop from './ResultTable.desktop';
import Toolbar from './Toolbar';
import ToolbarDesktop from './Toolbar.desktop';
import SearchAndFilters from './SearchAndFilters';
import DataDescription from './DataDescription';

const stackTokens: IStackTokens = { childrenGap: '8px' };
const stackItemTokens: IStackItemTokens = { padding: '12px' };
const tableFooterTokens: IStackTokens = { childrenGap: '0 4px', padding: '12px' };
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

const LookupList: React.FC = () => {
  const theme = useTheme();
  const courseTotal = useAppSelector(selectCourseTotal);
  const courseTimeSpent = useAppSelector(selectCourseTimeSpent);
  const courseObsoleted = useAppSelector(selectCourseObsoleted);

  const stackItemStyles = useMemo<Partial<IStackItemStyles>>(
    () => ({
      root: {
        background: theme.palette.white,
      },
    }),
    [theme]
  );
  const resultStackItemStyles = useMemo<Partial<IStackItemStyles>>(
    () => ({
      root: {
        background: theme.palette.white,
        '> *': {
          transition: 'opacity 0.15s',
          ...(courseObsoleted
            ? {
                opacity: '0.4',
                pointerEvent: 'none',
              }
            : undefined),
        },
      },
    }),
    [theme, courseObsoleted]
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
  const timeSpentTextStyles = useMemo<Partial<ITextStyles>>(
    () => ({
      root: {
        color: theme.palette.neutralTertiary,
      },
    }),
    [theme]
  );

  return (
    <Stack tokens={stackTokens}>
      <Stack.Item tokens={stackItemTokens} styles={stackItemStyles}>
        <SearchAndFilters />
      </Stack.Item>
      {courseTotal > 0 ? (
        <Stack.Item tokens={stackItemTokens} styles={resultStackItemStyles}>
          <div className={resultTableWrapperClassName}>
            <Toolbar />
            <ResultTable />
          </div>
          <div className={desktopResultTableWrapperClassName}>
            <ToolbarDesktop />
            <ResultTableDesktop />
          </div>
          <Stack horizontal verticalAlign="center" tokens={tableFooterTokens}>
            <Stack.Item>
              <Text>共 {courseTotal} 条记录</Text>
            </Stack.Item>
            {courseTimeSpent != null && (
              <Stack.Item>
                <Text variant="small" styles={timeSpentTextStyles}>
                  （检索耗时 {courseTimeSpent} ms）
                </Text>
              </Stack.Item>
            )}
          </Stack>
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

export default LookupList;
