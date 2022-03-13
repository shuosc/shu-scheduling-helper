import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import createSagaMiddleware from 'redux-saga';
import constants from './constants';
import { CourseListItem, ExtendedCourseKey, FilterConditions, State, Term } from './types';
import { DarkMode, InitStatus, TabKey, UpdateStatus } from './enums';
import rootSaga from './sagas';

const filterConditions = () => ({
  courseId: '',
  courseName: '',
  credit: '',
  teacherId: '',
  teacherName: '',
  classTime: '',
  campus: null,
  excludeSelected: false,
  remainingCapacity: 0,
});
const initialState: State = {
  darkMode: DarkMode.AUTO,
  tabKey: TabKey.LOOKUP_PANEL,
  initStatus: InitStatus.LOADING,
  updateStatus: UpdateStatus.SUCCEEDED,
  showOptionsPanel: false,
  activeTermId: null,
  availableTerms: [],
  courseKeys: [],
  courseItems: [],
  courseOffset: 0,
  courseLimit: 10,
  courseSelection: null,
  filterConditions: filterConditions(),
};

const rootSlice = createSlice({
  name: 'root',
  initialState,
  reducers: {
    setDarkMode: (state, action: PayloadAction<DarkMode>) => {
      state.darkMode = action.payload;
    },
    setTabKey: (state, action: PayloadAction<TabKey>) => {
      state.tabKey = action.payload;
    },
    setShowOptionsPanel: (state, action: PayloadAction<boolean>) => {
      state.showOptionsPanel = action.payload;
    },
    setInitStatus: (state, action: PayloadAction<InitStatus>) => {
      state.initStatus = action.payload;
    },
    setUpdateStatus: (state, action: PayloadAction<UpdateStatus>) => {
      state.updateStatus = action.payload;
    },
    setActiveTermId: (state, action: PayloadAction<string | null>) => {
      state.activeTermId = action.payload;
      state.courseKeys = [];
      state.courseItems = [];
    },
    setAvailableTerms: (state, action: PayloadAction<Term[]>) => {
      state.availableTerms = action.payload;
      if (!state.activeTermId || !action.payload.some((item) => item.termId === state.activeTermId)) {
        state.activeTermId = action.payload.length > 0 ? action.payload[0].termId : null;
      }
    },
    setCourseKeys: (state, action: PayloadAction<ExtendedCourseKey[]>) => {
      state.courseKeys = action.payload;
    },
    setCourseItems: (state, action: PayloadAction<CourseListItem[]>) => {
      state.courseItems = action.payload;
    },
    setCourseOffset: (state, action: PayloadAction<number>) => {
      state.courseOffset = action.payload;
    },
    setCourseLimit: (state, action: PayloadAction<number>) => {
      state.courseLimit = action.payload;
    },
    setCourseSelection: (state, action: PayloadAction<Record<string, true> | null>) => {
      state.courseSelection = action.payload;
    },
    addCourseSelection: (state, action: PayloadAction<string[]>) => {
      if (!state.courseSelection) {
        state.courseSelection = {};
      }
      action.payload.forEach((item) => {
        state.courseSelection![item] = true;
      });
    },
    removeCourseSelection: (state, action: PayloadAction<string[]>) => {
      if (state.courseSelection) {
        action.payload.forEach((item) => {
          delete state.courseSelection![item];
        });
      }
    },
    setFilterConditions: (state, action: PayloadAction<FilterConditions>) => {
      state.filterConditions = action.payload;
    },
    resetFilterConditions: (state) => {
      state.filterConditions = filterConditions();
    },
  },
});

const rootReducer = persistReducer(
  {
    key: constants.PERSIST_KEY,
    version: constants.PERSIST_VERSION,
    storage,
    whitelist: ['darkMode', 'activeTermId'],
  },
  rootSlice.reducer
);

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
    sagaMiddleware,
  ],
});

sagaMiddleware.run(rootSaga);

export const persistor = persistStore(store);

export * from './sagaActions';
export const {
  setDarkMode,
  setTabKey,
  setShowOptionsPanel,
  setInitStatus,
  setUpdateStatus,
  setAvailableTerms,
  setActiveTermId,
  setCourseKeys,
  setCourseItems,
  setCourseOffset,
  setCourseLimit,
  setCourseSelection,
  addCourseSelection,
  removeCourseSelection,
  setFilterConditions,
  resetFilterConditions,
} = rootSlice.actions;
export const selectDarkMode = (state: RootState) => state.darkMode;
export const selectTabKey = (state: RootState) => state.tabKey;
export const selectShowOptionsPanel = (state: RootState) => state.showOptionsPanel;
export const selectInitStatus = (state: RootState) => state.initStatus;
export const selectUpdateStatus = (state: RootState) => state.updateStatus;
export const selectAvailableTerms = (state: RootState) => state.availableTerms;
export const selectActiveTerm = (state: RootState) =>
  state.availableTerms.find((item) => item.termId === state.activeTermId) || null;
export const selectCourseKeys = (state: RootState) => state.courseKeys;
export const selectCourseItems = (state: RootState) => state.courseItems;
export const selectCourseOffset = (state: RootState) => state.courseOffset;
export const selectCourseLimit = (state: RootState) => state.courseLimit;
export const selectCourseTotal = (state: RootState) => state.courseKeys.length;
export const selectCoursePage = (state: RootState) => Math.floor(state.courseOffset / state.courseLimit) + 1;
export const selectCourseMaxPage = (state: RootState) =>
  Math.max(1, Math.ceil(state.courseKeys.length / state.courseLimit));
export const selectCourseSelection = (state: RootState) => state.courseSelection;
export const selectCourseSelectionCount = (state: RootState) => Object.keys(state.courseSelection || {}).length;
export const selectFilterConditions = (state: RootState) => state.filterConditions;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
