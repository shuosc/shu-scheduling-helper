<template>
  <div :style="style" class="course-color"></div>
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
    top: 38px;
    left: 42px;
    display: block;
    width: 8px;
    height: 8px;
    border-radius: 8px;
  }
</style>
