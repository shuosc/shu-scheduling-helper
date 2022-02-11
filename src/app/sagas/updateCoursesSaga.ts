import { call, put, race, select, take } from 'redux-saga/effects';
import { resetFilterConditions, selectActiveTerm, switchActiveTerm, updateCourses } from '../store';
import { Term } from '../types';
import downloadThenUpdateCoursesSaga from './downloadThenUpdateCoursesSaga';
import restoreTermsFromDbSaga from './restoreTermsFromDbSaga';
import switchActiveTermSaga from './switchActiveTermSaga';
import filterCoursesSaga from './filterCoursesSaga';

function* updateCoursesSaga(): any {
  while (true) {
    try {
      const activeTerm: Term | null = yield select(selectActiveTerm);
      if (activeTerm && !activeTerm.upToDate) {
        yield call(downloadThenUpdateCoursesSaga, activeTerm);
        yield call(restoreTermsFromDbSaga);
      }
      break;
    } catch (err) {
      console.warn(err);
    }
    const { switchActiveTermAction } = yield race({
      retry: take(updateCourses.toString()),
      switchActiveTermAction: take(switchActiveTerm.toString()),
    });
    if (switchActiveTermAction) {
      yield call(switchActiveTermSaga, switchActiveTermAction);
      break;
    }
  }
  yield put(resetFilterConditions());
  yield call(filterCoursesSaga);
}

export default updateCoursesSaga;
