<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <n-card>
    <div class="flex flex-row">
      <div class="w-1/2">
        <n-tree
          default-expand-all
          draggable
          key-field="id"
          label-field="title"
          :data="subjects"
          @drop="handleDrop"
          :render-label="renderLabel"
          :render-suffix="renderSuffix"
        />
      </div>
      <div>
        <n-form>
          <n-form-item label="Title">
            <n-input v-model:value="current.title" />
          </n-form-item>
          <n-form-item>
            <n-button @click="saveSubjects">Save</n-button>
          </n-form-item>
        </n-form>
      </div>
    </div>
  </n-card>
</template>

<script setup lang="ts">
  import { h, onMounted, ref } from 'vue';
  import { getAllSubject, updateSubject } from '@/api/edu/subject';
  import { useDialog, useMessage } from 'naive-ui';
  import { SubjectInterface } from '@/common/types';
  import { NButton, TreeOption } from 'naive-ui';
  const dialog = useDialog();
  const message = useMessage();
  const current = ref<SubjectInterface>({ id: '', title: '' });
  const subjects = ref<SubjectInterface[]>([]);
  //   const subjects = reactive<SubjectInterface[]>([]);
  const fetchData = () => {
    getAllSubject().then((res) => {
      subjects.value = res;
      console.log(res);
    });
  };
  //   const fetchData = () => {
  //     getAllSubject().then((res) => {
  //       subjects.value = res;
  //     });
  //   };
  const findSiblingsAndIndex = (
    node: TreeOption,
    nodes?: SubjectInterface[]
  ): [SubjectInterface[], number] | [null, null] => {
    // console.log(node.key);
    if (!nodes) return [null, null];
    for (let i = 0; i < nodes.length; ++i) {
      const l1Nodes = nodes[i];
      if (node.level === 1 && l1Nodes.id === node.id) return [nodes, i];
      if (node.level === 2 && l1Nodes.children && l1Nodes.children.length > 0) {
        const index = l1Nodes.children.findIndex((item) => item.id === node.id);
        if (l1Nodes.children && index != -1) return [l1Nodes.children, index];
      }
      //   const [siblings, index] = findSiblingsAndIndex(node, siblingNode.children);
      //   if (siblings && index !== null) return [siblings, index];
    }
    return [null, null];
  };
  const handleDrop = (data: {
    node: TreeOption;
    dragNode: TreeOption;
    dropPosition: 'before' | 'inside' | 'after';
    event: DragEvent;
  }) => {
    if (data.dropPosition === 'inside') {
      const [dragNodeSiblings, dragNodeIndex] = findSiblingsAndIndex(data.dragNode, subjects.value);
      console.log(dragNodeSiblings, dragNodeIndex);
      if (dragNodeSiblings === null || dragNodeIndex === null) return;
      dragNodeSiblings.splice(dragNodeIndex, 1);
      data.dragNode.update = true;
      if (data.node.children) {
        // data.dragNode.update = true;
        data.node.children.unshift(data.dragNode);
      } else {
        data.node.children = [data.dragNode];
      }
      // console.log(data);
      // console.log(data.node);
      // console.log(data.dragNode);
      // console.log(data.dropPosition);
    }
  };
  const saveSubjects = () => {
    updateSubject(subjects.value).then(() => {
      message.success('Update success');
    });
  };
  const renderLabel = ({ option }: { option: TreeOption }) => {
    return option.remove
      ? h('span', { class: 'line-through' }, `${option.title}`)
      : h('span', `${option.title}`);
  };

  const renderSuffix = ({ option }: { option: TreeOption }) => {
    return [
      option.level === 1
        ? h(
            NButton,
            {
              class: 'px-1',
              onClick() {
                let newSubject = ref<SubjectInterface>({
                  id: '',
                  title: 'Please Edit',
                  addnew: true,
                });
                option.children?.push(newSubject.value);
                current.value = newSubject.value;
              },
              text: true,
              type: 'primary',
            },
            { default: () => 'Add' }
          )
        : null,
      //   option.level === 1
      h(
        NButton,
        {
          class: 'px-1',
          text: true,
          onClick() {
            current.value = option as unknown as SubjectInterface;
            option.update = true;
          },
          type: 'primary',
        },
        { default: () => 'Edit' }
      ),
      h(
        NButton,
        {
          class: 'px-1',
          onClick() {
            dialog.create({
              type: `${option.remove ? 'success' : 'error'}`,
              title: `${option.remove ? 'Undo' : 'Delete'}`,
              content: `${option.remove ? 'Undo' : 'Delete'} subject ${option.title}`,
              positiveText: `${option.remove ? 'Undo' : 'Delete'}`,
              negativeText: 'Cancel',
              onPositiveClick: () => {
                if (option.level === 1 && option.children && !option.remove) {
                  option.children.forEach((element) => {
                    if (!element.remove) {
                      message.error('The Subject has sub subject');
                      return;
                    }
                  });
                } else {
                  option.remove = !option.remove;
                }
              },
              onNegativeClick: () => {},
            });
          },
          text: true,
          type: 'primary',
        },
        { default: () => (option.remove ? 'Undo' : 'Delete') }
      ),
      // : null,
    ];
  };
  onMounted(() => {
    fetchData();
  });
</script>

<style scoped></style>
