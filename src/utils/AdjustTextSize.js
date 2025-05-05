// 具体处理逻辑见docs/AdjustTextSize.md
export const TEXT_SIZE_CONFIG = {
  MAX_ITERATIONS: 10,
  INITIAL_STEP_RATIO: 1.0,
  MIN_STEP_RATIO: 0.95,
  MIN_FONT_SIZE: 10,
  MIN_LINE_CHARS: 4,
  COURSE_NAME_PRIORITY: 1.4,
  SAFETY_MARGIN: 2,
  STRICT_SCALING: 0.9
};

export const parseClipPath = clipPathStr => {
  const match = clipPathStr.match(/polygon\((.*)\)/);
  if (!match) return null;
  
  return match[1].split(',').map(point => {
    const clean = point.trim();
    const xMatch = clean.match(/^(0|100|\d+(?:\.\d+)?)%/);
    const yMatch = clean.match(/(0|100|\d+(?:\.\d+)?)%|calc\(100% - (\d+(?:\.\d+)?)px\)/);
    
    if (!xMatch || !yMatch) return null;
    
    const x = parseFloat(xMatch[1]) / 100;
    let y;
    
    if (yMatch[1]) {
      y = parseFloat(yMatch[1]) / 100;
    } else if (yMatch[2]) {
      y = 1 - (parseFloat(yMatch[2]) / 100);
    } else {
      return null;
    }
    
    return [x, y];
  }).filter(Boolean);
};

export const pointInPolygon = (point, polygon) => {
  if (!polygon || polygon.length < 3) return false;
  
  const x = point[0], y = point[1];
  let inside = false;
  
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];
    
    const intersect = ((yi > y) !== (yj > y)) && 
                      (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    
    if (intersect) inside = !inside;
  }
  
  return inside;
};

export const checkShortLastLine = (el, minChars) => {
  const text = el.textContent.trim();
  const words = text.split(/\s+/g);
  
  if (words.length >= 2 && words.slice(-2).join('').length < minChars) return true;

  const range = document.createRange();
  range.selectNodeContents(el);
  const rects = Array.from(range.getClientRects());
  
  if (rects.length > 1) {
    const lastRect = rects[rects.length - 1];
    const avgWidth = el.offsetWidth / text.length;
    return Math.floor(lastRect.width / avgWidth) < minChars;
  }
  
  return false;
};

const generateCheckPoints = rect => {
  const points = [];
  
  // 四个角
  points.push([rect.left, rect.top]);
  points.push([rect.right, rect.top]);
  points.push([rect.right, rect.bottom]);
  points.push([rect.left, rect.bottom]);
  
  // 边缘中点
  points.push([rect.left + rect.width / 2, rect.top]);
  points.push([rect.right, rect.top + rect.height / 2]);
  points.push([rect.left + rect.width / 2, rect.bottom]);
  points.push([rect.left, rect.top + rect.height / 2]);
  //边上其他点
  for (let i = 1; i < 4; i++) {
    points.push([rect.left + (rect.width * i / 4), rect.top]);
    points.push([rect.left + (rect.width * i / 4), rect.bottom]);
    points.push([rect.left, rect.top + (rect.height * i / 4)]);
    points.push([rect.right, rect.top + (rect.height * i / 4)]);
  }
  
  return points;
};

