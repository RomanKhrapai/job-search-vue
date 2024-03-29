<template>
    <div class="relative">
        <label class="custom-label " :class="[labelClass]"> {{ label }}

            <input @focus="handleFocus" @blur="blurHandler"
                :class="[isValid && 'no-margin', !isValid && 'custom-input--error', isFocus && 'border']" autocomplete="off"
                list="" id="input" name="browsers" v-model="textInput" v-bind="$attrs" class="custom-input">

            <Button class="add-btn" type="button" @click="optionAdd"> Add </Button>
            <span v-if="!isValid" class=" custom-input__error">{{ error }}</span>
        </label>

        <datalist id="browsers" class="skill-list" :class="{ 'block': isFocus }">
            <template v-for=" option in optionsArray " :key="option.id">
                <option v-if="!option.hidden" :value="option.id" @click="optionSelect" :disabled="option.disabled">
                    {{ option.name }}
                </option>
            </template>
        </datalist>

        <div class="chips-block">
            <button @click="clearChips" class="chips" type="button" v-for="  (item, index )  in   props.modelValue  "
                :key="index">
                {{ item.name }} <v-icon size="large" :icon="'mdi-close'"></v-icon> </button>
        </div>

    </div>
</template>

<script setup>
import Button from "./Button.vue";
import { ref, inject, computed, onBeforeUnmount, onMounted, useAttrs } from "vue"
const attrs = useAttrs()
const emit = defineEmits(['update:modelValue', 'input'])

const isValid = ref(true);
const error = ref("");
const textInput = ref("");
const isFirstInput = ref(true);
const isFocus = ref(false);

const form = inject('form', null);


const props = defineProps({
    options: {
        type: Array,
        default: () => [
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
        type: Array,
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
}))

const optionsArray = computed(() => {
    const text = textInput.value.toUpperCase().trim();
    return props.options.map(option => ({
        ...option,
        hidden: !option.name.toUpperCase().includes(text)
    }))
})

function optionAdd(event) {
    isValid.value = rules.every((rule) => {

        const ruleResult = rule(textInput.value);
        const hasPassed = !ruleResult

        if (!hasPassed) {
            error.value = ruleResult || errorMessage;
        }

        return hasPassed
    });

    setTimeout(() => {
        isValid.value = true;
    }, 2000);

    if (!isValid.value) {
        return isFocus.value = false;
    }

    const newOption = {
        name: textInput.value,
        id: ''
    }

    textInput.value = '';

    if (!props.modelValue.find(option => option.name === newOption.name)) {
        emit("update:modelValue", [...props.modelValue,
            newOption])
    }
    isFocus.value = false;
}

function optionSelect(event) {

    const newOption = event.target.value ? {
        name: event.target.text,
        id: event.target.value
    } : {
        name: textInput.value,
        id: ''
    }

    textInput.value = '';

    if (!props.modelValue.find(option => option.name === newOption.name)) {
        emit("update:modelValue", [...props.modelValue,
            newOption])
    }
    isFocus.value = false;
}

function clearChips(event) {
    emit(
        'update:modelValue',
        props.modelValue.filter(({ name }) => event.currentTarget.innerText.trim() !== name)
    );
}

onMounted(() => {
    if (!form) return;
    form.registerInput({ reset, validate });
})
onBeforeUnmount(() => {
    if (!form) return;
    form.unRegisterInput({ reset, validate });
})


function validate() { return true }

function handleFocus() {
    setTimeout(() => { isFocus.value = true; }, 200);
};

function blurHandler(e) {
    setTimeout(() => {
        isFocus.value = false;
    }, 200);
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

.skill-list {
    position: absolute;
    z-index: 100;
    background-color: white;
    border: 1px solid #643843;
    border-radius: 0 0 5px 5px;
    border-top: none;
    font-family: sans-serif;
    width: 350px;
    padding: 5px;

}

option {
    background-color: white;
    padding: 4px;
    color: #643843;
    margin-bottom: 1px;
    font-size: 18px;
    cursor: pointer;
}

.no-margin {
    margin: 0;
}

.chips {
    padding: 2px 4px;
    border-radius: 14px;
    background-color: aqua;
    margin: 5px 3px;
}

.chips-block {
    display: inline-block;
    margin-left: 10px;
}

label>.add-btn {
    position: absolute;
    right: 0px;
    border-radius: 15px;
    height: 40px;
    min-width: 50px;
    text-align: center;
}
</style>