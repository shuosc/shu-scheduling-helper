import LightTheme from './lightTheme';
import DarkTheme from './darkTheme';

const themes = {
  light: LightTheme,
  dark: DarkTheme,
} as const;

export default themes;
