<template>
    <div>

        <div class="office_wrapper">
            <router-link v-if="role === 2" to="/companies/create" class="office_link">
                <v-btn class="office_link__btn" variant="text">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512">
                        <path fill="currentColor"
                            d="M459.94 53.25a16.06 16.06 0 0 0-23.22-.56L424.35 65a8 8 0 0 0 0 11.31l11.34 11.32a8 8 0 0 0 11.34 0l12.06-12c6.1-6.09 6.67-16.01.85-22.38M399.34 90L218.82 270.2a9 9 0 0 0-2.31 3.93L208.16 299a3.91 3.91 0 0 0 4.86 4.86l24.85-8.35a9 9 0 0 0 3.93-2.31L422 112.66a9 9 0 0 0 0-12.66l-9.95-10a9 9 0 0 0-12.71 0" />
                        <path fill="currentColor"
                            d="M386.34 193.66L264.45 315.79A41.08 41.08 0 0 1 247.58 326l-25.9 8.67a35.92 35.92 0 0 1-44.33-44.33l8.67-25.9a41.08 41.08 0 0 1 10.19-16.87l122.13-121.91a8 8 0 0 0-5.65-13.66H104a56 56 0 0 0-56 56v240a56 56 0 0 0 56 56h240a56 56 0 0 0 56-56V199.31a8 8 0 0 0-13.66-5.65" />
                    </svg>
                    Add company
                </v-btn>
            </router-link>
            <router-link :to="{ name: 'chat' }" class="office_link">
                <v-btn class="office_link__btn" variant="text">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                        <path fill="currentColor"
                            d="M19 6q-1.25 0-2.125-.875T16 3q0-1.25.875-2.125T19 0q1.25 0 2.125.875T22 3q0 1.25-.875 2.125T19 6M2 22V4q0-.825.588-1.412T4 2h10.1q-.1.5-.1 1t.1 1q.125.575.35 1.075T15 6H6v2h13q.8 0 1.575-.25T22 7v9q0 .825-.587 1.413T20 18H6zm4-11h12V9H6zm0 3h8v-2H6z" />
                    </svg>
                    Chat
                </v-btn>
            </router-link>
            <!-- <router-link to="/companies/create"> -->
            <router-link :to="{ name: 'user-update' }" class="office_link">
                <v-btn class="office_link__btn" variant="text">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
                        <path fill="currentColor"
                            d="M14.654 21.846q-.529 0-.9-.37q-.37-.37-.37-.9v-5.922q0-.529.37-.9q.371-.37.9-.37h5.923q.529 0 .899.37q.37.371.37.9v5.923q0 .529-.37.899t-.9.37zm0-1.27h5.923v-.684q-.529-.66-1.294-1.045q-.766-.385-1.668-.385q-.902 0-1.667.385q-.765.386-1.294 1.045zm2.961-2.96q.53 0 .9-.37q.37-.371.37-.9t-.37-.899q-.37-.37-.9-.37q-.528 0-.899.37q-.37.37-.37.9q0 .528.37.898t.9.37M11.972 9.5q-1.046 0-1.773.727q-.727.727-.727 1.773q0 .796.415 1.408q.416.611 1.112.904v-1.135q-.238-.2-.383-.532q-.144-.332-.144-.645q0-.625.438-1.062t1.062-.438q.35 0 .635.138q.284.137.484.362h1.154q-.286-.677-.891-1.088q-.605-.412-1.382-.412M10.135 21l-.362-2.892q-.479-.145-1.035-.454q-.557-.31-.948-.664l-2.667 1.135l-1.865-3.25l2.305-1.738q-.044-.272-.073-.56q-.028-.287-.028-.558q0-.252.028-.53t.073-.626L3.258 9.125l1.865-3.212L7.771 7.03q.448-.373.97-.673q.52-.3 1.013-.464L10.134 3h3.731l.362 2.912q.575.201 1.016.463q.442.262.909.654l2.725-1.116l1.865 3.212l-2.279 1.721q.02.039.02.077q0 .039.019.077h-1.179q-.025-.125-.04-.234q-.016-.108-.066-.233l2.227-1.683l-.994-1.7l-2.552 1.07q-.454-.499-1.193-.934t-1.4-.578L13 4h-1.994l-.312 2.688q-.756.162-1.39.52q-.633.36-1.26.986L5.55 7.15l-.994 1.7l2.169 1.62q-.125.336-.175.73q-.05.394-.05.82q0 .38.05.755t.156.73l-2.15 1.645l.994 1.7l2.475-1.05q.6.606 1.36 1.002q.76.396 1.615.579V21z" />
                    </svg>
                    Update user
                </v-btn>
            </router-link>
            <v-btn v-if="role === 2" variant="text" @click="generatePDF" class="office_link btn--report">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                    <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5">
                        <path
                            d="M17 9.002c2.175.012 3.353.109 4.121.877C22 10.758 22 12.172 22 15v1c0 2.829 0 4.243-.879 5.122C20.243 22 18.828 22 16 22H8c-2.828 0-4.243 0-5.121-.878C2 20.242 2 18.829 2 16v-1c0-2.828 0-4.242.879-5.121c.768-.768 1.946-.865 4.121-.877" />
                        <path stroke-linejoin="round" d="M12 2v13m0 0l-3-3.5m3 3.5l3-3.5" />
                    </g>
                </svg>
                Download report
            </v-btn>

            <v-dialog v-model="dialogAddResume" width="auto" class="office_link">
                <template v-slot:activator="{ props }">
                    <v-btn class="office_link btn--report" v-bind="props">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                stroke-width="2"
                                d="m12 20l-7.5-7.428A5 5 0 1 1 12 6.006a5 5 0 1 1 7.96 6.053M16 19h6m-3-3v6" />
                        </svg>
                        Add resume
                    </v-btn>
                </template>
                <v-card class="card-form">
                    <CustomForm ref="form" class="login__form" @submit.prevent="addResume">

                        <v-card-title class="text-h5"> To create a resume, select a profession
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
                            <v-btn color="green-darken-1" variant="text" type="submit">Add resume
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

.office_wrapper {
    display: grid;
    grid-template-columns: auto auto auto;
    grid-template-rows: auto auto;
    gap: 20px;
    grid-auto-flow: row dense;
}

.office_link {
    background-color: #ffffff;
    height: 80px;
    text-align: center;
    border-radius: 10px;
    box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);
}

.office_link__btn {
    color: #0E2954;
    width: 100%;
    height: 100%;
}

.btn--report {
    color: #0E2954;
    width: 100%;
    height: 80px;
}
</style>