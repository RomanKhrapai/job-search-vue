<script setup>
import CustomTextArea from '../shared/form/CustomInput/CustomTextArea.vue';
import CustomOneSearchSelect from '../shared/form/CustomInput/CustomOneSearchSelect.vue'
import CustomForm from '../shared/form/CustomForm.vue';
import NoFound from '.././NoFound.vue';
import Loader from '../Loader.vue';

import { useEmploymentStore } from "../../store/employmentStore";
import { ref, defineProps, computed, watch } from 'vue'
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router'
import { getVacancy, deleteVacancy, updateVacancyStatus } from "../../store/actions/vacancy"
import { maxString, isRequiredId } from '../../utils/validationRules';
import { getCandidates } from '../../store/actions/candidate';
import { useChatsStore } from '../../store/chatsStore';
import { useAuthStore } from '../../store/authStore';

const router = useRouter();

const { id } = defineProps({
    id: String,
});
const { role, isAuthorized } = storeToRefs(useAuthStore());
const { vacancy, isLoading, candidates } = storeToRefs(useEmploymentStore())
const { sendApplyVacancy, getChatsList } = useChatsStore();

const dialogDelete = ref(false);
const dialogSendApp = ref(false);

const candidate = ref({ id: '', name: '' });
const message = ref('');
const formSendApp = ref(null);

const messageRules = computed(() => [maxString(1000),]);
const candidateRules = computed(() => [isRequiredId,]);

function handDestroy() {
    deleteVacancy(id)
    dialogDelete.value = false;
    router.push({
        path: '/companies',
    })
}

function sendApply() {
    const isFormValid = formSendApp.value.validate()
    if (isFormValid) {
        sendApplyVacancy(message.value, candidate.value, vacancy.value)
        dialogSendApp.value = false;
        router.push({
            name: 'chat',
        })
    };
}

const resumes = computed(() => {
    return candidates.value.map(item => {
        return { id: item.id, name: item.title }
    })
});

if (candidates.value.length === 0 && isAuthorized.value) getCandidates();
if (isAuthorized.value) getChatsList();

getVacancy(id);

