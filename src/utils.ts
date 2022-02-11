import { ExtendedCourseKey } from './app/types';

export const compileSearchRegExp = (search: string) =>
  new RegExp(
    search
      .replace(/^s+|s+$/g, '')
      .split(/\s+/g)
      .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('.*'),
    'i'
  );

export const getCourseKeyStr = (course: ExtendedCourseKey) =>
  JSON.stringify([course.termId, course.courseId, course.teacherId]);

export const filterAssign = <T extends object>(target: object, ...sources: object[]): T =>
  Object.assign(
    target,
    ...sources.map((x) =>
      Object.entries(x)
        .filter(([, value]) => value !== undefined)
        .reduce((obj, [key, value]) => {
          obj[key] = value;
          return obj;
        }, {} as any)
    )
  );
