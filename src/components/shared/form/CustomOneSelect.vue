<template>
    <label class="custom-label " :class="[labelClass]"> {{ label }}

        <select v-on="listeners" v-bind="$attrs" :value="props.modelValue" class="custom-input"
            :class="!isValid && 'custom-input--error'">
            <option v-for="option in options" :key="option.id" :value="option.id" :disabled="option.disabled">
                {{ option.name }}
            </option>
        </select>
        <span v-if="!isValid" class="custom-input__error">{{ error }}</span>
    </label>
</template>

<script setup>

import { ref, inject, computed, onBeforeUnmount, onMounted, useAttrs } from "vue"
const attrs = useAttrs()
const emit = defineEmits(['update:modelValue', 'input'])

const isValid = ref(true);
const error = ref("")
const isFirstInput = ref(true)

const form = inject('form', null);


const props = defineProps({
    options: {
        type: Array,
        default: () => [
            { id: 1, name: 'select option', disabled: true }
        ]
    },
    labelClass: {
        type: String,
        default: "",
    },
    label: {
        type: String,
        default: "",
    },
    modelValue: {
        type: String,
        default: '',
    },
    errorMessage: {
        type: String,
        default: "",
    },
    rules: {
        type: Array,
        default: () => [],
    },
});

const { labelClass, label, errorMessage, rules } = props
const listeners = computed(() => ({
    ...attrs,
    input: (event) => { emit("update:modelValue", event.target.value); },
}))

onMounted(() => {
    if (!form) return;
    form.registerInput({ reset, validate });
})
onBeforeUnmount(() => {
    if (!form) return;
    form.unRegisterInput({ reset, validate });
})


function validate() {

    isValid.value = rules.every((rule) => {

        const ruleResult = rule(props.modelValue);
        const hasPassed = !ruleResult

        if (!hasPassed) {
            error.value = ruleResult || errorMessage;
        }

        return hasPassed
    });
    return isValid.value
}
function blurHandler() {
    validate();
    if (isFirstInput.value) {
        validate();
    }
    isFirstInput.value = false;
}
function reset() {
    isFirstInput.value = true;
    isValid.value = true;
    emit("input", "");
}
</script>
  
<style lang="scss" scoped>
@import "./style.module.scss";
</style>