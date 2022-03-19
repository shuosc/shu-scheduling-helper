import React, { useEffect, useMemo, useState } from 'react';
import { mergeStyles, Theme, ThemeProvider, useDocument } from '@fluentui/react';
import { useAppDispatch, useAppSelector } from './hooks';
import constants from './constants';
import themes from './themes';
import Header from '../layouts/Header';
import Main from '../layouts/Main';
import { DarkMode } from './enums';
import { initTerms, selectDarkMode } from './store';
import OptionPanel from '../layouts/OptionPanel';
import SortDialog from '../layouts/SortDialog';
import JumpToDialog from '../layouts/JumpToDialog';
import AdditionalFilterDialog from '../layouts/AdditionalFilterDialog';

const mql = window.matchMedia('(prefers-color-scheme: dark)');
const usePreferDark = () => {
  const [preferDark, setPreferDark] = useState(mql.matches);
  useEffect(() => {
    const mediaQueryListener = (event: MediaQueryListEvent) => {
      setPreferDark(event.matches);
    };
    mql.addEventListener('change', mediaQueryListener);
    return () => {
      mql.removeEventListener('change', mediaQueryListener);
    };
  }, [setPreferDark]);
  return preferDark;
};

const App: React.FC = () => {
  const darkMode = useAppSelector(selectDarkMode);
  const preferDark = usePreferDark();
  const doc = useDocument();
  const dispatch = useAppDispatch();

  const theme = useMemo<Theme>(
    () =>
      ({
        [DarkMode.AUTO]: preferDark ? themes.dark : themes.light,
        [DarkMode.OFF]: themes.light,
        [DarkMode.ON]: themes.dark,
      }[darkMode]),
    [darkMode, preferDark]
  );
  const className = useMemo(
    () =>
      mergeStyles({
        minHeight: '100%',
        background: `${theme.palette.neutralLighter} !important`,
        [constants.MEDIA_DESKTOP_SCREEN]: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          justifyContent: 'stretch',
          height: '100%',
        },
      }),
    [theme]
  );

  useEffect(() => {
    if (doc) {
      doc.documentElement.style.colorScheme = theme.isInverted ? 'dark' : 'light';
      doc.documentElement.style.background = theme.palette.neutralLighter;
    }
  }, [doc, theme]);

  useEffect(() => {
    dispatch(initTerms());
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme} className={className}>
      <Header />
      <Main />
      <OptionPanel />
      <SortDialog />
      <JumpToDialog />
      <AdditionalFilterDialog />
    </ThemeProvider>
  );
};

export default App;
