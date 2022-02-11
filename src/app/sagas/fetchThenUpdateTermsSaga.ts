import { call, put } from 'redux-saga/effects';
import api from '../api';
import getDb from '../db';
import { setInitStatus } from '../store';
import { InitStatus } from '../enums';

function* fetchThenUpdateTermsSaga() {
  try {
    const db = getDb();
    const res: Awaited<ReturnType<typeof api.getManifest>> = yield call(api.getManifest);
    yield call(db.updateTerms, res.data.terms, res.data.current);
  } catch (err) {
    yield put(setInitStatus(InitStatus.NETWORK_ERROR));
    throw err;
  }
}

export default fetchThenUpdateTermsSaga;