</script>
<template>
    <div class="">
        <Loader v-if="isLoading" />
        <v-container v-if="vacancy.id">
            <v-row>
                <v-col>
                    <v-card class="wrapper_vacancies">
                        <v-card-title class="vacancies_title">{{ vacancy.title }}</v-card-title>
                        <div class="box_second">
                            <div class="wrapper_vacancies__image">
                                <v-img class="image_vacancies" v-if="vacancy?.company?.image" :src="vacancy.company.image"
                                    height="200" width="200" cover></v-img>
                                <img class="image_vacancies" v-if="!vacancy?.company?.image" height="200" width="200"
                                    src="/src/assets/images/fix-poster.jpg" alt="The movie poster is missing">
                            </div>

                            <v-card-text class="wrapper_vacancies__text">
                                <div class="block_text">
                                    <div class="block_text__first">
                                        <v-row class="padding-bottom">
                                            <router-link class="link" :to="`/companies/${vacancy.company?.id}`">
                                                <v-col class="vacancies__text">
                                                    <strong>Company:</strong> {{ vacancy.company?.name }}
                                                </v-col>
                                            </router-link>
                                        </v-row>
                                        <v-row class="padding-bottom">
                                            <v-col class="vacancies__text">
                                                <strong>Profession:</strong> {{ vacancy.profession }}
                                            </v-col>

                                        </v-row>
                                        <v-row>
                                            <v-col class="vacancies__text">
                                                <strong>Salary:</strong> {{ vacancy.salary }} - {{ vacancy.max_salary }}
                                            </v-col>
                                        </v-row>
                                    </div>
                                    <div class="block_text__second">
                                        <v-row class="padding-bottom">
                                            <v-col class="vacancies__text">
                                                <strong>Area:</strong> {{ vacancy.area }}
                                            </v-col>
                                        </v-row>
                                        <v-row class="padding-bottom">
                                            <v-col class="vacancies__text">
                                                <strong>Nature:</strong> {{ vacancy.nature }}
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col class="vacancies__text">
                                                <strong>Type:</strong> {{ vacancy.type }}
                                            </v-col>
                                        </v-row>
                                    </div>
                                </div>

                                <v-row>
                                    <v-col class="vacancies__text">
                                        <strong>Description:</strong> {{ vacancy.description }}
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col class="vacancies__text">
                                        <strong>Skills:</strong>

                                        <v-chip v-for="skill, i in vacancy.skills" :key="i" variant="flat"
                                            color="secondary">
                                            {{ skill }}
                                        </v-chip>
                                    </v-col>
                                </v-row>
                            </v-card-text>

                        </div>
                        <div class="box">
                            <v-dialog v-model="dialogSendApp" width="auto">
                                <template v-slot:activator="{ props }">
                                    <v-btn color="primary" v-bind="props">send apply for a job </v-btn>
                                </template>
                                <v-card class="card-form">
                                    <CustomForm ref="formSendApp" class="login__form" @submit.prevent="sendApply">

                                        <v-card-title class="text-h5"> send apply for this job vacancy.title
                                        </v-card-title>
                                        <v-card-text>

                                            <CustomOneSearchSelect v-model="candidate" class="login__input"
                                                :label="'resume'" name="resume" :list-class="'relative'" :options="resumes"
                                                :rules="candidateRules" :no-btn="true" />

                                            <CustomTextArea v-model="message" autocomplete="message"
                                                placeholder="enter message" name="message" :rules="messageRules"
                                                class="login__input" label="message" />

                                        </v-card-text>
                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn color="green-darken-1" variant="text" @click="dialogSendApp = false">
                                                Close
                                            </v-btn>
                                            <v-btn color="green-darken-1" variant="text" type="submit">send
                                            </v-btn>

                                        </v-card-actions>
                                    </CustomForm>
                                </v-card>
                            </v-dialog>
                            <v-btn v-if="vacancy.isOwner" color="primary" @click="updateVacancyStatus(!vacancy.isClosed)">{{
                                !vacancy.isClosed ? 'close ' :
                                "open" }} vacancy </v-btn>
                            <v-dialog v-if="vacancy.isOwner" v-model="dialogDelete" width="auto">
                                <template v-slot:activator="{ props }">
                                    <v-btn color="primary" v-bind="props"> destroy </v-btn>
                                </template>
                                <v-card>
                                    <v-card-title class="text-h5"> delete confirmation </v-card-title>
                                    <v-card-text>Are you sure you want to delete the vacancy?</v-card-text>
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
                        </div>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>


        <NoFound v-if="!vacancy.id && !isLoading" />
    </div>
</template>

    
<style scoped>
.wrapper_vacancies {
    padding: 20px;
    height: auto;
    border-radius: 30px;
    background-image: linear-gradient(to right, #579BB1 0, #E1D7C6 50%, #ECE8DD 100%);
    box-shadow: 0px -14px 32px 3px rgba(220.5, 220.5, 220.5, 1), 0px 0px 0px -4px rgba(220.5, 220.5, 220.5, 1);
}

/* #579BB1
#E1D7C6
#ECE8DD
#F8F4EA */
.vacancies_title {
    padding: 0;
    margin-bottom: 20px;
}

.box_second {
    display: flex;
    margin-bottom: 20px;
}

.image_vacancies {
    box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);
}

.btn-box {
    padding: 5px;
    display: flex;
    justify-content: center;
}

.wrapper_vacancies__image {
    width: 30%;
    height: 30%;
}

.wrapper_vacancies__text {
    display: flex;
    flex-direction: column;
    width: 65%;
    height: 65%;
    gap: 20px;
    padding: 25px;
    border-radius: 10px;
}

.block_text {
    display: flex;
    margin-bottom: 20px;
}

.block_text__first,
.block_text__second {
    width: 45%;
    height: auto;

}

.vacancies__text {
    padding: 0;
    font-size: 16px;
    line-height: 18px;
}

.box {
    display: flex;
    justify-content: space-between;
}
</style>
