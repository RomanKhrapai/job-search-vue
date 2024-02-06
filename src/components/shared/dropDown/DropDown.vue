<template>
    <div class="dropdown relative">
        <div class="drop-down_title" v-html="title" @click="show = !show"></div>
        <div v-if="show">
            <slot />
        </div>
    </div>
</template>
  
<!-- <script>
import { ref } from "vue";
export default {
    props: ["title"],
    setup(props) {
        const show = ref(false);
        return {
            show,
        };
    },
};
</script> -->
<script setup>
import { ref } from "vue";
const { title } = defineProps({
    title: String,
});
const show = ref(false);

// export { show };
</script>

<style scoped>
.drop-down_title {
    cursor: pointer;
    height: 2.5rem;
    background-color: #fff;
    display: flex;
    border-width: 1px;
    border-color: #e2e8f0;
    border-radius: 0.375rem;
    align-items: center;
    padding: 0.75rem;
}

.drop-down_list {
    position: absolute;
    border-radius: 0.375rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: 0.25rem;
    border-width: 1px;
    border-color: #e2e8f0;
}
</style>
