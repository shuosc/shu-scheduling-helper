import { createAction } from '@reduxjs/toolkit';
import { FilterConditions } from './types';

export const initTerms = createAction('saga/initTerms');

export const updateCourses = createAction('saga/updateCourses');

export interface SwitchActiveTermArg {
  termId: string;
}

export const switchActiveTerm = createAction<SwitchActiveTermArg>('saga/switchActiveTerm');

export const filterCourses = createAction('saga/filterCourses');

export interface LoadCourseDetailsArg {
  offset: number;
  limit: number;
}

export const loadCourseDetails = createAction<LoadCourseDetailsArg>('saga/loadCourseDetails');

export const changeFilterConditions = createAction<Partial<FilterConditions>>('saga/changeFilterConditions');
