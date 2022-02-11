import { call, put } from 'redux-saga/effects';
import getDb from '../db';
import { setAvailableTerms, setInitStatus } from '../store';
import { InitStatus } from '../enums';

function* restoreTermsFromDbSaga() {
  try {
    const db = getDb();
    const res: Awaited<ReturnType<typeof db.getTerms>> = yield call(db.getTerms);
    yield put(setAvailableTerms(res));
  } catch (err) {
    yield put(setInitStatus(InitStatus.DB_ERROR));
    throw err;
  }
}

export default restoreTermsFromDbSaga;
