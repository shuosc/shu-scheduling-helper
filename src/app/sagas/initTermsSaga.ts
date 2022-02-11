import { call, put } from 'redux-saga/effects';
import { setInitStatus } from '../store';
import { InitStatus } from '../enums';
import fetchThenUpdateTermsSaga from './fetchThenUpdateTermsSaga';
import filterCoursesSaga from './filterCoursesSaga';
import restoreTermsFromDbSaga from './restoreTermsFromDbSaga';
import updateCoursesSaga from './updateCoursesSaga';

function* initTermsSaga() {
  yield put(setInitStatus(InitStatus.LOADING));
  yield call(restoreTermsFromDbSaga);
  yield call(fetchThenUpdateTermsSaga);
  yield call(restoreTermsFromDbSaga);
  yield put(setInitStatus(InitStatus.SUCCEEDED));
  yield call(filterCoursesSaga);
  yield call(updateCoursesSaga);
}

export default initTermsSaga;
