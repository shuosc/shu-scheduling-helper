import { call, cancelled, put, select } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import getDb from '../db';
import {
  LoadCourseDetailsArg,
  selectCourseItems,
  selectCourseKeys,
  setCourseItems,
  setCourseLimit,
  setCourseOffset,
} from '../store';
import { Course, CourseListItem, ExtendedCourseKey } from '../types';

function* loadCourseDetailsSaga(action: PayloadAction<LoadCourseDetailsArg>) {
  const db = getDb();
  const keys: ExtendedCourseKey[] = yield select(selectCourseKeys);
  const oldItems: CourseListItem[] = yield select(selectCourseItems);
  const pagedKeys = keys.slice(action.payload.offset, action.payload.offset + action.payload.limit);
  yield put(setCourseOffset(action.payload.offset));
  yield put(setCourseLimit(action.payload.limit));
  const items: CourseListItem[] = pagedKeys.map((item, index) =>
    oldItems[index] &&
    item.termId === oldItems[index].termId &&
    item.courseId === oldItems[index].courseId &&
    item.teacherId === oldItems[index].teacherId
      ? { ...oldItems[index] }
      : { ...item, loaded: false, course: null }
  );
  yield put(setCourseItems(items));
  const courses: (Course | null)[] = yield call(db.getCourseDetails, pagedKeys);
  if (!((yield cancelled()) as boolean)) {
    const newItems: CourseListItem[] = courses.map((course, index) => ({
      ...pagedKeys[index],
      course,
      loaded: true,
    }));
    yield put(setCourseItems(newItems));
  }
}

export default loadCourseDetailsSaga;
