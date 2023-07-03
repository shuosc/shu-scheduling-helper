import { getCollegesList, getMajorsList, getLessonPropertiesList } from "shu-course-number-parser";

export const GetCourseClassListMixin = {
  methods: {
    getCollegesList: (p) => getCollegesList(p),
    getMajorsList: (v, p) => getMajorsList(v, p),
    getLessonPropertiesList: () => getLessonPropertiesList(),
  }
}
