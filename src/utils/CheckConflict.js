import { getPeriods } from './course';

export function checkWeekTypeConflict(currentWeekType, conflictWeekType) {
  return (currentWeekType === '单' && conflictWeekType === '双') || 
         (currentWeekType === '双' && conflictWeekType === '单');
}

export function hasPeriodConflict(period, cellCourses, courseId, selected, reserved) {
  if (!cellCourses?.length) return false;
  
  const currentWeekType = period[4];
  
  for (const cell of cellCourses) {
    if (!cell || cell.courseId === courseId) continue;
    
    const conflictCourseId = cell.courseId;
    if (!selected[conflictCourseId] || !reserved[conflictCourseId]) continue;
    
    const conflictTeacherId = selected[conflictCourseId].teacherId;
    if (!reserved[conflictCourseId].classes[conflictTeacherId]) continue;
    
    const conflictPeriods = getPeriods(reserved[conflictCourseId].classes[conflictTeacherId].classTime);
    const conflictPeriod = conflictPeriods.find(p => p[0] === period[0] && p[1] === period[1]);
    
    if (!conflictPeriod || !checkWeekTypeConflict(currentWeekType, conflictPeriod[4])) return true;
  }
  
  return false;
}

export function hasTimeConflict(currentClassPeriods, scheduleTableRows, courseId, store) {
  for (const period of currentClassPeriods) {
    const cells = scheduleTableRows[period[0]][period[1]];
    if (!cells.length || cells.every(cell => cell.courseId === courseId)) continue;
    
    for (const cell of cells) {
      if (cell.courseId === courseId) continue;
      
      const conflictCourseId = cell.courseId;
      const conflictTeacherId = store.state.selectedClasses[conflictCourseId].teacherId;
      const conflictPeriods = getPeriods(store.state.reservedClasses[conflictCourseId].classes[conflictTeacherId].classTime);
      const conflictPeriod = conflictPeriods.find(p => p[0] === period[0] && p[1] === period[1]);

      if (!conflictPeriod || !checkWeekTypeConflict(period[4], conflictPeriod[4])) return true;
    }
  }
  return false;
}

export function hasCampusConflict(currentClassPeriods, scheduleTableRows, campusTableRows, courseId, campus, store) {
  for (const period of currentClassPeriods) {
    const campusCell = campusTableRows[period[0]][period[1]];
    if (campusCell == null || campusCell === campus) continue;
    
    const cellBefore = period[0] > 0 ? scheduleTableRows[period[0] - 1][period[1]] : null;
    const cellAfter = period[0] < 11 ? scheduleTableRows[period[0] + 1][period[1]] : null;

    const checkCell = (cell, rowOffset) => {
      if (!cell || cell.courseId === courseId) return false;
      
      const conflictCourseId = cell.courseId;
      const conflictTeacherId = store.state.selectedClasses[conflictCourseId].teacherId;
      const conflictPeriods = getPeriods(store.state.reservedClasses[conflictCourseId].classes[conflictTeacherId].classTime);
      const conflictPeriod = conflictPeriods.find(p => p[0] === period[0] + rowOffset && p[1] === period[1]);
      
      return !(conflictPeriod && period[4] && conflictPeriod[4] && 
          checkWeekTypeConflict(period[4], conflictPeriod[4])) && cell.campus !== campus;
    };

    if (checkCell(cellBefore, -1) || checkCell(cellAfter, 1)) return true;
  }
  return false;
}

export function getConflicts(courseId, teacherId, store) {
  const courseConflicts = {};
  const currentClassPeriods = getPeriods(store.state.reservedClasses[courseId].classes[teacherId].classTime);
  const currentCampus = store.state.reservedClasses[courseId].classes[teacherId].campus;
  
  currentClassPeriods.forEach(period => {
    const currentWeekType = period[4];
    
    // 时间冲突检查
    store.getters.scheduleTableRows[period[0]][period[1]].forEach(cell => {
      if (cell && cell.courseId !== courseId) {
        const conflictCourseId = cell.courseId;
        const conflictTeacherId = store.state.selectedClasses[conflictCourseId].teacherId;
        const conflictPeriods = getPeriods(store.state.reservedClasses[conflictCourseId].classes[conflictTeacherId].classTime);
        const conflictPeriod = conflictPeriods.find(p => p[0] === period[0] && p[1] === period[1]);

        if (!conflictPeriod || !checkWeekTypeConflict(currentWeekType, conflictPeriod[4])) {
          courseConflicts[cell.courseId] = 1;
        }
      }
    });
    
    // 校区冲突检查
    const campusCells = store.getters.campusTableRows[period[0]][period[1]];
    if (campusCells.some(c => c !== currentCampus)) {
      [-1, 1].forEach(offset => {
        const row = period[0] + offset;
        if (row < 0 || row >= 12) return;
        
        store.getters.scheduleTableRows[row][period[1]].forEach(cell => {
          if (cell && cell.campus !== currentCampus && cell.courseId !== courseId && !courseConflicts[cell.courseId]) {
            const conflictCourseId = cell.courseId;
            const conflictTeacherId = store.state.selectedClasses[conflictCourseId].teacherId;
            const conflictPeriods = getPeriods(store.state.reservedClasses[conflictCourseId].classes[conflictTeacherId].classTime);
            const conflictPeriod = conflictPeriods.find(p => p[0] === row && p[1] === period[1]);
            
            if (!(conflictPeriod && currentWeekType && conflictPeriod[4] && 
                checkWeekTypeConflict(currentWeekType, conflictPeriod[4]))) {
              courseConflicts[cell.courseId] = 2;
            }
          }
        });
      });
    }
  });
  
  return courseConflicts;
}

export function hasAnyConflict(courseId, teacherId, store) {
  return Object.keys(getConflicts(courseId, teacherId, store)).length > 0;
}

export function isAllTeachersConflicted(courseId, store) {
  if (store.state.selectedClasses.hasOwnProperty(courseId)) return false;
  
  for (const teacherId in store.state.reservedClasses[courseId].classes) {
    if (!hasAnyConflict(courseId, teacherId, store)) return false;
  }
  
  return true;
}

export function getAllCoursesConflictStatus(courseIds, store) {
  const result = {};
  courseIds.forEach(courseId => result[courseId] = isAllTeachersConflicted(courseId, store));
  return result;
}