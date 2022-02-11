import Dexie from 'dexie';
import constants from '../constants';
import { BaseTerm, Course, DbApi, ExtendedCourseKey, Term } from '../types';

// 数据管理模块内部实现使用的类型

namespace DbTerm {
  export interface StarredCourse {
    teacherIds: string[];
    selected: boolean; // = teacherIds 的首个 id 对应课程为已选状态
  }

  export interface ToppingRule {
    courseId: string;
    teacherId: string;
    day: number;
    week: number;
    startMinutes: number;
  }
}

interface DbTerm extends Term {
  starredCourses: Record<string, DbTerm.StarredCourse>;
  toppingRules: DbTerm.ToppingRule[];
}

interface DbCourse extends Course {
  termId: string;
  hash: string;
}

class DexieDb extends Dexie {
  terms!: Dexie.Table<DbTerm, string>;
  courses!: Dexie.Table<DbCourse, [string, string, string]>;

  constructor() {
    super(constants.DB_NAME);
    this.version(1).stores({
      terms: 'termId',
      courses: '[termId+courseId+teacherId],termId,courseId,teacherId,hash,[termId+courseId]',
    });
  }
}

const createDb = (): DbApi => {
  const db = new DexieDb();

  return {
    getTerms: async () => {
      const dbTerms = await db.terms.orderBy('termId').reverse().toArray();

      return dbTerms.map((item) => ({
        termId: item.termId,
        termName: item.termName,
        backendOrigin: item.backendOrigin,
        isCurrent: item.isCurrent,
        updateTimeMs: item.updateTimeMs,
        hash: item.hash,
        upToDate: item.upToDate,
      }));
    },

    updateTerms: async (terms, current) => {
      const newTerms: (BaseTerm | null)[] = [...terms];
      await db.transaction('rw', db.terms, async () => {
        await db.terms.toCollection().modify((value, ref) => {
          const termIdx = newTerms.findIndex((item) => item?.termId === value.termId);
          if (termIdx >= 0) {
            const term = terms[termIdx];
            newTerms[termIdx] = null;
            Object.assign(
              ref.value,
              term,
              { isCurrent: current.includes(term.termId) },
              value.hash !== term.hash ? { upToDate: false } : undefined
            );
          } else {
            // @ts-ignore
            delete ref.value;
          }
        });
        await db.terms.bulkAdd(
          newTerms
            .filter((item): item is BaseTerm => !!item)
            .map((item) => ({
              ...item,
              isCurrent: current.includes(item.termId),
              upToDate: false,
              starredCourses: {},
              toppingRules: [],
            }))
        );
      });
    },

    updateCourses: async (courses, termId, hash) => {
      await db.transaction('rw', db.terms, db.courses, async (tx) => {
        await db.courses.bulkPut(
          courses.map((item) => ({
            ...item,
            termId,
            hash,
          }))
        );

        const term = await db.terms.get(termId);
        if (!term) {
          tx.abort();
          return;
        }

        const selectedCourseKeys = Object.keys(term.starredCourses)
          .filter((key) => term.starredCourses[key].selected && term.starredCourses[key].teacherIds.length > 0)
          .map((key) => ({
            courseId: key,
            teacherId: term.starredCourses[key].teacherIds[0],
          }));

        await db.courses
          .where('termId')
          .equals(termId)
          .modify((value, ref) => {
            if (
              value.hash !== hash &&
              !selectedCourseKeys.some(
                ({ courseId, teacherId }) => courseId === value.courseId && teacherId === value.teacherId
              )
            ) {
              // @ts-ignore
              delete ref.value;
            }
          });

        await db.terms.update(termId, { upToDate: true });
      });
    },

    listFilteredCourses: async (termId, hash, where, sortBy) => {
      const result: {
        key: ExtendedCourseKey;
        sortBy: (number | string)[];
      }[] = [];

      await db.courses
        .where('termId')
        .equals(termId)
        .filter((course) => course.hash === hash)
        .each((course) => {
          if (where.every((whereFn) => whereFn(course))) {
            result.push({
              key: {
                termId: course.termId,
                courseId: course.courseId,
                teacherId: course.teacherId,
              },
              sortBy: sortBy.map((sortByFn) => sortByFn(course)).concat(course.courseId, course.teacherId),
            });
          }
        });

      result.sort((itemA, itemB) => {
        for (let i = 0; i < sortBy.length; i++) {
          if (itemA.sortBy[i] > itemB.sortBy[i]) return 1;
          else if (itemA.sortBy[i] < itemB.sortBy[i]) return -1;
        }
        return 0;
      });

      return result.map((item) => item.key);
    },

    getCourseDetails: async (keys) => {
      const items = await db.courses.bulkGet(keys.map((key) => [key.termId, key.courseId, key.teacherId]));
      return items.map((item) => item || null);
    },
  };
};

let dbInstance: DbApi | undefined;

const getDb = (): DbApi => {
  if (!dbInstance) {
    dbInstance = createDb();
  }
  return dbInstance;
};

export default getDb;
