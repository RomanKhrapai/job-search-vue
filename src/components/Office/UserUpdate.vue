<template>
    <div>
        <div>
            <MainTitle class="title">Update user {{ emailStore }}</MainTitle>
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

                <CustomInput v-model="name" autocomplete="name" placeholder="enter name" name="name" :rules="nameRules"
                    class="login__input" :label="'name'" />

                <CustomInput v-model="phone" autocomplete="tel" placeholder="+380 xxxx xxx" class="login__input"
                    :label="'phone'" :rules="phoneRules" name="phone" />

                <div class="wrapper_radio">
                    <CustomRadio v-model="role" type="radio" name="role" value='3'
                        class="registration__input check-box__input" :label="'Employer'" />
                    <CustomRadio v-model="role" type="radio" name="role" value='2'
                        class="registration__input check-box__input" :label="'Worker'" />
                </div>

                <Button class="login__btn" type="submit">submit</Button>
            </CustomForm>

            <v-dialog v-model="dialogPassword" width="auto">
                <template v-slot:activator="{ props }">
                    <v-btn color="primary" v-bind="props"> change password</v-btn>
                </template>
                <v-card class="card-form">
                    <CustomForm ref="form" class="login__form" @submit.prevent="handleSubmitPassword">

                        <v-card-title class="text-h5"> change password
                        </v-card-title>
                        <v-card-text>
                            <CustomInput v-if="roleStore" v-model="oldPassword" type="oldPassword"
                                autocomplete="current-oldPassword" placeholder="oldPassword" name="oldPassword"
                                :rules="oldPasswordRules" class="registration__input" :label="'oldPassword'" />
                            <div v-if="!roleStore" class="wrapper_radio">
                                <CustomRadio v-model="role" type="radio" name="role" value='3'
                                    class="registration__input check-box__input" :label="'Employer'" />
                                <CustomRadio v-model="role" type="radio" name="role" value='2'
                                    class="registration__input check-box__input" :label="'Worker'" />
                            </div>

                            <CustomInput v-model="password" type="password" placeholder="Password" name="password"
                                :rules="passwordRules" class="registration__input" :label="'Password'" />
                            <CustomInput v-model="confirmPassword" type="password" placeholder="Confirm password"
                                name="password" :rules="confirmPasswordRules" class="registration__input"
                                :label="'Confirm password'" />

                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="green-darken-1" variant="text" @click="dialogPassword = false">
                                Close
                            </v-btn>
                            <v-btn color="green-darken-1" variant="text" type="submit">submit
                            </v-btn>

                        </v-card-actions>
                    </CustomForm>
                </v-card>
            </v-dialog>
        </div>
        <!-- <NotFoundPageVue v-if="!isLoading && isError"></NotFoundPageVue> -->
    </div>
</template>

<script setup>
import MainTitle from '../shared/MainTitle.vue';
import CustomForm from '../shared/form/CustomForm.vue';
import CustomInput from '../shared/form/CustomInput/CustomInput.vue';
import CustomRadio from '../shared/form/CustomInput/CustomRadio.vue';
import Button from "../shared/form/Button/Button.vue";

import { useEmploymentStore } from '../../store/employmentStore';
import { useAuthStore } from '../../store/authStore';
import { isRequired, nameValidation, passwordValidation, oldPasswordValidation, phoneValidation } from '../../utils/validationRules';
import { storeToRefs } from "pinia";
import { useRouter } from 'vue-router';
import { ref, computed, watch } from 'vue';


const router = useRouter()
const { updatePassword } = useAuthStore();
const { role: roleStore, name: nameStore, phone: phoneStore, email: emailStore } = storeToRefs(useAuthStore());
const { uploadAvatar, } = useEmploymentStore();
const { fullImageURL, errorImage, errors } = storeToRefs(useEmploymentStore());

const dialogPassword = ref(false);
const name = ref(String(nameStore.value) || "");
const phone = ref(String(phoneStore.value) || "");
const role = ref(String(roleStore.value) || "2");
const password = ref("");
const confirmPassword = ref("");
const oldPassword = ref("");

const nameRules = computed(() => [isRequired, nameValidation]);
const phoneRules = computed(() => [isRequired, phoneValidation]);
const oldPasswordRules = computed(() => [oldPasswordValidation])
const passwordRules = computed(() => [isRequired, passwordValidation])
const confirmPasswordRules = computed(() => [(val) => val !== password.value ?
    "Passwords do not match" : null])

const form = ref(null);


async function handleSubmitPassword() {

    const isFormValid = form.value.validate()

    if (isFormValid) {
        const isSuccessful = await updatePassword(password.value, oldPassword.value, role.value);
        if (isSuccessful) {
            form.value.reset();
            dialogPassword.value = false;
        }
    }
}

async function handleSubmit() {

    const isFormValid = form.value.validate()

    if (isFormValid) {
        // const id = await storeCompany({
        //     name: title.value,
        //     address: address.value,
        //     description: description.value
        // });
        if (id) {
            form.value.reset();
        }
    }
}

dialogPassword.value = !roleStore.value
</script>

<style scoped>
.wrapper_radio {
    display: flex;
    align-items: center;
}

.registration__input {
    margin-bottom: 20px;
    width: 100%;
}
</style>