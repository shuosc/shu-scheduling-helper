import { call, cancelled, put, select } from 'redux-saga/effects';
import getDb from '../db';
import {
  loadCourseDetails,
  selectActiveTerm,
  selectFilterConditions,
  setCourseKeys,
  setCourseSelection,
  setCourseTimeSpent,
} from '../store';
import { Course, ExtendedCourseKey, FilterConditions, Term, WhereFn } from '../types';
import { compileSearchRegExp } from '../../utils';
import loadCourseDetailsSaga from './loadCourseDetailsSaga';

const searchKeys: (keyof FilterConditions & keyof Course)[] = [
  'courseId',
  'courseName',
  'credit',
  'teacherId',
  'teacherName',
  'classTime',
];

function* filterCoursesSaga() {
  const startTime = new Date().getTime();

  let result: ExtendedCourseKey[] = [];
  const db = getDb();
  const term: Term | null = yield select(selectActiveTerm);
  if (term) {
    const conditions: FilterConditions = { ...(yield select(selectFilterConditions)) };
    const where: WhereFn[] = [];
    searchKeys.forEach((key) => {
      if (conditions[key]) {
        const regExp = compileSearchRegExp(conditions[key] as string);
        where.push((item) => regExp.test(item[key] as string));
      }
    });
    if (conditions.campus) {
      where.push((item) => item.campus === conditions.campus);
    }
    if (conditions.remainingCapacity > 0) {
      where.push((item) => {
        const capacity = item.capacity ? parseInt(item.capacity) : NaN;
        const number = item.number ? parseInt(item.number) : NaN;
        if (Number.isSafeInteger(capacity) && Number.isSafeInteger(number)) {
          return capacity - number >= conditions.remainingCapacity;
        } else {
          return false;
        }
      });
    }
    result = yield call(db.listFilteredCourses, term.termId, term.hash, where, []);
  }

  const endTime = new Date().getTime();

  if (!((yield cancelled()) as boolean)) {
    yield put(setCourseSelection(null));
    yield put(setCourseKeys(result));
    yield put(setCourseTimeSpent(endTime - startTime));
    yield call(loadCourseDetailsSaga, loadCourseDetails({ offset: 0, limit: 10 }));
  }
}

export default filterCoursesSaga;