export const adjustAllTextElements = async (vue, elements, course, container) => {
  const cfg = TEXT_SIZE_CONFIG;
  const valid = elements.filter(Boolean);
  
  const nameEls = valid.filter(el => el?.classList?.contains('course-name'));
  const otherEls = valid.filter(el => !el?.classList?.contains('course-name'));
  const ordered = [...nameEls, ...otherEls];

  for (const el of ordered) {
    if (!el) continue;
    
    const isCourseName = el.classList?.contains('course-name');
    Object.assign(el.style, {
      fontSize: '', lineHeight: '', padding: '', 
      whiteSpace: '', overflow: '', textOverflow: '', 
      zIndex: '', outline: ''
    });
    await vue.$nextTick();

    let fontSize = parseFloat(window.getComputedStyle(el).fontSize || cfg.MIN_FONT_SIZE);
    if (isCourseName) fontSize *= cfg.COURSE_NAME_PRIORITY;
    
    let iter = 0;
    let step = cfg.INITIAL_STEP_RATIO;

    while (iter < cfg.MAX_ITERATIONS && fontSize > cfg.MIN_FONT_SIZE) {
      const rect = el.getBoundingClientRect();
      const clipRect = container.getBoundingClientRect();
      const mode = course.clipPathMode;

      if (!mode || mode === 'full') break;

      const style = window.getComputedStyle(container);
      const clipPath = style.clipPath || '';
      const polygon = parseClipPath(clipPath);
      
      if (!polygon) break;

      const normalize = (x, y) => [
        (x - clipRect.left) / clipRect.width,
        (y - clipRect.top) / clipRect.height
      ];

      const checkPoints = generateCheckPoints(rect);
      const hasOverflow = checkPoints.some(([x, y]) => {
        const [nx, ny] = normalize(x, y);
        return !pointInPolygon([nx, ny], polygon);
      });
      
      if (!hasOverflow) break;

      fontSize = Math.max(cfg.MIN_FONT_SIZE, fontSize * cfg.STRICT_SCALING);
      
      el.style.fontSize = `${fontSize}px`;
      el.style.lineHeight = `${fontSize * 1.15}px`;
      el.style.padding = '1px 2px';

      step = Math.max(cfg.MIN_STEP_RATIO, step * 0.95);
      await vue.$nextTick();
      iter++;
    }

    if (fontSize <= cfg.MIN_FONT_SIZE) {
      el.style.whiteSpace = 'normal';
      el.style.wordWrap = 'break-word';
      await vue.$nextTick();

      // 课程名称特殊处理，确保至少显示4个字符
      if (isCourseName) {
        const text = el.textContent.trim();
        const minChars = Math.max(4, cfg.MIN_LINE_CHARS);
        const hasShortLine = checkShortLastLine(el, minChars);
        
        if (hasShortLine || text.length <= minChars) {
          Object.assign(el.style, {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            minWidth: '4em'
          });
          
          if (text.length > 4) {
            const computedStyle = window.getComputedStyle(el);
            const charWidth = parseFloat(computedStyle.width) / text.length;
            el.style.minWidth = `${charWidth * 4}px`;
          }
        } else {
          el.style.overflow = 'visible';
        }
      } else {
        // 非课程名称元素使用原来的逻辑
        const hasShortLine = checkShortLastLine(el, cfg.MIN_LINE_CHARS);
        if (hasShortLine) {
          Object.assign(el.style, {
            whiteSpace: 'nowrap',
            overflow: 'visible',
            textOverflow: 'ellipsis'
          });
        } else {
          el.style.overflow = 'visible';
        }
      }
    }
  }
};

export const shortenCourseNameParts = parts => {
  if (!parts.length) return parts;
  
  const newParts = parts.slice();
  let index = newParts.length - 1;
  let maxLen = 1;
  
  for (let i = newParts.length - 1; i >= 0; i--) {
    if (!/\w|\((?:\w{1,2}|\W)\)/.test(newParts[i])) {
      const len = newParts[i]
        .replace(/^\(/, '')
        .replace(/\)$/, '')
        .replace(/…$/, '')
        .length;
      if (len > maxLen) {
        maxLen = len;
        index = i;
      }
    }
  }
  
  if (maxLen > 1) {
    const part = newParts[index];
    const content = part.match(/[^()]+/)[0];
    
    if (content.length > 4) {
      newParts[index] = part.replace(/[^()]+/, val => 
        `${val.slice(0, 4)}…`);
    } else {
      newParts[index] = part;
    }
  }
  
  return newParts;
};

export const getCourseNameParts = courseName => {
  const parts = [];
  let name = courseName;
  
  while (name.length) {
    const result = /(?:\w|\([^()]+\))$/i.exec(name);
    if (result) {
      parts.unshift(result[0]);
      name = name.slice(0, -result[0].length);
    } else {
      parts.unshift(name);
      name = '';
    }
  }
  
  return parts;
};