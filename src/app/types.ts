import { DarkMode, InitStatus, TabKey, UpdateStatus } from './enums';

// 实体类型

export interface TermKey {
  termId: string;
}

export interface BaseTerm extends TermKey {
  termName: string;
  backendOrigin: string;
  hash: string;
  isCurrent: boolean;
  updateTimeMs: number;
}

export interface CourseKey {
  courseId: string;
  teacherId: string;
}

export interface ExtendedCourseKey extends TermKey, CourseKey {}

export interface BaseCourse {
  courseId: string;
  courseName: string;
  teacherId: string;
  teacherName: string;
  campus: string;
  classTime: string;
  credit: string;
}

export interface BaseCourseExtra {
  teacherTitle: string;
  capacity: string;
  number: string;
  position: string;
  limitations: string[];
}

export interface Term extends BaseTerm {
  upToDate: boolean;
}

export interface Course extends BaseCourse, Partial<BaseCourseExtra> {}

// 内部模块 Api 相关类型

export type WhereFn = (course: Course) => boolean;

export type SortByFn = (course: Course) => number | string;

export interface DbApi {
  getTerms(): Promise<Term[]>;

  updateTerms(terms: BaseTerm[], current: string[]): Promise<void>;

  updateCourses(courses: Course[], termId: string, hash: string): Promise<void>;

  listFilteredCourses(termId: string, hash: string, where: WhereFn[], sortBy: SortByFn[]): Promise<ExtendedCourseKey[]>;

  getCourseDetails(keys: ExtendedCourseKey[]): Promise<(Course | null)[]>;
}

// 数据 Api 请求响应类型

export interface GetManifestRes {
  terms: BaseTerm[];
  current: string[];
}

export interface GetTermCoursesArg {
  termId: string;
  hash: string;
}

export type GetTermDataRes = Course[];

// UI 模型

export interface CourseListItem extends ExtendedCourseKey {
  loaded: boolean;
  course: Course | null;
}

// Redux state 类型

export interface FilterConditions {
  courseId: string;
  courseName: string;
  credit: string;
  teacherId: string;
  teacherName: string;
  classTime: string;
  campus: string | null;
  excludeSelected: boolean;
  remainingCapacity: number;
}

export interface State {
  darkMode: DarkMode;
  tabKey: TabKey;
  initStatus: InitStatus;
  updateStatus: UpdateStatus;
  showOptionsPanel: boolean;
  activeTermId: string | null;
  availableTerms: Term[];
  courseKeys: ExtendedCourseKey[];
  courseItems: CourseListItem[];
  courseOffset: number;
  courseLimit: number;
  courseSelection: Record<string, true> | null;
  filterConditions: FilterConditions;
}
