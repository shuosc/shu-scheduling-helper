import axios from 'axios';
import constants from './constants';
import { GetManifestRes, GetTermCoursesArg, GetTermDataRes } from './types';

const apiBaseUrl =
  process.env.NODE_ENV === 'development'
    ? process.env.API_BASE_URL || constants.DEFAULT_LOCAL_API_BASE_URL
    : constants.DEFAULT_API_BASE_URL;

const http = axios.create({
  baseURL: apiBaseUrl,
});

const getManifest = () => http.get<GetManifestRes>('manifest');

const getTermCourses = (arg: GetTermCoursesArg) =>
  http.get<GetTermDataRes>(`terms/${encodeURIComponent(arg.termId)}.${encodeURIComponent(arg.hash)}.json`);

const api = {
  getManifest,
  getTermCourses,
};

export default api;
