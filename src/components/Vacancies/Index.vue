<template>
    <div>
        <Loader v-if="isLoading" />
        <FilterBox class="filter">
            <CustomInput v-model="name" label='Search:' class="filter_input" />
            <CustomOneSearchSelect v-model="profession" class="" :label="'profession'" name="profession"
                :list-class="'relative'" :options="professions" :noBtn="true" />
            <CustomOneSearchSelect v-model="area" class="" :label="'area'" name="area" :list-class="'relative'"
                :options="areas" :noBtn="true" />
        </FilterBox>

        <NoFoundJob v-if="!isLoading && !vacancies[0]" class="full-box" />

        <div v-if="!isLoading && vacancies[0]">
            <template v-for="vacancy in vacancies">
                <router-link :to="`/vacancies/${vacancy.id}`">

                    <v-col cols="12">
                        <v-card class="mx-auto card" prepend-icon="mdi-twitter" :title="vacancy.title">
                            <template v-slot:prepend>
                                {{ vacancy.profession }}
                            </template>

                            <v-card-text class="text-h5 py-2">
                                {{ vacancy.description }}
                            </v-card-text>

                            <v-card-actions>
                                <v-list-item class="w-100">
                                    <template v-slot:prepend>
                                        <v-avatar color="grey-darken-3" :image="vacancy.company.image"></v-avatar>
                                    </template>

                                    <v-list-item-title>{{ vacancy.company.name }}</v-list-item-title>

                                    <v-list-item-subtitle>Sarary: {{ vacancy.salary }} - {{ vacancy.max_salary
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
            <v-pagination v-model="page" :length="lastPage" :total-visible="6"></v-pagination>

        </div>
    </div>
</template>


<script setup>
import FilterBox from "../shared/FilterBox.vue"
import CustomInput from "../shared/form/CustomInput/CustomInput.vue";
import CustomOneSearchSelect from "../shared/form/CustomInput/CustomOneSearchSelect.vue";
import NoFoundJob from "../NoFoundJob.vue";
import Loader from "../Loader.vue";
import { storeToRefs } from "pinia"
import { debounce } from "../../utils/debounce"
import { useEmploymentStore } from '../../store/employmentStore';
import { useFormParametersStore } from '../../store/formParametersStore';
import { getVacancies } from "../../store/actions/vacancy"
import { ref, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const { vacancies, lastPage, isLoading } = storeToRefs(useEmploymentStore());
const { professions, areas } = storeToRefs(useFormParametersStore());
const { getProfessions, getAreas } = useFormParametersStore();
import { getProfesionById, getAreaById } from "../../store/actions/form";

const router = useRouter();
const route = useRoute();

const name = ref(route.query?.name || "");
const page = ref(Number(route.query?.page) || 1);
const profession = ref({ id: '', name: '' });
const area = ref({ id: '', name: '' });

function redirectTo(path) {

    router.push({
        path,
    })
}

watch(vacancies, () => {
    const query = {};

    if (name.value) query.name = name.value;
    if (area.value.id) query.area = area.value.id;
    if (profession.value.id) query.profession = profession.value.id;
    // if (newSort) query.sort = newSort;
    if (page.value && page.value !== 1) query.page = page.value;

    router.push({ query });
});


watch(
    [name, area, profession, page],
    (
        [newName, newArea, newProfession, newPage],
        [oldName, oldArea, oldProfession, oldPage]
    ) => {

        if (newPage === oldPage) page.value = 1;

        debounce(() => {
            getVacancies(newName, newProfession.id, newArea.id, newPage);
        }, 200, 'getVacancies');

    });

watch(area, (newArea) => {
    debounce(() => { getAreas(newArea.name, 50) }, 200)
})

watch(profession, (newProfession) => {
    debounce(() => { getProfessions(newProfession.name, 50) }, 200)
})

onMounted(async () => {
    getVacancies(
        route.query?.name,
        route.query?.profession,
        route.query?.area,
        route.query?.page
    );

    const [professionById, areaById] = await Promise.all(
        [
            getProfesionById(route.query?.profession),
            getAreaById(route.query?.area)
        ]);

    profession.value = professionById;
    area.value = areaById;
    getAreas(areaById.name, 50)
    getProfessions(professionById.name, 50)
})

</script>
  
<style lang="scss" scoped>
@import "../../assets/scss/variables.scss";

.filter {
    display: flex;
    justify-content: space-between;
    border-radius: 0 0 10px 10px;
}

.btn {
    margin: 0;
    min-width: 60px;
}

.card {
    background-color: $bg-secondary-color;
}

.filter_input {
    margin-bottom: -30px;
}

.full-box {
    margin-top: -45px;
}
</style>