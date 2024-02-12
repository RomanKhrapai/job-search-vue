<template>
    <div>
        <div>
            <router-link to="/companies/create">
                <v-btn color="green-darken-1" variant="text">
                    add company
                </v-btn>
            </router-link>
            <router-link :to="{ name: 'chat' }">
                <v-btn color="green-darken-1" variant="text">
                    chat
                </v-btn>
            </router-link>
            <!-- <router-link to="/companies/create"> -->
            <router-link :to="{ name: 'user-update' }">
                <v-btn color="green-darken-1" variant="text">
                    Update user
                </v-btn>
            </router-link>
            <v-btn color="green-darken-1" variant="text" @click="generatePDF">
                download report
            </v-btn>

            <v-dialog v-model="dialogAddResume" width="auto">
                <template v-slot:activator="{ props }">
                    <v-btn color="primary" v-bind="props"> add resume </v-btn>
                </template>
                <v-card class="card-form">
                    <CustomForm ref="form" class="login__form" @submit.prevent="addResume">

                        <v-card-title class="text-h5"> to create a resume, select a profession
                        </v-card-title>
                        <v-card-text>

                            <CustomOneSearchSelect v-model="profession" class="login__input" :label="'profession'"
                                :rules="professionRules" name="profession" :list-class="'relative'"
                                :options="professions" />

                            <CustomInput v-model="experience" type="number" autocomplete="experience"
                                placeholder="enter experience" name="experience" :rules="experienceRules"
                                class="login__input" :label="'experience (months)'" />

                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="green-darken-1" variant="text" @click="dialogAddResume = false">
                                Close
                            </v-btn>
                            <v-btn color="green-darken-1" variant="text" type="submit">add resume
                            </v-btn>

                        </v-card-actions>
                    </CustomForm>
                </v-card>
            </v-dialog>
        </div>
        <div>
            <CustomForm ref="formOffer" class="login__form" @submit.prevent="hendelOffer">
                <div class="wrapper_flex">
                    <CustomOneSelect v-if="role === 2" v-model="company" autocomplete="company" placeholder="choose company"
                        name="experience" :rules="companyRules" class="login__input input" :label="'company'"
                        :options="companies" />
                    <CustomOneSelect v-if="role === 2" v-model="vacancy" autocomplete="vacancy" placeholder="choose vacancy"
                        name="experience" :rules="vacancyRules" class="login__input input" :label="'vacancy'"
                        :options="formVacancies" />
                    <CustomOneSelect v-if="role === 3" v-model="candidate" autocomplete="candidate"
                        placeholder="choose resume" name="experience" :rules="candidateRules" class="login__input input"
                        :label="'resume'" :options="modCandidates" />
                    <v-btn color="blue-darken-1" type="submit">
                        offer
                    </v-btn>
                </div>

            </CustomForm>


        </div>
        <NoFoundJob v-if="!isLoading && !vacancies[0] && !candidates[0]" class="full-box" />

        <div v-if="!isLoading && candidates[0]">
            <Candidates v-if="!isLoading && candidates[0]" :candidates="candidates" />
            <v-pagination v-model="page" :length="lastPage" :total-visible="6"></v-pagination>

        </div>
        <div v-if="!isLoading && vacancies[0]">
            <Vacancies v-if="!isLoading && vacancies[0]" :vacancies="vacancies" />
            <v-pagination v-model="page" :length="lastPage" :total-visible="6"></v-pagination>

        </div>
    </div>
</template>

<script setup>

import Candidates from '../Candidates/Candidates.vue';
import NoFoundJob from '../NoFoundJob.vue';
import Vacancies from '../Vacancies/Vacancies.vue';
import CustomOneSelect from '../shared/form/CustomInput/CustomOneSelect.vue';
import CustomOneSearchSelect from '../shared/form/CustomInput/CustomOneSearchSelect.vue';
import CustomInput from '../shared/form/CustomInput/CustomInput.vue';
import CustomForm from '../shared/form/CustomForm.vue';
import { useEmploymentStore } from '../../store/employmentStore';
import { useFormParametersStore } from '../../store/formParametersStore';
import { isRequiredObjName, maxStringObjName, minStringObjName, isNumber, isPositiveNumber, isRequired } from '../../utils/validationRules';
import { debounce } from '../../utils/debounce';
import { storeToRefs } from 'pinia';
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router'
import { useChatsStore } from '../../store/chatsStore';
import { useAuthStore } from '../../store/authStore';
import { getVacancyOffer } from '../../store/actions/vacancy';
import { getCandidateOffer } from '../../store/actions/candidate';

const router = useRouter();
const { isLoading, isError, vacancies, candidates } = storeToRefs(useEmploymentStore())
const { setCandidates, setVacancies } = useEmploymentStore();
const { professions } = storeToRefs(useFormParametersStore());
const { getProfessions, setProfesion, setExperience } = useFormParametersStore();
const { companies, candidates: formCandidates, role } = storeToRefs(useAuthStore());
const { generatePDF } = useChatsStore();
const { lastPage } = storeToRefs(useChatsStore());

const dialogAddResume = ref(false);
const profession = ref({ id: '', name: '' });
const experience = ref('0');
const form = ref(null);

const company = ref(null);
const vacancy = ref(null);
const candidate = ref(null);
const formOffer = ref(null);
const formVacancies = ref([]);
const page = ref(1);


const professionRules = computed(() => [isRequiredObjName, maxStringObjName(200), minStringObjName(3)]);
const experienceRules = computed(() => [isNumber, isPositiveNumber]);
const companyRules = computed(() => [isRequired]);
const vacancyRules = computed(() => [isRequired]);
const candidateRules = computed(() => [isRequired]);

function addResume() {

    const isFormValid = form.value.validate()
    if (isFormValid) {
        setProfesion(profession.value);
        setExperience(experience.value);

        dialogAddResume.value = false;
        router.push({
            path: '/candidates/create',
        })
    }
}

function hendelOffer() {
    const isFormValid = formOffer.value.validate()
    if (isFormValid) {
        if (role.value === 3) {
            getCandidateOffer(candidate.value);
        }
        if (role.value === 2) {

            getVacancyOffer(vacancy.value);
        }
    }
}

const modCandidates = computed(() =>
    formCandidates.value.map(item => ({ id: item.id, name: item.title }))
)

watch(formCandidates, (newVal, oldVal) => {
    if (!oldVal[0] && newVal[0]) {
        candidate.value = String(newVal[0].id);
        if (newVal[0].id) {
            getCandidateOffer(newVal[0].id);
        }
    }
})

watch(companies, (newVal, oldVal) => {
    if (!oldVal[0] && newVal[0]) {
        company.value = String(newVal[0].id);
        vacancy.value = String(newVal[0].vacancies[0].id)

        if (newVal[0].vacancies[0].id) {
            getVacancyOffer(newVal[0].vacancies[0].id);
        }
    }
})
watch(company, (newVal, oldVal) => {
    if (newVal) {

        const data = companies.value.find(item => item.id == newVal)?.vacancies ?? []
        formVacancies.value = data.map(item => ({ id: item.id, name: item.title }))
        vacancy.value = String(data[0].id)

    }
})

watch(experience, (newVal) => {
    experience.value = String(Number(newVal) * 1);
})

watch(profession, () => {
    debounce(() => {
        getProfessions(profession.value.name, 20);
    },
        200)
})
getProfessions('', 10);
setCandidates([]);
setVacancies([]);
</script>
  
<style scoped>
.wrapper_flex {
    display: flex;
    align-items: center;
}

.input {
    margin: 0 5px;
}

div.card-form {
    overflow: visible !important;
}
</style>