import React, { useCallback, useMemo } from 'react';
import { IPivotStyles, mergeStyles, Pivot, PivotItem, useTheme } from '@fluentui/react';
import constants from '../../app/constants';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectTabKey, setTabKey } from '../../app/store';
import { TabKey } from '../../app/enums';
import LookupPanel from '../LookupPanel';
import TimeTable from '../TimeTable';
import Footer from '../Footer';
import MyCourses from '../MyCourses';

const Main: React.FC = () => {
  const tabKey = useAppSelector(selectTabKey);
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const mainClassName = useMemo(
    () =>
      mergeStyles({
        background: theme.palette.neutralLighter,
        [constants.MEDIA_DESKTOP_SCREEN]: {
          display: 'flex',
          flex: '1',
          alignItems: 'stretch',
          justifyContent: 'stretch',
          minHeight: '0',
          width: '100%',
          maxWidth: 'calc(800px + 50vw)',
          alignSelf: 'flex-end',
        },
      }),
    [theme]
  );
  const asideClassName = useMemo(
    () =>
      mergeStyles({
        display: tabKey === TabKey.TIME_TABLE ? 'block' : 'none',
        padding: '7px 8px 8px',
        [constants.MEDIA_DESKTOP_SCREEN]: {
          display: 'block',
          overflowY: 'hidden',
          width: '480px',
          height: '100%',
          padding: '7px 4px 8px 8px',
          ':hover': {
            overflowY: 'auto',
          },
        },
      }),
    [tabKey]
  );
  const sectionClassName = useMemo(
    () =>
      mergeStyles({
        display: tabKey !== TabKey.TIME_TABLE ? 'block' : 'none',
        padding: '7px 8px 8px',
        [constants.MEDIA_DESKTOP_SCREEN]: {
          display: 'block',
          flex: '1',
          overflowY: 'scroll',
          padding: '7px 8px 8px 4px',
          '> *': {
            maxWidth: '1108px',
          },
        },
      }),
    [tabKey]
  );
  const pivotStyles = useMemo<Partial<IPivotStyles>>(
    () => ({
      root: {
        display: 'none',
        background: theme.palette.white,
        padding: '0 8px',
        [constants.MEDIA_DESKTOP_SCREEN]: {
          display: 'block',
        },
      },
    }),
    [theme]
  );
  const myCoursesClassName = useMemo(
    () =>
      mergeStyles({
        display: tabKey === TabKey.MY_COURSES ? 'block' : 'none',
        [constants.MEDIA_DESKTOP_SCREEN]: {
          display: tabKey !== TabKey.LOOKUP_PANEL ? 'block' : 'none',
        },
      }),
    [tabKey]
  );
  const lookupPanelClassName = useMemo(
    () =>
      mergeStyles({
        display: tabKey === TabKey.LOOKUP_PANEL ? 'block' : 'none',
      }),
    [tabKey]
  );

  const onLinkClick = useCallback(
    (item) => {
      if (item) {
        dispatch(setTabKey(item.props.itemKey as TabKey));
      }
    },
    [dispatch]
  );

  return (
    <main className={mainClassName}>
      <aside className={asideClassName}>
        <TimeTable />
      </aside>
      <section className={sectionClassName}>
        <Pivot
          defaultSelectedKey={TabKey.MY_COURSES}
          selectedKey={tabKey}
          headersOnly
          styles={pivotStyles}
          onLinkClick={onLinkClick}
        >
          <PivotItem itemKey={TabKey.MY_COURSES} headerText="我的课程" />
          <PivotItem itemKey={TabKey.LOOKUP_PANEL} headerText="检索" />
        </Pivot>
        <div className={myCoursesClassName}>
          <MyCourses />
        </div>
        <div className={lookupPanelClassName}>
          <LookupPanel />
        </div>
        <Footer />
      </section>
    </main>
  );
};

export default Main;
