<template>
    <div>
        <div>
            <router-view></router-view>
        </div>
        <NotFoundPageVue v-if="!isLoading && isError"></NotFoundPageVue>
    </div>
</template>

<script setup>
import NotFoundPageVue from './NotFoundPage.vue';
import { useEmploymentStore } from '../../store/employmentStore';
import { storeToRefs } from 'pinia';

const { isLoading, isError } = storeToRefs(useEmploymentStore())


</script>
  
<style scoped></style>