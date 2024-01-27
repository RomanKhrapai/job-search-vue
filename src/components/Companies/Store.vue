<template>
    <MainTitle class="title">add company</MainTitle>
    <CustomForm ref="form" class="login__form" @submit.prevent="handleSubmit">

        <div :class="errorImage && 'error'">
            <label class="custom-label form__input">Image:
                <div id="fileInputshow">
                    <img loading="lazy" :src="fullImageURL" height="100" width="100">
                </div>
                <input @change="handleFile" id="fileInput" type="file" name="img" accept=" image/jpeg"
                    class=" custom-file-input " />
            </label>
        </div>
        <span v-if="errorImage" class="error_text">{{ errorImage }}</span>
        <br>

        <CustomInput v-model="title" autocomplete="title" placeholder="enter name" name="title" :rules="titleRules"
            class="login__input" :label="'name'" />

        <CustomInput v-model="address" class="login__input" :label="'address'" :rules="addressRules" name="address" />

        <CustomTextArea v-model="description" autocomplete="description" placeholder="enter description" name="description"
            :rules="descriptionRules" class="login__input" :label="'description'" />

        <Button class="login__btn" type="submit">submit</Button>
    </CustomForm>
</template>
  
<script setup>
import CustomManySearchSelect from "../shared/form/CustomInput/CustomManySearchSelect.vue";
import CustomOneSearchSelect from "../shared/form/CustomInput/CustomOneSearchSelect.vue";
import CustomTextArea from "../shared/form/CustomInput/CustomTextArea.vue";
import CustomForm from "../shared/form/CustomForm.vue";
import CustomInput from "../shared/form/CustomInput/CustomInput.vue";
import Button from "../shared/form/Button/Button.vue";
import CustomOneSelect from "../shared/form/CustomInput/CustomOneSelect.vue";
import MainTitle from "../shared/MainTitle.vue";

import {
    maxString, minString, isRequired,
} from "../../utils/validationRules";
import { useAuthStore } from "../../store/authStore"
import { useFormParametersStore } from '../../store/formParametersStore'
import { useEmploymentStore } from '../../store/employmentStore'
import { storeToRefs } from "pinia"
import { ref, computed, watch } from "vue"
import { useRouter } from "vue-router";
import { debounce } from "../../utils/debounce";
import { storeCompany } from "../../store/actions/company"

const router = useRouter()

const title = ref("")
const address = ref("")
const description = ref("")

const form = ref(null)
const { isAuthorized } = storeToRefs(useAuthStore());

const { uploadAvatar, } = useEmploymentStore();
const { fullImageURL, errorImage, errors } = storeToRefs(useEmploymentStore());

const titleRules = computed(() => [isRequired, maxString(200), minString(3)]);
const descriptionRules = computed(() => [isRequired, maxString(2000), minString(3)]);
const addressRules = computed(() => [isRequired, maxString(200), minString(3)]);


function handleFile(e) {

    const files = e.target.files;
    if (files.length > 0) {
        const formData = new FormData();

        if (files[0].size < 2000000) {
            formData.append("file", files[0]);
            uploadAvatar(formData);
            return
        }
        uploadAvatar();
    }
}

function handleSubmit() {

    const isFormValid = form.value.validate()
    console.log(isFormValid);
    if (isFormValid) {
        storeCompany({
            name: title.value,
            address: address.value,
            description: description.value
        });
        if (!errors) {
            form.value.reset()
        }
    }
}
watch(isAuthorized, () => { if (isAuthorized) { router.push({ name: 'home' }) } })
</script>
  
<style lang="scss" scoped>
@import "../../assets/scss/variables.scss";

.error {
    border: solid;
    border-color: $error-color;
}

.error_text {
    width: 100%;
    font-size: 12px;
    color: $error-color;
    line-height: 1.3;
}
</style>