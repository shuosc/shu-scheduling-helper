<template>
  <div class="course-color" :style="style"></div>
</template>

<script>
  import {CourseColorMixin} from '../../../../mixins/ReservedClassesList';

  export default {
    name: 'CourseColor',
    props: {
      courseId: {
        type: String,
      },
      courseName: {
        type: String,
      },
      seed: {
        type: Number,
        default: 0,
      },
    },
    mixins: [CourseColorMixin],
  };
</script>

<style scoped>
  .course-color {
    position: absolute;
    display: block;
    height: 15px;
    width: 8px;
    top: 16px;
  }
</style>
