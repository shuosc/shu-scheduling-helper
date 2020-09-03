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
          <NumberCapacity :class-key="`${id}-${selectedClassKey}`" class="number-capacity" slot="actions" />
          <a-divider type="vertical" />
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
        <a-avatar slot="avatar">已选</a-avatar>
      </a-list-item-meta>
      <a-button @click="unselectClass" slot="actions">取消选择</a-button>
    </a-list-item>
    <a-list-item
      class="classes-list-item"
      slot="renderItem"
      slot-scope="key"
    >
      <a-button @click="selectClass(key)" slot="actions" type="primary" v-if="!isConflicted(key)">
        选择
      </a-button>
      <a-button @click="conflictsSolving(key)" slot="actions" type="danger" v-else>
        冲突
      </a-button>
      <a-button :disabled="storageBusy" @click="doRemoveReservedClass(key)" slot="actions" type="dashed">
        - 待选
      </a-button>
      <a-list-item-meta>
        <template slot="title">{{ course.classes[key].teacherName }}
          <small>({{ key }})</small>
        </template>
        <template slot="description">
          <NumberCapacity :class-key="`${id}-${key}`" class="number-capacity" slot="actions" />
          <a-divider type="vertical" />
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
        const h = this.$createElement;
        this.removeReservedClass(key);
        this.$message.success(h('span', ['成功移除待选，你可以在页面下方点击', h('a-icon', {
          props: { type: 'undo' },
          style: {
            color: 'rgba(0, 0, 0, 0.65)',
            position: 'relative',
            fontSize: '1em',
            margin: '0 2px',
            top: '-1px',
          },
        }, []), '按钮撤销此操作。']));
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
</style>
