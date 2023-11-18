import { getCollegesList, getMajorsList, getLessonPropertiesList } from "shu-course-number-parser";

export const GetCourseClassListMixin = {
  methods: {
    getCollegesList: (p) => getCollegesList(p).filter((v) => v.name !== ""),
    getMajorsList: (v, p) => getMajorsList(v, p),
    getLessonPropertiesList: () => getLessonPropertiesList(),
  }
}
