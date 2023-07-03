import { getLessonCollegeOrMajor, getLessonProperty } from "shu-course-number-parser";

export const GetCoursePropertyMixin = {
  methods: {
    getCourseProperty: (v) => getLessonProperty(v),
    getCourseInfo: (v, showProperty = true) => {
      let out = [];
      if (showProperty) out.push(getLessonProperty(v));
      out.push(getLessonCollegeOrMajor(v, "major"));
      out.push(getLessonCollegeOrMajor(v, "college"));
      out = out.filter(v => v !== '');
      return out.join(", ");
    },
    getLessonCollegeOrMajor: (id, type) => getLessonCollegeOrMajor(id, type),
  },
}