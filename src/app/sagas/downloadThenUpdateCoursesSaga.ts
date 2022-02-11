import { call, put } from 'redux-saga/effects';
import api from '../api';
import getDb from '../db';
import { setUpdateStatus } from '../store';
import { UpdateStatus } from '../enums';
import { Term } from '../types';

function* downloadThenUpdateCoursesSaga({ termId, hash }: Term) {
  yield put(setUpdateStatus(UpdateStatus.UPDATING));
  try {
    const db = getDb();
    const res: Awaited<ReturnType<typeof api.getTermCourses>> = yield call(api.getTermCourses, { termId, hash });
    yield call(db.updateCourses, res.data, termId, hash);
    yield put(setUpdateStatus(UpdateStatus.SUCCEEDED));
  } catch (err) {
    yield put(setUpdateStatus(UpdateStatus.NETWORK_ERROR));
    throw err;
  }
}

export default downloadThenUpdateCoursesSaga;
