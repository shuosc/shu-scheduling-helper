<template>
  <component 
    :is="cardComponent" 
    :course="course" 
    :venue="venue" 
    :capturing="capturing" 
    :theme="theme"
    @click.native="$emit('click')"
  />
</template>

<script>
export default {
  name: 'ClassCard',
  components: {
    'ClassCard.Single': () => import('./ClassCard.Single.vue'),
    'ClassCard.Double': () => import('./ClassCard.Double.vue')
  },
  props: {
    course: {
      type: Object,
      required: true
    },
    venue: {
      type: Boolean,
      default: false
    },
    capturing: {
      type: Boolean,
      default: false
    },
    theme: {
      type: String,
      required: true
    }
  },
  computed: {
    cardComponent() {
      if (this.course.clipPathMode === 'bottom-right') {
        return 'ClassCard.Double';
      }
      return 'ClassCard.Single';
    }
  }
};
</script>