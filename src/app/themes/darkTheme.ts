import { createTheme, IPalette } from '@fluentui/react';

const DarkThemePalette: Partial<IPalette> = {
  themeDarker: '#82c7ff',
  themeDark: '#6cb8f6',
  themeDarkAlt: '#3aa0f3',
  themePrimary: '#2899f5',
  themeSecondary: '#0078d4',
  themeTertiary: '#235a85',
  themeLight: '#004c87',
  themeLighter: '#043862',
  themeLighterAlt: '#092c47',
  white: '#1b1a19',
  neutralLighterAlt: '#201f1e',
  neutralLighter: '#252423',
  neutralLight: '#292827',
  neutralQuaternaryAlt: '#323130',
  neutralQuaternary: '#3b3a39',
  neutralTertiaryAlt: '#484644',
  neutralTertiary: '#797775',
  neutralSecondaryAlt: '#979693',
  neutralSecondary: '#a19f9d',
  neutralPrimaryAlt: '#c8c6c4',
  neutralPrimary: '#f3f2f1',
  neutralDark: '#faf9f8',
  black: '#ffffff',
  redDark: '#f1707b',
};

export default createTheme({
  palette: DarkThemePalette,
  semanticColors: {
    primaryButtonText: DarkThemePalette.black,
    primaryButtonTextHovered: DarkThemePalette.black,
    primaryButtonTextPressed: DarkThemePalette.black,
    primaryButtonBackground: DarkThemePalette.themeSecondary,
    primaryButtonBackgroundHovered: DarkThemePalette.themePrimary,
    primaryButtonBackgroundPressed: DarkThemePalette.themeTertiary,
    inputForegroundChecked: DarkThemePalette.black,
  },
  isInverted: true,
});
