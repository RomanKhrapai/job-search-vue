<template>
    <div>
        <router-link to="/companies/create">
            <v-btn color="green-darken-1" variant="text">
                add company
            </v-btn>
        </router-link>
        <!-- <router-link to="/companies/create"> -->
        <router-link :to="{ name: 'user-update' }">
            <v-btn color="green-darken-1" variant="text">
                Update user
            </v-btn>
        </router-link>

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
                            :rules="professionRules" name="profession" :list-class="'relative'" :options="professions" />

                        <CustomInput v-model="experience" type="number" autocomplete="experience"
                            placeholder="enter experience" name="experience" :rules="experienceRules" class="login__input"
                            :label="'experience (months)'" />

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
</template>

<script setup>

import CustomOneSearchSelect from '../shared/form/CustomInput/CustomOneSearchSelect.vue';
import CustomInput from '../shared/form/CustomInput/CustomInput.vue';
import CustomForm from '../shared/form/CustomForm.vue';
import { useEmploymentStore } from '../../store/employmentStore';
import { useFormParametersStore } from '../../store/formParametersStore';
import { isRequired, maxString, minString, isNumber, isPositiveNumber } from '../../utils/validationRules';
import { debounce } from '../../utils/debounce';
import { storeToRefs } from 'pinia';
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router'

const router = useRouter();
const { isLoading, isError } = storeToRefs(useEmploymentStore())
const { professions } = storeToRefs(useFormParametersStore());
const { getProfessions, setProfesion, setExperience } = useFormParametersStore();

const dialogAddResume = ref(false);
const profession = ref({ id: '', name: '' });
const experience = ref('0');
const form = ref(null)


const professionRules = computed(() => [isRequired, maxString(200), minString(3)]);
const experienceRules = computed(() => [isNumber, isPositiveNumber]);


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

watch(experience, (newVal) => {
    experience.value = String(Number(newVal) * 1);
})

watch(profession, () => {
    debounce(() => {
        getProfessions(profession.value.name, 10);
    },
        200)
})


getProfessions('', 10);
</script>
  
<style scoped></style>