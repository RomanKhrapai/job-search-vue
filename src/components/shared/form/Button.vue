<template>
    <button v-bind="$attrs" v-bind:type="type" :class="{ btn: true, 'btn--outlined': outlined }">
        <slot></slot>
    </button>
</template>
  
<script setup>
const props = defineProps({
    type: {
        type: String,
        default: 'button',
    },
    outlined: {
        type: Boolean,
        default: false,
    },
    loading: {
        type: Boolean,
        default: false,
    },
})
</script>
    
<style lang="scss" scoped>
@import "../../../assets/scss/variables.scss";

.btn {
    position: relative;
    display: inline-block;
    font-size: 18px;
    background: $active-button-color;
    color: $bg-primary-color;
    cursor: pointer;
    min-width: 220px;
    border: 1px solid transparent;
    padding: 8px 15px;
    transition: background-color 0.4s, color 0.4s;
    font-family: Montserrat, sans-serif;
    margin-bottom: 10px;

    &:hover {
        background: $bg-primary-color;
        color: $active-button-color;
        border: 1px solid $active-button-color;
    }

    &--outlined {
        background: none;
        border: 1px solid $active-button-color;
        color: $active-button-color;
    }

    &__content {
        &--hidden {
            opacity: 0;
        }
    }

    &__loader {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
}
</style>