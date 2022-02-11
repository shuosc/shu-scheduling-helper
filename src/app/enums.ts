export enum InitStatus {
  LOADING = 'LOADING',
  SUCCEEDED = 'SUCCEEDED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  DB_ERROR = 'DB_ERROR',
}

export enum UpdateStatus {
  UPDATING = 'UPDATING',
  NETWORK_ERROR = 'NETWORK_ERROR',
  SUCCEEDED = 'SUCCEEDED',
}

export enum DarkMode {
  AUTO = 'AUTO',
  OFF = 'OFF',
  ON = 'ON',
}

export enum TabKey {
  TIME_TABLE = 'TIME_TABLE',
  MY_COURSES = 'MY_COURSES',
  LOOKUP_PANEL = 'LOOKUP_PANEL',
}
