import registerPromiseWorker from 'promise-worker/register';
import { getPeriods } from '../utils';


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
    if (Number.isSafeInteger(conditionNumber) && conditionNumber > 0) {
      if (message.allClassesExtra.hasOwnProperty(`${data['course_id']}-${data['teacher_id']}`)) {
        let capacity = parseInt(message.allClassesExtra[`${data['course_id']}-${data['teacher_id']}`].capacity);
        let number = parseInt(message.allClassesExtra[`${data['course_id']}-${data['teacher_id']}`].number);
        if (Number.isSafeInteger(capacity) && Number.isSafeInteger(number)) {
          return capacity - number < conditionNumber;
        }
      }
    }
    return false;
  };
  const isLimitationsFiltered = (data, conditions) => {
    for (let condition in conditions) {
      if (conditions.hasOwnProperty(condition)) {
        if (conditions[condition] === 'default') {
          continue;
        }
        const name = {
          'xian_zhi_ren_shu': '限制人数',
          'jin_zhi_xuan_ke': '禁止选课',
          'jin_zhi_tui_ke': '禁止退课',
        }[condition] || '';
        const limitations = message.allClassesExtra[`${data['course_id']}-${data['teacher_id']}`].limitations;
        if (conditions[condition] === 'exclude' && limitations.indexOf(name) >= 0) {
          return true;
        } else if (conditions[condition] === 'include' && limitations.indexOf(name) < 0) {
          return true;
        }
      }
    }
    return false;
  };
  const isVenueFiltered = (data, condition) => {
    if (condition === 'default') {
      return false;
    }
    const venue = message.allClassesExtra[`${data['course_id']}-${data['teacher_id']}`].venue;
    if (condition === 'exclude' && venue === '不开') {
      return true;
    } else if (condition === 'include' && venue !== '不开') {
      return true;
    }
    return false;
  };
  const isDateFiltered = (data, condition) => {
    if (condition == null || condition.trim().length === 0) {
      return false;
    }
    const date = message.allClassesExtra[`${data['course_id']}-${data['teacher_id']}`].date;
    return date.indexOf(condition) < 0;
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
      if (message.conditions.regexpMode) {
        try {
          conditionsRegExp[condition] = new RegExp(message.conditions.search[condition], 'i');
        } catch (e) {
          conditionsRegExp[condition] = concatRegExp(message.conditions.search[condition].split(/\s+/));
        }
      } else {
        conditionsRegExp[condition] = concatRegExp(message.conditions.search[condition].split(/\s+/));
      }
    }
  }
  message.allClasses.forEach((row) => {
    if (message.conditions.limitRows > 0 && rows.length >= message.conditions.limitRows) {
      return;
    }
    if (isNumberExceeded(row, message.conditions.number)
      || isLimitationsFiltered(row, message.conditions.filterLimitations)
      || isVenueFiltered(row, message.conditions.filterVenue)
      || isDateFiltered(row, message.conditions.date)) {
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
  if (message.conditions.sortBy.length > 1) {
    rows.forEach((row) => {
      let capacity = NaN, number = NaN, capacityNumber = NaN, numberCapacity = NaN;
      if (message.allClassesExtra.hasOwnProperty(`${row['course_id']}-${row['teacher_id']}`)) {
        capacity = parseInt(message.allClassesExtra[`${row['course_id']}-${row['teacher_id']}`].capacity);
        number = parseInt(message.allClassesExtra[`${row['course_id']}-${row['teacher_id']}`].number);
        if (Number.isSafeInteger(capacity) && Number.isSafeInteger(number)) {
          capacityNumber = capacity - number;
          numberCapacity = number / capacity;
        }
      }
      row['sorts_value'] = {
        capacity, number, capacityNumber, numberCapacity,
        credit: parseFloat(row['credit']),
      };
    });
    const getFn = (key, desc) => {
      return (row1, row2) => {
        if (!isFinite(row1['sorts_value'][key])) {
          return 99999;
        }
        if (!isFinite(row2['sorts_value'][key])) {
          return -99999;
        }
        return (row1['sorts_value'][key] - row2['sorts_value'][key]) * (desc ? -1 : 1);
      };
    };
    let sorts = [];
    message.conditions.sortBy.forEach((value) => {
      let desc = value.charAt(0) === '-';
      switch (value.slice(1)) {
        case 'cn':
          sorts.push(getFn('capacityNumber', desc));
          break;
        case 'ca':
          sorts.push(getFn('capacity', desc));
          break;
        case 'nu':
          sorts.push(getFn('number', desc));
          break;
        case 'nc':
          sorts.push(getFn('numberCapacity', desc));
          break;
        case 'cr':
          sorts.push(getFn('credit', desc));
          break;
        default:
          sorts.push((row1, row2) => {
            return (`${row1['course_id']}-${row1['teacher_id']}`.localeCompare(
              `${row2['course_id']}-${row2['teacher_id']}`,
            )) * (desc ? -1 : 1);
          });
      }
    });
    rows.sort((row1, row2) => {
      for (let i = 0, len = sorts.length; i < len; i++) {
        let result = sorts[i](row1, row2);
        if (result !== 0) {
          return result;
        }
      }
      return 0;
    });
  }
  return rows;
});
