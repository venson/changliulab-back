<template>
  <KeepAlive>
    <n-card>
      <n-form label-placement="left" label-width="60" inline>
        <n-grid>
          <n-form-item-gi label="Title" :span="12">
            <n-input v-model:value="activity.title" />
          </n-form-item-gi>
          <n-form-item-gi :span="6" label="Date">
            <n-date-picker v-model:value="activityDate" type="date" />
          </n-form-item-gi>
          <n-form-item-gi :span="6" label="Author">
            <!-- <n-select :options="authorList" v-model:value="author" :consistent-menu-width="false" /> -->
            <n-select
              :options="allMemberList"
              v-model:value="activity.authorMemberId"
              filterable
              label-field="name"
              value-field="id"
              @update:value="handleMemberSelectUpdate"
              :consistent-menu-width="false"
            />
          </n-form-item-gi>
        </n-grid>
      </n-form>
      <MdEditor
        v-model:model-value="activity.markdown"
        @html="saveActivity"
        :edit-enable="activity.id !== undefined"
        :request-enable="true"
        @request="requestReview"
      />
      <ReviewModal v-model:show="showModalFlag" :review="reviewModal" @action="handleAction" />
    </n-card>
  </KeepAlive>
</template>

<script setup lang="ts">
  import { useRoute } from 'vue-router';
  import { MdEditor } from '@/components/MdEditor';
  import {
    ActivityInterface,
    MemberInterface,
    ReviewAction,
    ReviewModalInterface,
    ReviewStatus,
    ReviewType,
    ReviewVo,
  } from '@/common/types';
  import { computed, onMounted, ref } from 'vue';
  import { addActivity, getActivityById, updateActivity } from '@/api/edu/activity';
  import { getAllFormalMembers } from '@/api/edu/member';
  import { SelectOption, useMessage } from 'naive-ui';
  import { ReviewModal } from '@/components/ReviewModal';
  import { useUserStore } from '@/store/modules/user';
  import { doReviewAction } from '@/api/edu/review';
  import { SelectBaseOption } from 'naive-ui/lib/select/src/interface';
  const userStore = useUserStore();
  const route = useRoute();
  const authorList = ref<SelectOption[]>([]);
  const message = useMessage();
  const activity = ref<ActivityInterface>({
    title: '',
    activityDate: '2023-1-1',
    authorMemberId: '',
    authorMemberName: '',
  });
  const activityId = route.params.id as string;
  const showModalFlag = ref(false);
  const reviewVo = ref<ReviewVo>({
    userId: userStore.info.id,
    userName: userStore.info.username,
    msg: '',
    type: ReviewType.ACTIVITY,
  });
  const reviewModal = computed<ReviewModalInterface>(() => {
    return {
      title: '',
      action: reviewVo.value.action,
      type: reviewVo.value.type,
    };
  });
  const activityDate = computed({
    get: () => {
      const date = new Date(activity.value.activityDate);
      return date.getTime();
    },
    set: (val: number) => {
      const date = new Date(val);
      const dateString = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
      activity.value.activityDate = dateString;
      console.log(dateString);
    },
  });
  const allMemberList = ref<MemberInterface[]>([]);
  const fetchData = () => {
    if (activityId) {
      getActivityById(activityId).then((res) => {
        activity.value = res;
        // console.log('activity', res);
      });
    }
    getAllFormalMembers('current').then((res: MemberInterface[]) => {
      console.log(res);
      allMemberList.value = res;
      res.forEach((element: MemberInterface) => {
        authorList.value.push({
          label: element.name,
          value: element.id + '$' + element.name,
        });
      });
      console.log('list', authorList.value);
    });
  };
  const saveActivity = (html: string) => {
    activity.value.htmlBrBase64 = html;
    // console.log('activity', activity.value);
    if (activity.value.id) {
      updateActivity(activity.value).then(() => {
        message.success('Activity Saved');
      });
    } else {
      console.log('add');
      addActivity(activity.value).then((res) => {
        message.success('Activity added');
        activity.value.id = res;
      });
    }
  };
  const requestReview = () => {
    if (activity.value.id) {
      reviewVo.value.id = activity.value.id;
      reviewVo.value.from = activity.value.review ? activity.value.review : ReviewStatus.NONE;
      reviewVo.value.to = ReviewStatus.APPLIED;
      reviewVo.value.action = ReviewAction.REQUEST;
      reviewModal.value.title = activity.value.title;
      showModalFlag.value = true;
    } else {
      message.error('Please save, then request review');
    }
    showModalFlag.value = true;
  };
  const handleAction = (msg: string) => {
    reviewVo.value.msg = msg;
    doReviewAction(reviewVo.value).then(() => {
      message.success(`Review applied for ${reviewModal.value.type} ${reviewModal.value.title}`);
      fetchData();
      showModalFlag.value = false;
    });
  };
  const handleMemberSelectUpdate = (
    //   {
    //   option,
    // }
    // {
    //   value,
    //   option,
    // }:
    _value: Array<any> | string | number | null,
    option: SelectBaseOption | null | SelectBaseOption[]
  ) => {
    // console.log('value', value);
    // console.log('option', option);
    activity.value.authorMemberName = (option as unknown as MemberInterface).name;
  };
  onMounted(() => {
    fetchData();
  });
</script>

<style>
  .bytemd {
    height: calc(100vh - 250px);
  }
</style>
