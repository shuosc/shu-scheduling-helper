import murmur from 'murmurhash-js';

const colors = [
  '#D32F2F',
  '#7B1FA2',
  '#303F9F',
  '#1976D2',
  '#689F38',
  '#FBC02D',
  '#FFA000',
  '#F57C00',
  '#E64A19',
  '#5D4037',
];

let colorCache = {};
let colorSeed = 2;

export function getColorSeed() {
  return colorSeed;
}

export function setColorSeed(seed) {
  if (colorSeed !== seed) {
    colorSeed = seed;
    colorCache = {};
    return true;
  } else {
    return false;
  }
}

export function getColor(str, seed) {
  let key = JSON.stringify([str, seed]);
  if (colorCache.hasOwnProperty(key)) {
    return colorCache[key];
  } else {
    return colorCache[key] = colors[murmur(str, seed + colorSeed) % colors.length];
  }
}

let periodsCache = {};

export function getPeriods(str) {
  if (periodsCache.hasOwnProperty(str)) {
    return periodsCache[str];
  } else {
    let pattern = /([一二三四五])(\d+)(?:-(\d+))?/g;
    let result = [];
    let execResult = pattern.exec(str);
    while (execResult !== null) {
      let from = parseInt(execResult[2]), to = execResult[3] != null ? parseInt(execResult[3]) : from;
      if (from >= 1 && from <= 13 && to >= 1 && to <= 13 && from <= to) {
        for (let i = from; i <= to; i++) {
          result.push([i - 1, ['一', '二', '三', '四', '五'].indexOf(execResult[1]), i === from, to - from + 1]);
        }
      }
      execResult = pattern.exec(str);
    }
    return periodsCache[str] = result;
  }
}

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
      // 已待选判断
      if (reserved.hasOwnProperty(currentRowsMap[key]['course_id']) && reserved[currentRowsMap[key]['course_id']].classes.hasOwnProperty(currentRowsMap[key]['teacher_id'])) {
        // 现在还有判断
        if (rowsMap.hasOwnProperty(key)) {
          if (selected.hasOwnProperty(currentRowsMap[key]['course_id']) && selected[currentRowsMap[key]['course_id']].teacherId === currentRowsMap[key]['teacher_id'] && currentRowsMap[key]['class_time'] !== rowsMap[key]['class_time']) {
            getPeriods(rowsMap[key]['class_time']).forEach((period) => {
              let cell = timeTable[period[0]][period[1]];
              if (cell != null && cell.courseId !== rowsMap[key]['course_id']) {
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
  for (let i = 0; i < 13; i++) {
    rows.push([null, null, null, null, null]);
  }
  let edges = []; // 相邻课程色彩相同则构成一条"边"
  const addNeighborToEdges = (row, col, courseId, color, usedVectors) => {
    if (row < 0 || row >= 13 || col < 0 || col >= 5) {
      return true;
    }
    let neighbor = rows[row][col];
    if (neighbor !== null) {
      if (neighbor !== courseId) {
        selectedClasses[courseId].excludedColors[selectedClasses[neighbor].themeColor] = true;
        selectedClasses[neighbor].excludedColors[color] = true;
      }
      let isEdge = neighbor !== courseId && selectedClasses[neighbor].themeColor === color;
      if (isEdge && !usedVectors.hasOwnProperty(neighbor)) {
        edges.push(`${courseId}-${neighbor}`);
        usedVectors[neighbor] = true;
      }
    }
  };
  const addNeighborsToEdges = (period, courseId, color, usedVectors) => {
    addNeighborToEdges(period[0] - 1, period[1], courseId, color, usedVectors);
    addNeighborToEdges(period[0] + 1, period[1], courseId, color, usedVectors);
    addNeighborToEdges(period[0], period[1] - 1, courseId, color, usedVectors);
    addNeighborToEdges(period[0], period[1] + 1, courseId, color, usedVectors);
  };
  for (let courseId in selectedClasses) {
    if (selectedClasses.hasOwnProperty(courseId)) {
      let teacherId = selectedClasses[courseId].teacherId;
      let courseName = reservedClasses[courseId].courseName;
      selectedClasses[courseId].periods = getPeriods(reservedClasses[courseId].classes[teacherId].classTime);
      selectedClasses[courseId].colorSeed = 0;
      selectedClasses[courseId].usedVectors = {}; // 防止重复添加边
      selectedClasses[courseId].excludedColors = {}; // 再选时被排除的色彩
      selectedClasses[courseId].cost = selectedClasses[courseId].periods.length;
      selectedClasses[courseId].themeColor = getColor(courseName, selectedClasses[courseId].colorSeed);
      selectedClasses[courseId].periods.forEach((period) => {
        rows[period[0]][period[1]] = courseId;
        addNeighborsToEdges(period, courseId, selectedClasses[courseId].themeColor, selectedClasses[courseId].usedVectors);
      });
      if (Object.keys(selectedClasses[courseId].excludedColors).length >= colors.length) {
        selectedClasses[courseId].cost += 10000;
      }
      selectedClasses[courseId].cost *= 100000000;
      selectedClasses[courseId].cost += 100000000 - parseInt(courseId);
    }
  }
  edges.sort();
  // Uniform-Cost Search寻找变化面积最小色彩调整方案
  let frontier = []; // 模拟优先队列
  let explored = {}; // 被访问过的结点
  let path = '';
  let node = edges.join(',');
  frontier.push([node, 0, '']);

  let loopCount = 0;
  while (node !== '') {
    // 无解情况强行中断
    if (++loopCount > 300) {
      break;
    }
    frontier.sort((a, b) => a[1] - b[1]);
    let front = frontier.shift();
    let cost = front[1];
    let neighbors = {};
    node = front[0];
    path = front[2];
    explored[node] = true;
    node.split(/[-,]/).forEach((courseId) => {
      if (courseId.length === 8) {
        neighbors[courseId] = selectedClasses[courseId].cost;
      }
    });
    for (let courseId in neighbors) {
      if (neighbors.hasOwnProperty(courseId) && !explored.hasOwnProperty(courseId)) {
        let newNode = [];
        for (let i = 0; i < node.length; i += 18) {
          if (node.substr(i, 8) !== courseId && node.substr(i + 9, 8) !== courseId) {
            newNode.push(node.substr(i, 17));
          }
        }
        newNode.sort();
        frontier.push([newNode.join(','), cost + neighbors[courseId], path + (path === '' ? '' : ',') + courseId]);
      }
    }
  }
  if (path !== '') {
    let changeList = path.split(',');
    changeList.sort();
    changeList.forEach((courseId) => {
      selectedClasses[courseId].periods.forEach((period) => {
        addNeighborsToEdges(period, courseId, selectedClasses[courseId].themeColor, selectedClasses[courseId].usedVectors);
      });
      if (Object.keys(selectedClasses[courseId].excludedColors).length < colors.length) {
        while (selectedClasses[courseId].excludedColors.hasOwnProperty(selectedClasses[courseId].themeColor)) {
          selectedClasses[courseId].colorSeed++;
          selectedClasses[courseId].themeColor = getColor(reservedClasses[courseId].courseName, selectedClasses[courseId].colorSeed);
        }
      }
    });
  }
  for (let courseId in selectedClasses) {
    if (selectedClasses.hasOwnProperty(courseId)) {
      delete selectedClasses[courseId].colorSeed;
      delete selectedClasses[courseId].usedVectors;
      delete selectedClasses[courseId].excludedColors;
      delete selectedClasses[courseId].cost;
    }
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

export const isMacLike = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
