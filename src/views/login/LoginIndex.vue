<template>
<div>{{name}}</div>
<button @click="click">1</button>
</template>
<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useMainStore } from '@/store';

const { name } = storeToRefs(useMainStore());
const click = () => {
  name.value = '123';
};
</script>

<!-- <style lang="postcss" scoped></style> -->
