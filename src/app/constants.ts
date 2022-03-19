import { DarkMode, SpecialLimitationType } from './enums';

const constants = {
  MEDIA_DESKTOP_SCREEN: '@media (min-width: 1000px)',
  MEDIA_WIDE_DESKTOP_SCREEN: '@media (min-width: 1200px)',
  DB_NAME: 'shu-scheduling-helper--v3',
  PERSIST_KEY: 'shu-scheduling-helper--v3',
  PERSIST_VERSION: 1,
  DEFAULT_API_BASE_URL: 'https://api.xk.shuosc.com/v2/',
  DEFAULT_LOCAL_API_BASE_URL: '/v2/',
  DARK_MODE_NAME: {
    [DarkMode.OFF]: '浅色',
    [DarkMode.ON]: '深色',
    [DarkMode.AUTO]: '跟随系统设置',
  },
  DARK_MODE_ICON_NAME: {
    [DarkMode.OFF]: 'Sunny',
    [DarkMode.ON]: 'ClearNight',
    [DarkMode.AUTO]: 'System',
  },
  LIMITATION_VALUE: {
    [SpecialLimitationType.LIMITED_IN_NUMBER]: '人数已满',
    [SpecialLimitationType.NOT_SELECTABLE]: '禁止选课',
    [SpecialLimitationType.NOT_UNSELECTABLE]: '禁止退课',
  },
};

export default constants;
