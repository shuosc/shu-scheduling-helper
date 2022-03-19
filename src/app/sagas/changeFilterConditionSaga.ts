import { call, cancelled, delay, put, select } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { selectFilterConditions, setCourseObsoleted, setFilterConditions } from '../store';
import { FilterConditions } from '../types';
import { filterAssign } from '../../utils';
import filterCoursesSaga from './filterCoursesSaga';

function* changeFilterConditionSaga(action: PayloadAction<Partial<FilterConditions>>) {
  const oldCondition: FilterConditions = yield select(selectFilterConditions);

  if (
    Object.keys(action.payload).some(
      (key) => oldCondition[key as keyof FilterConditions] !== action.payload[key as keyof FilterConditions]
    )
  ) {
    yield put(setCourseObsoleted(true));
    yield put(setFilterConditions(filterAssign<FilterConditions>({}, oldCondition, action.payload)));

    yield delay(150);
    if ((yield cancelled()) as boolean) {
      return;
    }

    yield call(filterCoursesSaga);
  }
}

export default changeFilterConditionSaga;
