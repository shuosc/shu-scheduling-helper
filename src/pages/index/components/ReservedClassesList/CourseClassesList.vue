<template>
  <a-list :data-source="shownClassesKeys" class="classes-list" size="small">
    <a-list-item
      class="selected-class-list-item"
      slot="header"
      v-if="selectedClassKey !== null && expanded"
    >
      <a-list-item-meta>
        <template slot="title">{{ course.classes[selectedClassKey].teacherName }}
          <small>({{ selectedClassKey }})</small>
        </template>
        <template slot="description">
          {{ course.classes[selectedClassKey].classTime }}
          <a-divider type="vertical" />
          {{ course.classes[selectedClassKey].campus }}
          <a-divider type="vertical" />
          {{ $store.getters.extra(`${id}-${selectedClassKey}`).venue }}
          <br
            v-if="($store.getters.extra(`${id}-${selectedClassKey}`).date && $store.getters.extra(`${id}-${selectedClassKey}`).date !== '不开') || $store.getters.extra(`${id}-${selectedClassKey}`).limitations.length > 0" />
          <a-tag
            class="limitation-tag"
            key="date"
            v-if="$store.getters.extra(`${id}-${selectedClassKey}`).date && $store.getters.extra(`${id}-${selectedClassKey}`).date !== '不开'"
          >
            <a-icon type="calendar" />
            <a-divider type="vertical" />
            <span>{{ $store.getters.extra(`${id}-${selectedClassKey}`).date }}</span>
          </a-tag>
          <a-tag
            :key="index"
            class="limitation-tag"
            v-for="(limitation, index) in $store.getters.extra(`${id}-${selectedClassKey}`).limitations"
          >
            {{ limitation }}
          </a-tag>
        </template>
        <a-avatar class="selected-avatar" slot="avatar">已选</a-avatar>
      </a-list-item-meta>
      <NumberCapacity :class-key="`${id}-${selectedClassKey}`" class="number-capacity" slot="actions" />
      <a-button @click="unselectClass" slot="actions">取消选择</a-button>
    </a-list-item>
    <a-list-item
      @mouseenter="previewClass(key)"
      @mouseleave="cancelPreviewClass(key)"
      class="classes-list-item"
      slot="renderItem"
      slot-scope="key"
    >
      <NumberCapacity :class-key="`${id}-${key}`" class="number-capacity" slot="actions" />
      <a-button @click="selectClass(key)" slot="actions" type="primary" v-if="!isConflicted(key)">
        选择
      </a-button>
      <a-button @click="conflictsSolving(key)" slot="actions" type="danger" v-else>
        冲突
      </a-button>
      <a-button :disabled="storageBusy" @click="doRemoveReservedClass(key)" slot="actions" type="dashed">- 待选</a-button>
      <a-list-item-meta>
        <template slot="title">{{ course.classes[key].teacherName }}
          <small>({{ key }})</small>
          <a-icon class="previewing" type="eye" />
        </template>
        <template slot="description">
          {{ course.classes[key].classTime }}
          <a-divider type="vertical" />
          {{ course.classes[key].campus }}
          <a-divider type="vertical" />
          {{ $store.getters.extra(`${id}-${key}`).venue }}
          <br
            v-if="($store.getters.extra(`${id}-${key}`).date && $store.getters.extra(`${id}-${key}`).date !== '不开') || $store.getters.extra(`${id}-${key}`).limitations.length > 0" />
          <a-tag
            class="limitation-tag"
            key="date"
            v-if="$store.getters.extra(`${id}-${key}`).date && $store.getters.extra(`${id}-${key}`).date !== '不开'"
          >
            <a-icon type="calendar" />
            <a-divider type="vertical" />
            <span>{{ $store.getters.extra(`${id}-${key}`).date }}</span>
          </a-tag>
          <a-tag
            :key="index"
            class="limitation-tag"
            v-for="(limitation, index) in $store.getters.extra(`${id}-${key}`).limitations"
          >
            {{ limitation }}
          </a-tag>
        </template>
      </a-list-item-meta>
    </a-list-item>
  </a-list>
</template>

<script>
  import { conflictSolvingMixin } from '../../../../mixins/common/conflictsSolver';
  import { CourseClassesListMixin } from '../../../../mixins/ReservedClassesList';
  import NumberCapacity from './NumberCapacity';


  export default {
    name: 'CourseClassesList',
    components: { NumberCapacity },
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
      hideConflict: {
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

  .number-capacity {
    cursor: auto;
  }

  .limitation-tag {
    margin-top: 2px;
  }

  .previewing {
    font-size: 12px;
    position: absolute;
    display: none;
    margin: 6px 0 0 5px;
    color: #64b5f6;
  }

  .classes-list-item:hover .previewing {
    display: inline;
  }
</style>
