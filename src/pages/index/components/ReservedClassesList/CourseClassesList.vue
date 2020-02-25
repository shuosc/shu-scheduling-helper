<template>
  <a-list size="small" class="classes-list" :data-source="classesKeys">
    <a-list-item
      class="selected-class-list-item"
      slot="header"
      v-if="selectedClassKey !== null && expanded"
    >
      <a-list-item-meta :description="course.classes[selectedClassKey].classTime">
        <template slot="title">{{ course.classes[selectedClassKey].teacherName }}
          <small>({{ selectedClassKey }})</small>
        </template>
        <a-avatar slot="avatar" class="selected-avatar">已选</a-avatar>
      </a-list-item-meta>
      <a-button slot="actions" @click="unselectClass">取消选择</a-button>
    </a-list-item>
    <a-list-item
      class="classes-list-item"
      slot="renderItem"
      slot-scope="key"
      @mouseenter="previewClass(key)"
      @mouseleave="cancelPreviewClass(key)"
    >
      <a-button v-if="!isConflicted(key)" type="primary" slot="actions" @click="selectClass(key)">
        选择
      </a-button>
      <a-button v-else type="danger" slot="actions" @click="conflictsSolving(key)">
        解决冲突...
      </a-button>
      <a-button slot="actions" type="dashed" :disabled="storageBusy" @click="doRemoveReservedClass(key)">- 待选</a-button>
      <a-list-item-meta :description="course.classes[key].classTime">
        <template slot="title">{{ course.classes[key].teacherName }}
          <small>({{ key }})</small>
        </template>
      </a-list-item-meta>
    </a-list-item>
  </a-list>
</template>

<script>
  import {conflictSolvingMixin} from '../../../../mixins/common/conflictsSolver';
  import {CourseClassesListMixin} from '../../../../mixins/ReservedClassesList';

  export default {
    name: 'CourseClassesList',
    props: {
      course: {
        type: Object,
      },
      id: {
        type: String,
      },
      expanded: {
        type: Boolean,
      },
    },
    mixins: [conflictSolvingMixin, CourseClassesListMixin],
    methods: {
      doRemoveReservedClass(key) {
        this.removeReservedClass(key);
        this.$message.success('成功移除待选，你可以撤销此操作。');
      },
    },
  };
</script>

<style scoped>
  .classes-list {
    margin: -12px 0 -16px;
  }

  .selected-class-list-item {
    margin: -12px 0;
  }

  /*noinspection CssUnusedSymbol*/
  .selected-avatar >>> .ant-avatar-string {
    transform: scale(0.857143) translateX(-50%) !important;
  }

  /*noinspection CssUnusedSymbol*/
  .ant-list-item-meta-title {
    margin: 0;
  }

  /*noinspection CssUnusedSymbol*/
  .ant-list-item-meta-description {
    font-size: 12px;
  }

  /*noinspection CssUnusedSymbol*/
  .ant-list-item-meta-avatar {
    margin-top: 6px;
  }
</style>
