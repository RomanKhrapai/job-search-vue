<script setup>
import CustomTextArea from '../shared/form/CustomInput/CustomTextArea.vue';
import CustomOneSearchSelect from '../shared/form/CustomInput/CustomOneSearchSelect.vue'
import CustomForm from '../shared/form/CustomForm.vue';
import NoFound from '.././NoFound.vue';
// import Reviews from './Reviews.vue'
// import ActivPanel from './ActivPanel.vue';
import { useEmploymentStore } from "../../store/employmentStore";
import { ref, defineProps, computed, watch } from 'vue'
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router'
import { getVacancy, deleteVacancy } from "../../store/actions/vacancy"
import { maxString, isRequiredId } from '../../utils/validationRules';
import { getCandidates } from '../../store/actions/candidate';
import { useChatsStore } from '../../store/chatsStore';

const router = useRouter();

const { id } = defineProps({
    id: String,
});

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

if (candidates.value.length === 0) {
    getCandidates();
}

getChatsList();
getVacancy(id);


</script>

<template>
    <div class="">
        <v-container>
            <v-row>
                <v-col>
                    <v-card>
                        <div class="box">
                            <v-card-title>{{ vacancy.title }}</v-card-title>
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

                        <v-img v-if="vacancy?.company?.image" :src="vacancy.company.image" height="200" width="200"
                            cover></v-img>
                        <img v-if="!vacancy?.company?.image" height="200" width="200"
                            src="/src/assets/images/fix-poster.jpg" alt="Постер фільму відсутній">
                        <v-card-text>

                            <v-row>
                                <router-link :to="`/companies/${vacancy.company?.id}`">
                                    <v-col>
                                        <strong>Company:</strong> {{ vacancy.company?.name }}
                                    </v-col>
                                </router-link>
                            </v-row>
                            <v-row>
                                <v-col>
                                    <strong>Profession:</strong> {{ vacancy.profession }}
                                </v-col>

                            </v-row>
                            <v-row>
                                <v-col>
                                    <strong>Salary:</strong> {{ vacancy.salary }} - {{ vacancy.max_salary }}
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>
                                    <strong>Area:</strong> {{ vacancy.area }}
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>
                                    <strong>Nature:</strong> {{ vacancy.nature }}
                                </v-col>
                                <v-col>
                                    <strong>Type:</strong> {{ vacancy.type }}
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>
                                    <strong>Description:</strong> {{ vacancy.description }}
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>
                                    <strong>Skills:</strong>
                                    <v-chip v-for="skill, i in vacancy.skills" :key="i" variant="flat" color="secondary">
                                        {{ skill }}
                                    </v-chip>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>

        <NoFound v-if="!vacancy && !isLoading" />
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

.box {
    display: flex;
    justify-content: space-between;
}
</style>