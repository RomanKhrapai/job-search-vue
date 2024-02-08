<script setup>
import CustomOneSearchSelect from "../shared/form/CustomInput/CustomOneSearchSelect.vue";
import CustomForm from "../shared/form/CustomForm.vue";
import NoFound from '.././NoFound.vue';
import Reviews from '../Reviews.vue';
import {
    isRequiredObjName, maxStringObjName, minStringObjName
} from "../../utils/validationRules";
import { debounce } from "../../utils/debounce";
import { useEmploymentStore } from "../../store/employmentStore";
import { useFormParametersStore } from '../../store/formParametersStore';
import { useAuthStore } from "../../store/authStore";
import { useChatsStore } from "../../store/chatsStore";
import { ref, defineProps, computed, watch } from 'vue'
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router'
import { getCompany, deleteCompany } from "../../store/actions/company"
import { getCompamyReviews } from "../../store/actions/review";
const router = useRouter();


const { id } = defineProps({
    id: String,
});

const { role } = storeToRefs(useAuthStore());
const { createChats, setCurrentChat } = useChatsStore();
const { chatsList } = storeToRefs(useChatsStore());
const { company, isLoading } = storeToRefs(useEmploymentStore())
const { professions } = storeToRefs(useFormParametersStore());
const { getProfessions, setProfesion } = useFormParametersStore();


const dialogDelete = ref(false);
const dialogAddVacancy = ref(false);
const profession = ref({ id: '', name: '' });
const form = ref(null)

const professionRules = computed(() => [isRequiredObjName, maxStringObjName(200), minStringObjName(3)]);

// const { rating, count } = useComputed(company, readRating)
function handDestroy() {
    deleteCompany(id)
    dialogDelete.value = false;
    router.push({
        path: '/companies',
    })
}
function handleSubmit() {

    const isFormValid = form.value.validate()
    if (isFormValid) {
        setProfesion(profession.value,
        );
        dialogAddVacancy.value = false;
        router.push({
            path: '/vacancies/create',
        })
    }
}
async function toChatSubmit() {

    let chat = chatsList.value.find(item => item.companyId === id)
    if (!chat) {
        chat = await createChats(id);
    }
    else { setCurrentChat(chat); };

    router.push({
        name: 'chat',
    })
}

function redirectTo(path) {

    router.push({
        path,
    })
}
watch(profession, () => {
    debounce(() => {
        getProfessions(profession.value.name, 10);
    },
        200)
})

getCompany(id);
getProfessions('', 10);
getCompamyReviews(id);
</script>

