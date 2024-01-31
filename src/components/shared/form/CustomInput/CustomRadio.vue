<template>
    <label class="custom-label lable_radio" :class="[labelClass]"> {{ label }}
        <input v-on="listeners" type="radio" v-bind="attrs" @blur="blurHandler" :v-model="modelValue"
            class="custom-input input_radio" :class="!isValid && 'custom-input--error'" :value="value"
            :checked="modelValue === value" />
        <span v-if="!isValid" class="custom-input__error">{{ error }}</span>
    </label>
</template>
  
<script setup>
import { ref, inject, computed, watch, onBeforeMount, onMounted, useAttrs } from "vue"
const attrs = useAttrs()
const emit = defineEmits(['update:modelValue', 'input'])

const isValid = ref(true);
const error = ref("")
const isFirstInput = ref(true)

const form = inject('form', null);

const { labelClass, label, errorMessage, rules, value } = defineProps({
    labelClass: {
        type: String,
        default: "",
    },
    value: {
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

const listeners = computed(() => ({
    ...attrs,

    input: (event) => { emit("update:modelValue", event.target.value); },
}))
onMounted(() => {
    if (!form) return;
    form.registerInput({ reset, validate });
})
onBeforeMount(() => {
    if (!form) return;
    form.unRegisterInput({ reset, validate });
})

function validate() {
    isValid.value = rules.every((rule) => {
        const ruleResult = rule(form.modelValue);
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

.lable_radio {
    display: flex;
    align-items: center;
}

.input_radio {
    box-shadow: none;
}
</style>