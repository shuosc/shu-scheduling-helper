import { call, put, take } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { setActiveTermId } from '../store';
import { SwitchActiveTermArg, updateCourses } from '../sagaActions';
import updateCoursesSaga from './updateCoursesSaga';

function* switchActiveTermSaga(action: PayloadAction<SwitchActiveTermArg>) {
  yield put(setActiveTermId(action.payload.termId));
  while (true) {
    try {
      yield call(updateCoursesSaga);
      break;
    } catch (err) {
      console.warn(err);
    }
    yield take(updateCourses.toString());
  }
  yield call(updateCoursesSaga);
}

export default switchActiveTermSaga;
