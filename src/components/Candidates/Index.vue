<template>
    <div>
        <FilterBox class="filter">
            <CustomInput v-model="name" label='Search:' class="filter_input" />
            <CustomOneSearchSelect v-model="profession" class="" :label="'profession'" name="profession"
                :list-class="'relative'" :options="professions" :noBtn="true" />
            <CustomOneSearchSelect v-model="area" class="" :label="'area'" name="area" :list-class="'relative'"
                :options="areas" :noBtn="true" />
        </FilterBox>

        <template v-for="candidate in candidates">
            <router-link :to="`/candidates/${candidate.id}`">

                <v-col cols="12">
                    <v-card class="mx-auto card" prepend-icon="mdi-twitter" :title="candidate.title">
                        <template v-slot:prepend>
                            {{ candidate.profession }}
                        </template>

                        <v-card-text class="text-h5 py-2">
                            {{ truncatedText(candidate.description, 130) }}
                        </v-card-text>

                        <v-card-actions>
                            <v-list-item class="w-100">
                                <template v-slot:prepend>
                                    <v-avatar color="grey-darken-3" :image="candidate.user.image"></v-avatar>
                                </template>

                                <v-list-item-title>{{ candidate.user.name }}</v-list-item-title>

                                <v-list-item-subtitle>Sarary: {{ candidate.salary }} {{ candidate.max_salary ? '-' : '' }}
                                    {{
                                        candidate.max_salary
                                    }}</v-list-item-subtitle>

                                <template v-slot:append>
                                    <div class="justify-self-end">
                                        <v-icon class="me-1" icon="mdi-heart"></v-icon>
                                        <span class="subheading me-2">256</span>
                                        <span class="me-1">·</span>
                                        <v-icon class="me-1" icon="mdi-share-variant"></v-icon>
                                        <span class="subheading">45</span>
                                    </div>
                                </template>
                            </v-list-item>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </router-link>
        </template>
        <!-- <Pagination /> -->

    </div>
</template>


<script setup>
import FilterBox from "../shared/FilterBox.vue"
import CustomInput from "../shared/form/CustomInput/CustomInput.vue";
import CustomOneSearchSelect from "../shared/form/CustomInput/CustomOneSearchSelect.vue";
import { useAuthStore } from "../../store/authStore"
// import { useGenreStore } from "../store/genresStore"
import { storeToRefs } from "pinia"
import { debounce } from "../../utils/debounce"
// import Pagination from "./Pagination.vue"
import { useEmploymentStore } from '../../store/employmentStore';
import { useFormParametersStore } from '../../store/formParametersStore';
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { getCandidates } from '../../store/actions/candidate';

const employmentStore = useEmploymentStore();

const { candidates } = storeToRefs(employmentStore);
const { professions, areas } = storeToRefs(useFormParametersStore());
const { getProfessions, getAreas } = useFormParametersStore();

const name = ref("")
const profession = ref({ id: '', name: '' });
const area = ref({ id: '', name: '' });

const router = useRouter();

function redirectTo(path) {

    router.push({
        path,
    })
}

function truncatedText(text, maxLength = 200) {
    if (text.length > maxLength) {
        return text.slice(0, maxLength) + '...';
    } else {
        return text;
    }
}

watch(name, () => {
    debounce(() => {
        getCandidates(name.value, profession.value.id, area.value.id);
    },
        200)
})

watch(area, () => {
    debounce(() => {
        if (area.value.id) {
            getCandidates(name.value, profession.value.id, area.value.id);
        }
        getAreas(areas.value.name, 10);
    },
        200)
})
watch(profession, () => {
    debounce(() => {
        if (profession.value.id) {
            getCandidates(name.value, profession.value.id, area.value.id);
        }
        getProfessions(profession.value.name, 10);
    },
        200)
})




onMounted(() => {
    if (!professions?.length !== 0) {
        getProfessions('', 10);
    }
    if (!areas?.length !== 0) {
        getAreas('', 10);
    }

    getCandidates();
})

</script>
  
<style lang="scss" scoped>
@import "../../assets/scss/variables.scss";

.filter {
    display: flex;
    justify-content: space-between;
}

.btn {
    margin: 0;
    min-width: 60px;
}

.card {
    background-color: $bg-secondary-color;
}
</style>