<template>
    <div class="">

        <v-card v-if="company" class="mx-auto my-12">
            <div>
                <div class="film_box">
                    <div class="film_box-background">

                        <div class="film_img-box">
                            <div class="film_img">
                                <v-img v-if="company?.image" :src="company.image" height="200" width="200" cover></v-img>
                                <img v-if="!company?.image" height="200" width="200" src="/src/assets/images/fix-poster.jpg"
                                    alt="Постер фільму відсутній">
                            </div>

                        </div>
                        <div class='film_info'>
                            <div class="box">
                                <v-card-title>{{ company.name }}</v-card-title>
                                <v-rating half-increments :length="5" readonly :size="28" :model-value="company.avgVote / 2"
                                    color="warning" active-color="warning" />
                                <v-card-subtitle>
                                    <v-card-title>address: </v-card-title>
                                    <span class="me-1">{{ company.address }}</span>
                                </v-card-subtitle>
                            </div>
                            <v-card-actions v-if="company.isOwner">
                                <v-btn color="deep-purple-lighten-2" variant="text" @click="">
                                    edit
                                </v-btn>
                                <v-dialog v-model="dialogAddVacancy" width="auto">
                                    <template v-slot:activator="{ props }">
                                        <v-btn color="primary" v-bind="props"> add vacancy </v-btn>
                                    </template>
                                    <v-card class="card-form">
                                        <CustomForm ref="form" class="login__form" @submit.prevent="handleSubmit">

                                            <v-card-title class="text-h5"> to create a vacancy, select a profession
                                            </v-card-title>
                                            <v-card-text>

                                                <CustomOneSearchSelect v-model="profession" class="login__input"
                                                    :label="'profession'" :rules="professionRules" name="profession"
                                                    :list-class="'relative'" :options="professions" />

                                            </v-card-text>
                                            <v-card-actions>
                                                <v-spacer></v-spacer>
                                                <v-btn color="green-darken-1" variant="text"
                                                    @click="dialogAddVacancy = false">
                                                    Close
                                                </v-btn>
                                                <v-btn color="green-darken-1" variant="text" type="submit">add vacancy
                                                </v-btn>

                                            </v-card-actions>
                                        </CustomForm>
                                    </v-card>
                                </v-dialog>

                                <v-dialog v-model="dialogDelete" width="auto">
                                    <template v-slot:activator="{ props }">
                                        <v-btn color="primary" v-bind="props"> destroy </v-btn>
                                    </template>
                                    <v-card>
                                        <v-card-title class="text-h5"> delete confirmation </v-card-title>
                                        <v-card-text>Are you sure you want to delete the company?</v-card-text>
                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn color="green-darken-1" variant="text" @click="dialogDelete = false">
                                                Close
                                            </v-btn>
                                            <v-btn color="green-darken-1" variant="text" @click="handDestroy">
                                                delete
                                            </v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-dialog>
                            </v-card-actions>
                            <v-card-actions v-if="role === 3">
                                <v-btn color="deep-purple-lighten-2" variant="text" @click="toChatSubmit">
                                    go to chat
                                </v-btn>
                            </v-card-actions>
                        </div>
                    </div>
                </div>
                <v-card-title>description</v-card-title>
                <v-card-text>
                    <div>{{ company.description }} </div>
                </v-card-text>

                <template v-if="company.vacancies">
                    <v-card-title>vacancies</v-card-title>
                    <v-card-actions v-for="vacancy, i in company.vacancies">
                        <v-btn color="deep-purple-lighten-2" variant="text" @click="redirectTo(`/vacancies/${vacancy.id}`)">
                            {{ i + 1 }}. {{ vacancy.title }}
                        </v-btn>
                    </v-card-actions>
                </template>
            </div>
        </v-card>
        <Reviews v-if="company.id" :id="Number(company.id)" :isUser='false' />

        <NoFound v-if="!company && !isLoading" />
    </div>
</template>

    
<style scoped>
.btn-box {
    padding: 5px;
    display: flex;
    justify-content: center;
}

.box {
    padding: 5px;
}

.show-video__playr {
    height: 70vh;
    width: 70vw
}

.modal-footer {
    display: flex;
    justify-content: space-around;
}

.film_box {
    background-size: cover;
    background-repeat: no-repeat;
}

.film_box-background {
    background-image: linear-gradient(to right, rgba(220.5, 220.5, 220.5, 1) calc((50vw - 170px) - 340px), rgba(220.5, 220.5, 220.5, 0.44) 50%, rgba(220.5, 220.5, 220.5, 0.84) 100%);
    display: flex;
    align-items: flex-end;
}

.film_img-box {
    padding: 15px;

}

.film_img {
    box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);
}

.film_info {
    border-radius: 30px 30px 0 0;
    background-image: linear-gradient(to right, rgba(220.5, 220.5, 220.5, 1) 0, rgba(220.5, 220.5, 220.5, 0.44) 50%, rgba(220.5, 220.5, 220.5, 0.84) 100%);
    box-shadow: 0px -14px 32px 3px rgba(220.5, 220.5, 220.5, 1), 0px 0px 0px -4px rgba(220.5, 220.5, 220.5, 1)
}

.card-form {
    overflow: hidden;

}
</style>