import { call, cancelled, put, select } from 'redux-saga/effects';
import constants from '../constants';
import getDb from '../db';
import {
  loadCourseDetails,
  selectActiveTerm,
  selectFilterConditions,
  setCourseKeys,
  setCourseObsoleted,
  setCourseSelection,
  setCourseTimeSpent,
} from '../store';
import { Course, ExtendedCourseKey, FilterConditions, SortByFn, Term, WhereFn } from '../types';
import { LimitationFilterState, SortByKey, SpecialLimitationType } from '../enums';
import { compileSearchRegExp, getNum } from '../../utils';
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
        let regExp = compileSearchRegExp(conditions[key] as string);
        if (conditions.regExpMode) {
          try {
            regExp = new RegExp(conditions[key] as string);
          } catch (e) {
            console.warn(e);
          }
        }
        where.push((course) => regExp.test(course[key] as string));
      }
    });
    if (conditions.campus) {
      where.push((course) => course.campus === conditions.campus);
    }
    if (conditions.remainingCapacity > 0) {
      where.push((course) => getNum(course.capacity) - getNum(course.number) >= conditions.remainingCapacity);
    }
    Object.keys(conditions.limitations).forEach((key) => {
      switch (conditions.limitations[key as SpecialLimitationType]) {
        case LimitationFilterState.EXCLUDED:
          where.push(
            (course) => !course.limitations?.includes(constants.LIMITATION_VALUE[key as SpecialLimitationType])
          );
          break;
        case LimitationFilterState.EXCLUSIVE:
          where.push(
            (course) => !!course.limitations?.includes(constants.LIMITATION_VALUE[key as SpecialLimitationType])
          );
          break;
      }
    });

    const sortBy: SortByFn[] = [];
    conditions.sortBy.forEach(({ key, descending }) => {
      switch (key) {
        case SortByKey.CREDITS:
          sortBy.push((course) => {
            const credit = getNum(course.credit);
            if (Number.isSafeInteger(credit)) {
              return descending ? -credit : credit;
            } else {
              return Number.POSITIVE_INFINITY;
            }
          });
          break;
        case SortByKey.NUMBER:
          sortBy.push((course) => {
            const number = getNum(course.number);
            if (Number.isSafeInteger(number)) {
              return descending ? -number : number;
            } else {
              return Number.POSITIVE_INFINITY;
            }
          });
          break;
        case SortByKey.CAPACITY:
          sortBy.push((course) => {
            const capacity = getNum(course.capacity);
            if (Number.isSafeInteger(capacity)) {
              return descending ? -capacity : capacity;
            } else {
              return Number.POSITIVE_INFINITY;
            }
          });
          break;
        case SortByKey.REMAINING_CAPACITY:
          sortBy.push((course) => {
            const capacity = getNum(course.capacity);
            const number = getNum(course.number);
            const remainingCapacity = capacity - number;
            if (Number.isSafeInteger(remainingCapacity)) {
              return descending ? -remainingCapacity : remainingCapacity;
            } else {
              return Number.POSITIVE_INFINITY;
            }
          });
      }
    });

    result = yield call(db.listFilteredCourses, term.termId, term.hash, where, sortBy);
  }

  const endTime = new Date().getTime();

  if (!((yield cancelled()) as boolean)) {
    yield put(setCourseSelection(null));
    yield put(setCourseKeys(result));
    yield put(setCourseTimeSpent(endTime - startTime));
    yield call(loadCourseDetailsSaga, loadCourseDetails({ offset: 0, limit: 10 }));
    yield put(setCourseObsoleted(false));
  }
}

export default filterCoursesSaga;
