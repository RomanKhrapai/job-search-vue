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

        <NoFound v-if="!isLoading && candidates.length === 0" />

        <div v-if="!isLoading && candidates.length !== 0">
            <Candidates v-if="!isLoading && candidates[0]" :candidates="candidates" />
            <v-pagination v-model="page" :length="lastPage" :total-visible="6"></v-pagination>

        </div>
    </div>
</template>


<script setup>
import Candidates from "./Candidates.vue";
import FilterBox from "../shared/FilterBox.vue"
import CustomInput from "../shared/form/CustomInput/CustomInput.vue";
import CustomOneSearchSelect from "../shared/form/CustomInput/CustomOneSearchSelect.vue";
import NoFound from "../NoFound.vue"
import Loader from "../Loader.vue";

import { useAuthStore } from "../../store/authStore"
import { storeToRefs } from "pinia"
import { debounce } from "../../utils/debounce"
import { useEmploymentStore } from '../../store/employmentStore';
import { useFormParametersStore } from '../../store/formParametersStore';
import { ref, watch, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getCandidates } from '../../store/actions/candidate';
import { getProfesionById, getAreaById } from "../../store/actions/form";

const { candidates, lastPage, isLoading } = storeToRefs(useEmploymentStore());
const { professions, areas } = storeToRefs(useFormParametersStore());
const { getProfessions, getAreas } = useFormParametersStore();

const router = useRouter();
const route = useRoute();

const name = ref(route.query?.name || '')
const page = ref(Number(route.query?.page) || 1);
const profession = ref({ id: '', name: '' });
const area = ref({ id: '', name: '' });

watch(candidates, () => {
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
            getCandidates(newName, newProfession.id, newArea.id, newPage);
        }, 200, 'getCandidates');

    });

watch(area, (newArea) => {
    debounce(() => { getAreas(newArea.name, 50) }, 200)
})

watch(profession, (newProfession) => {
    debounce(() => { getProfessions(newProfession.name, 50) }, 200)
})

onMounted(async () => {
    getCandidates(
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
}

.btn {
    margin: 0;
    min-width: 60px;
}

.card {
    background-color: $bg-secondary-color;
}
</style>