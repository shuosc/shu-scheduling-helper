export const conflictSolvingMixin = {
  methods: {
    showConflictsSolvingDialog(row, conflicts) {
      const h = this.$createElement;
      let cancelKeys = [];
      let content = [h('div', {
        'class': {'conflict-list-hint': true},
      }, '以下课程和待选的课程冲突，请先取消选择。')];
      let modal = this.$confirm({
        icon: 'warning',
        title: '请勾选要取消选择的课程：',
        okText: '解决冲突',
        okType: 'danger',
        okButtonProps: {
          props: {
            disabled: true,
          },
        },
        cancelText: '取消',
        onOk: async () => {
          if (cancelKeys.indexOf(false) < 0) {
            let data = {
              unselect: [],
              select: row,
            };
            cancelKeys.forEach((cancelKey) => {
              data.unselect.push({
                course_id: cancelKey,
              });
            });
            await this.$store.dispatch('unselectClassesThenSelect', data);
            this.$store.commit('OPEN_COURSE_ID', null);
            this.$success({
              title: '冲突解决完毕，已选择以下课程：',
              content: h('p', {
                'class': {'conflict-list-class-meta': true},
              }, [
                `${row['course_name']} `,
                h('small', `(${row['course_id']})`),
                h('br'),
                `${row['teacher_name']} `,
                h('small', `(${row['teacher_id']})`),
                h('a-divider', {
                  props: {type: 'vertical'},
                }),
                h('span', {
                  'class': {'conflict-list-class-meta-time': true},
                }, row['class_time']),
              ]),
              okText: '确定',
            });
          }
        },
      });
      let conflictsCourseIdsList = Object.keys(conflicts);
      conflictsCourseIdsList.sort();
      conflictsCourseIdsList.forEach((courseId, index) => {
        cancelKeys.push(false);
        // noinspection JSUnusedGlobalSymbols
        content.push(h('a-checkbox', {
          'class': {'conflict-solving-list-class-meta-wrapper': true},
          on: {
            change: (event) => {
              cancelKeys[index] = event.target.checked ? courseId : false;
              // noinspection JSCheckFunctionSignatures
              modal.update({
                okButtonProps: {
                  props: {
                    disabled: cancelKeys.indexOf(false) >= 0,
                  },
                },
              });
            },
          },
        }, [
          h('span', {
            'class': {'conflict-solving-list-class-meta': true},
          }, [
            `${this.$store.state.reservedClasses[courseId].courseName} `,
            h('small', `(${courseId})`),
          ]),
        ]));
      });
      modal.update({
        content: h('div', content),
      });
    },
  },
};
