let afterProcessCallback = null;

export function setAfterProcessCallback(callback) {
  afterProcessCallback = callback;
}

let periodsCache = {};

export function getPeriods(str) {
  if (periodsCache.hasOwnProperty(str)) {
    return periodsCache[str];
  } else {
    let pattern = /([一二三四五])(\d+)(?:-(\d+))?([单双])?(?:\D*?(上机|实验))?/g;
    let result = [];
    let execResult = pattern.exec(str);
    while (execResult !== null) {
      let from = parseInt(execResult[2]), to = execResult[3] != null ? parseInt(execResult[3]) : from;
      if (from >= 1 && from <= 12 && to >= 1 && to <= 12 && from <= to) {
        for (let i = from; i <= to; i++) {
          result.push([i - 1, ['一', '二', '三', '四', '五'].indexOf(execResult[1]), i === from, to - from + 1, execResult[4], execResult[5]]);
        }
      }
      execResult = pattern.exec(str);
    }
    return periodsCache[str] = result;
  }
}
import { hasPeriodConflict } from './CheckConflict';

export function getClassesChangeList(before, after, reserved, selected, timeTable) {
  let rowsMap = {}, currentRowsMap = {}, mutation = {}, result = [];
  before.forEach((row) => {
    currentRowsMap[`${row['course_id']}-${row['teacher_id']}`] = row;
  });
  after.forEach((row) => {
    rowsMap[`${row['course_id']}-${row['teacher_id']}`] = row;
  });
  for (let key in currentRowsMap) {
    if (currentRowsMap.hasOwnProperty(key)) {
      if (reserved.hasOwnProperty(currentRowsMap[key]['course_id']) && reserved[currentRowsMap[key]['course_id']].classes.hasOwnProperty(currentRowsMap[key]['teacher_id'])) {
        if (rowsMap.hasOwnProperty(key)) {
          if (selected.hasOwnProperty(currentRowsMap[key]['course_id']) && selected[currentRowsMap[key]['course_id']].teacherId === currentRowsMap[key]['teacher_id'] && currentRowsMap[key]['class_time'] !== rowsMap[key]['class_time']) {
            getPeriods(rowsMap[key]['class_time']).forEach((period) => {
              let cellCourses = timeTable[period[0]][period[1]];
              
              // 使用CheckConflict.js中的hasPeriodConflict函数检查是否有冲突
              let hasConflict = hasPeriodConflict(period, cellCourses, rowsMap[key]['course_id'], selected, reserved);
              
              if (hasConflict) {
                mutation[key] = Object.assign({
                  type: 'conflicted',
                }, currentRowsMap[key]);
              }
            });
          }
        } else if (selected.hasOwnProperty(currentRowsMap[key]['course_id']) && selected[currentRowsMap[key]['course_id']].teacherId === currentRowsMap[key]['teacher_id']) {
          mutation[key] = Object.assign({
            type: 'deleted',
          }, currentRowsMap[key]);
        } else {
          mutation[key] = Object.assign({
            type: 'deleted-silent',
          }, currentRowsMap[key]);
        }
      }
    }
  }
  let keys = Object.keys(mutation);
  keys.sort();
  keys.forEach((key) => {
    result.push(mutation[key]);
  });
  return result;
}

export function processSelectedClasses(selectedClasses, reservedClasses) {
  let rows = [];
  for (let i = 0; i < 12; i++) {
    rows.push([[], [], [], [], []]);
  }
  
  for (let courseId in selectedClasses) {
    if (selectedClasses.hasOwnProperty(courseId)) {
      let teacherId = selectedClasses[courseId].teacherId;
      selectedClasses[courseId].periods = getPeriods(reservedClasses[courseId].classes[teacherId].classTime);
      
      selectedClasses[courseId].periods.forEach((period) => {
        const rowIndex = period[0];
        const colIndex = period[1];

        if (!rows[rowIndex][colIndex].includes(courseId)) {
          rows[rowIndex][colIndex].push(courseId);
        }
      });
    }
  }
  
  if (afterProcessCallback) {
    afterProcessCallback(selectedClasses, reservedClasses);
  }
}

export function processWithChangeList(changeList, selectedClasses, reservedClasses, allCoursesMap) {
  changeList.forEach((change) => {
    if (change.type === 'deleted' || change.type === 'deleted-silent') {
      if (allCoursesMap.hasOwnProperty(change['course_id'])) {
        if (reservedClasses.hasOwnProperty(change['course_id']) && reservedClasses[change['course_id']].classes.hasOwnProperty(change['teacher_id'])) {
          delete reservedClasses[change['course_id']].classes[change['teacher_id']];
        }
        if (selectedClasses.hasOwnProperty(change['course_id']) && selectedClasses[change['course_id']].teacherId === change['teacher_id']) {
          delete selectedClasses[change['course_id']];
        }
      } else {
        delete reservedClasses[change['course_id']];
        if (selectedClasses.hasOwnProperty(change['course_id'])) {
          delete selectedClasses[change['course_id']];
        }
      }
    } else if (change.type === 'conflicted') {
      if (selectedClasses.hasOwnProperty(change['course_id'])) {
        delete selectedClasses[change['course_id']];
      }
    }
  });
}

export function isMacLike() {
  return /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
}