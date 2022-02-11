import { call, take, takeLatest, takeLeading } from 'redux-saga/effects';
import { changeFilterConditions, initTerms, loadCourseDetails, switchActiveTerm } from '../sagaActions';
import initTermsSaga from './initTermsSaga';
import loadCourseDetailsSaga from './loadCourseDetailsSaga';
import switchActiveTermSaga from './switchActiveTermSaga';
import changeFilterConditionSaga from './changeFilterConditionSaga';

function* rootSaga() {
  while (true) {
    yield take(initTerms.toString());
    try {
      yield call(initTermsSaga);
      break;
    } catch (err) {
      console.warn(err);
    }
  }
  yield takeLeading(switchActiveTerm.toString(), switchActiveTermSaga);
  yield takeLatest(changeFilterConditions.toString(), changeFilterConditionSaga);
  yield takeLatest(loadCourseDetails.toString(), loadCourseDetailsSaga);
}

export default rootSaga;
