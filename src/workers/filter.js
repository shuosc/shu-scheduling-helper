import registerPromiseWorker from 'promise-worker/register';
import {getPeriods} from '../utils';

function concatRegExp(parts) {
  parts.forEach((part, index) => {
    parts[index] = part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  });
  return new RegExp(parts.join('.*'), 'i');
}

registerPromiseWorker(function (message) {
  const isReserved = (data) => {
    if (message.reservedClasses.hasOwnProperty(data['course_id'])) {
      if (message.reservedClasses[data['course_id']].classes.hasOwnProperty(data['teacher_id'])) {
        return true;
      }
    }
    return false;
  };
  const isSelected = (data) => {
    if (message.selectedClasses.hasOwnProperty(data['course_id'])) {
      if (message.selectedClasses[data['course_id']].teacherId === data['teacher_id']) {
        return true;
      }
    }
    return false;
  };
  const isNumberExceeded = (data, condition) => {
    let conditionNumber = parseInt(condition);
    if (Number.isInteger(conditionNumber) && conditionNumber > 0) {
      if (message.allClassesExtra.hasOwnProperty(`${data['course_id']}-${data['teacher_id']}`)) {
        let capacity = parseInt(message.allClassesExtra[`${data['course_id']}-${data['teacher_id']}`].capacity);
        let number = parseInt(message.allClassesExtra[`${data['course_id']}-${data['teacher_id']}`].number);
        if (Number.isInteger(capacity) && Number.isInteger(number)) {
          return capacity - number < conditionNumber;
        }
      }
    }
    return false;
  };
  const getConflicts = (courseId, classTime) => {
    let courseConflicts = {};
    getPeriods(classTime).forEach((period) => {
      let targetCell = message.scheduleTableRows[period[0]][period[1]];
      if (targetCell !== null && targetCell.courseId !== courseId) {
        courseConflicts[targetCell.courseId] = true;
      }
    });
    return courseConflicts;
  };
  let rows = [];
  let conditionsRegExp = {};
  for (let condition in message.conditions.search) {
    if (message.conditions.search.hasOwnProperty(condition)) {
      conditionsRegExp[condition] = concatRegExp(message.conditions.search[condition].split(/\s+/))
    }
  }
  message.allClasses.forEach((row) => {
    if (isNumberExceeded(row, message.conditions.number)) {
      return;
    }
    for (let condition in conditionsRegExp) {
      if (conditionsRegExp.hasOwnProperty(condition)) {
        if (!conditionsRegExp[condition].test(row[condition])) {
          return;
        }
      }
    }
    let newRow = Object.assign({}, row);
    newRow['course'] = {
      id: newRow['course_id'],
      name: newRow['course_name'],
      credit: newRow['credit'],
    };
    newRow['teacher'] = {
      id: newRow['teacher_id'],
      name: newRow['teacher_name'],
    };
    newRow['venue'] = {
      key: `${newRow['course_id']}-${newRow['teacher_id']}`,
      campus: newRow['campus'],
    };
    newRow['number'] = {
      key: `${newRow['course_id']}-${newRow['teacher_id']}`,
    };
    newRow['class_time_info'] = {
      row: row,
      key: `${newRow['course_id']}-${newRow['teacher_id']}`,
      isSelected: isSelected(row),
      canPreview: getPeriods(newRow['class_time']).length > 0,
      conflicts: getConflicts(newRow['course_id'], newRow['class_time']),
    };
    newRow['action'] = {
      row: row,
      isReserved: isReserved(row),
      isSelected: newRow['class_time_info'].isSelected,
      conflicts: newRow['class_time_info'].conflicts,
    };
    newRow['key'] = `${newRow['course_id']}-${newRow['teacher_id']}`;
    if ((!message.conditions.filterConflicts || Object.keys(newRow['class_time_info'].conflicts).length === 0)
      && (message.conditions.displayOption !== 1 || !newRow['action'].isReserved)
      && (message.conditions.displayOption !== 2 || newRow['action'].isReserved)) {
      rows.push(newRow);
    }
  });
  return rows;
});
