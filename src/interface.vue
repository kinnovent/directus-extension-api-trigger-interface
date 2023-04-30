<template>
  <div
    class="trigger-list"
    :class="[layout]"
  >
    <v-button
      v-for="(trigger, index) in triggers"
      :key="index"
      class="action"
      :class="[trigger.type]"
      :loading="loadings[index].value"
      :disabled="disableds[index]"
      :secondary="trigger.type !== 'primary'"
      v-bind="{ [trigger.size]: true }"
      @click="onClick({method:trigger.method, url:parsedUrls[index], params:trigger.params, updateField:trigger.updateField, index})"
    >
      <v-icon
        v-if="trigger.icon"
        left
        :name="trigger.icon"
      />
      <span v-if="trigger.label">{{ trigger.label }}</span>
    </v-button>
  </div>
</template>
  
  <script lang="ts">
import {
  computed,
  defineComponent,
  inject,
  PropType,
  ref,
  ComputedRef,
} from "vue";
import { useRouter } from "vue-router";
import { useApi, useStores, useCollection } from "@directus/extensions-sdk";
import { Filter } from "@directus/shared/types";
import { render } from "micromustache";
import { checkConditions } from "./check-conditions";

import { toRaw } from "@vue/reactivity";
// import { json } from "express";

type Trigger = {
  label: string;
  size: string;
  type: string;
  icon: string;
  url: string;
  params: string; //请求参数
  method: string;
  updateField: string; //需要更新的表单字段
  disabledConditions: Filter;
  successText: string;
  errorText: string;
  loadingText: string;
  dialog: boolean;
  reload: boolean;
};

export default defineComponent({
  props: {
    triggers: {
      type: Array as PropType<Trigger[]>,
      default: null,
    },
    layout: {
      type: String,
      default: "vertical",
    },
    collection: {
      type: String,
      default: "",
    },
    field: {
      type: String,
      default: null,
    },
    primaryKey: {
      type: [String, Number],
      default: "",
    },
  },
  emits: ["input", "setFieldValue"],

  setup(props, { emit }) {
    const defaultValues = useCollection(props.collection).defaults;

    const api = useApi();
    const { useNotificationsStore } = useStores();
    const store = useNotificationsStore();
    const router = useRouter();

    const values = inject("values", ref<Record<string, any>>({}));

    const parsedUrls = computed(() =>
      props.triggers.map((trigger) => render(trigger.url ?? "", values.value))
    );
    const disableds = computed(() =>
      props.triggers.map(
        (trigger) =>
          trigger.disabledConditions &&
          checkConditions(values.value, trigger.disabledConditions)
      )
    );

    const loadings = props.triggers.map(() => ref(false));

    return { loadings, parsedUrls, disableds, onClick };

    async function onClick({ method, url, params, updateField, index }) {
      const loading = loadings[index];
      if (!loading) return;
      let newParams = {};
      if (params) {
        // 表单校验
        const defaultValuesObject = toRaw(defaultValues.value);
        const newObject = Object.assign({}, defaultValuesObject, values.value);
        console.log(params, newObject);
        params.split(",").forEach((key) => {
          newParams[key] = newObject[key] || null;
        });

        if (Object.values(newParams).some((item) => !item)) {
          return store.add({
            title: "表单存在空值，请填写完整再尝试！",
            type: "error",
            dialog: props.triggers[index]?.dialog,
          });
        }
      }
      // 加载提示
      loading.value = true;
      let loadingStore;
      if (props.triggers[index]?.loadingText) {
        loadingStore = store.add({
          title: props.triggers[index]?.loadingText,
          type: "info",
          dialog: props.triggers[index]?.dialog,
        });
      }
      // 发起请求
      try {
        const config =
          method === "GET"
            ? { method, url, params: newParams }
            : { method, url, data: newParams };
        const { data } = await api.request(config);
        // 更新表单
        console.log("updateField",updateField)
        if (updateField) {
          updateField.split(",").forEach((key: string) => {
            console.log("key",key,data[key])
            setTimeout(() => {
              emit("setFieldValue", { field: key, value: data[key] });
            }, 1);
          });
        }
        if (loadingStore) {
          store.remove(loadingStore);
        }
        if (props.triggers[index]?.reload) {
          router.go(0);
        } else {
          store.add({
            title: props.triggers[index]?.successText||'Success!',
            type: "success",
            dialog: props.triggers[index]?.dialog,
          });
        }
      } catch (error: any) {
        if (loadingStore) {
          store.remove(loadingStore);
        }
        const message =
          error.response?.data?.errors?.[0]?.message ||
          error.message ||
          'Error!';
        store.add({
          title: "Error",
          text: props.triggers[index]?.errorText || message,
          type: "error",
          dialog: props.triggers[index]?.dialog,
          error,
        });
      } finally {
        loading.value = false;
      }
    }
  },
});
</script>
  
  <style lang="scss" scoped>
.trigger-list {
  display: flex;
  gap: 8px;

  &.vertical {
    flex-direction: column;
  }

  &.horizontal {
    flex-wrap: wrap;
  }
}

.action {
  &.info {
    --v-button-background-color: var(--blue);
    --v-button-background-color-hover: var(--blue-125);
    --v-button-color: var(--blue-alt);
    --v-button-color-hover: var(--blue-alt);
  }

  &.success {
    --v-button-background-color: var(--success);
    --v-button-background-color-hover: var(--success-125);
    --v-button-color: var(--success-alt);
    --v-button-color-hover: var(--success-alt);
  }

  &.warning {
    --v-button-background-color: var(--warning);
    --v-button-background-color-hover: var(--warning-125);
    --v-button-color: var(--warning-alt);
    --v-button-color-hover: var(--warning-alt);
  }

  &.danger {
    --v-button-icon-color: var(--white);
    --v-button-background-color: var(--danger);
    --v-button-background-color-hover: var(--danger-125);
    --v-button-color: var(--danger-alt);
    --v-button-color-hover: var(--danger-alt);
  }
}
</style>