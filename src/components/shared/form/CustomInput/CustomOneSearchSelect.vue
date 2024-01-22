<template>
    <div class="relative">
        <label class="custom-label " :class="[labelClass]"> {{ label }}

            <input @focus="handleFocus" @blur="blurHandler" v-on="listeners"
                :class="[isValid && 'no-margin', !isValid && 'custom-input--error', isFocus && 'border']" autocomplete="off"
                list="" :value="props.modelValue.name" v-bind="$attrs" class="custom-input">

            <Button class="add-btn" type="button" @click="optionAdd"> add </Button>
            <span v-if="!isValid" class=" custom-input__error">{{ error }}</span>
        </label>

        <datalist class="list" :class="{ 'block': isFocus }">
            <option v-for=" option in options" :key="option.id" :value="option.id" @click="optionSelect">
                {{ option.name }}
            </option>
        </datalist>
    </div>
</template>

<script setup>
import Button from "../Button/Button.vue";
import { ref, inject, computed, onBeforeUnmount, onMounted, useAttrs } from "vue"
const attrs = useAttrs()
const emit = defineEmits(['update:modelValue', 'input'])

const isValid = ref(true);
const error = ref("");
const isFirstInput = ref(true);
const isFocus = ref(false);

const form = inject('form', null);


const props = defineProps({
    options: {
        type: Array,
        default: () => [
            { id: '', name: '' }
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
        type: Object,
        default: [],
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
    input: (event) => {
        const value = props.options.find(
            ({ name }) =>
                name.toUpperCase().trim() === event.target.value.toUpperCase().trim()
        )

        emit("update:modelValue", value ? value : { id: '', name: event.target.value });
    },
}))

function optionAdd(event) {

    isFocus.value = false;
}

function optionSelect(event) {

    const newOption = {
        name: event.target.text,
        id: event.target.value
    }
    emit("update:modelValue", newOption)

    isFocus.value = false;
}

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

        const ruleResult = rule(props.modelValue.name);
        const hasPassed = !ruleResult

        if (!hasPassed) {
            error.value = ruleResult || errorMessage;
        }

        return hasPassed
    });
    return isValid.value
}

function handleFocus() {
    setTimeout(() => { isFocus.value = true; }, 200);
};

function blurHandler(e) {
    setTimeout(() => {
        isFocus.value = false;
        validate();
        if (isFirstInput.value) {
            validate();
        }
    }, 200);

    isFirstInput.value = false;
}
function reset() {
    isFirstInput.value = true;
    isValid.value = true;
    emit("input", { id: '', name: '' });
}
</script>
  
<style lang="scss" scoped>
@import "./style.module.scss";

option:hover,
.active,
.chips:hover {
    background-color: lightblue;
}

.block {
    display: block;
}

.border {
    border-radius: "5px 5px 0 0"
}

.list {
    position: absolute;
    z-index: 100;
    background-color: white;
    border: 1px solid blue;
    border-radius: 0 0 5px 5px;
    border-top: none;
    font-family: sans-serif;
    width: 350px;
    padding: 5px;

}

option {
    background-color: white;
    padding: 4px;
    color: blue;
    margin-bottom: 1px;
    font-size: 18px;
    cursor: pointer;
}

.no-margin {
    margin: 0;
}

label>.add-btn {
    position: absolute;
    right: 0px;
    height: 40px;
    min-width: 50px;
    text-align: center;
}
</style>