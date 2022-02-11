import { call, cancelled, delay, put, select } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { selectFilterConditions, setFilterConditions } from '../store';
import { FilterConditions } from '../types';
import { filterAssign } from '../../utils';
import filterCoursesSaga from './filterCoursesSaga';

function* changeFilterConditionSaga(action: PayloadAction<Partial<FilterConditions>>) {
  const oldCondition: FilterConditions = yield select(selectFilterConditions);
  yield put(setFilterConditions(filterAssign<FilterConditions>({}, oldCondition, action.payload)));
  yield delay(300);
  if ((yield cancelled()) as boolean) {
    return;
  }
  yield call(filterCoursesSaga);
}

export default changeFilterConditionSaga;
