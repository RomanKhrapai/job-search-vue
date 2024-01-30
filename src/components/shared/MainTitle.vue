<template>
    <component :is="tagName" class="main-title">
        <slot></slot>
    </component>
</template>
  
<script setup>
import { computed, defineProps } from "vue"

const props = defineProps({
    level: {
        type: Number,
        default: 1,
    },
})
const tagName = computed(() => `h${props.level}`)
</script>
  
<style lang="scss" scoped>
.main-title {
    font-size: 25px;
    font-weight: 700;
    line-height: 30px;
    margin-bottom: 30px;
    text-align: center;
}
</style>