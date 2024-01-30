<template>
    <label class="custom-label "> {{ label }}
        <input class="custom-input" name="number" @input="inputText($event)">

    </label>
</template>
  
<script setup>
const emit = defineEmits(['update:modelValue'])
const { defaultOption, label, options, modelValue } = defineProps({
    label: {
        type: String,
        required: false,
        default: '',
    },
    modelValue: {
        type: String,
        default: "",
    },
})

function inputText(e) {
    emit("update:modelValue", e.target.value);
}
</script>
  
<style lang="scss" scoped>
@import "../../assets/scss/variables.scss";

.custom-label {
    display: flex;
    font-size: 12px;
    align-items: center;
}

.custom-input {
    height: 40px;
    font-size: 16px;
    font-weight: 400;
    color: #000000;
    outline: none;
    padding: 5px 15px;
    margin-left: 10px;
}
</style>
  