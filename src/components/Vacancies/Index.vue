<template>
    <div>
        <Loader v-if="isLoading" />
        <FilterBox>
            <div class="row">
                <CustomInput v-model="name" label='Search:' class="filter_input" />
                <CustomOneSearchSelect v-model="profession" class="" :label="'profession'" name="profession"
                    :list-class="'relative'" :options="professions" :noBtn="true" />
                <CustomOneSearchSelect v-model="area" class="" :label="'area'" name="area" :list-class="'relative'"
                    :options="areas" :noBtn="true" />
            </div>
            <div class="row_sort ">
                <div> <v-btn density="comfortable" icon="mdi-sort-clock-ascending-outline" class="sort_btn-text"
                        :class="{ 'active': sort === 'created_at' && isdesc }" @click="setSort('created_at', true)"></v-btn>
                    <span class="text_sort">creation date</span>
                    <v-btn density="comfortable" icon="mdi-sort-clock-descending-outline" class="sort_btn-text"
                        :class="{ 'active': sort === 'created_at' && !isdesc }"
                        @click="setSort('created_at', false)"></v-btn>
                </div>
                <div>
                    <v-btn density="comfortable" icon="mdi-arrow-down-bold-outline" class="sort_btn-text"
                        :class="{ 'active': sort === 'salary' && isdesc }" @click="setSort('salary', true)"></v-btn>
                    <span class="text_sort">salary</span>
                    <v-btn density="comfortable" icon="mdi-arrow-up-bold-outline" class="sort_btn-text"
                        :class="{ 'active': sort === 'salary' && !isdesc }" @click="setSort('salary', false)"></v-btn>
                </div>
                <div>
                    <v-btn density="comfortable" icon="mdi-arrow-down-bold-outline" class="sort_btn-text"
                        :class="{ 'active': sort === 'vote' && isdesc }" @click="setSort('vote', true)"></v-btn>
                    <span class="text_sort">rating</span>
                    <v-btn density="comfortable" icon="mdi-arrow-up-bold-outline" class="sort_btn-text"
                        :class="{ 'active': sort === 'vote' && !isdesc }" @click="setSort('vote', false)"></v-btn>
                </div>

            </div>

        </FilterBox>

        <NoFoundJob v-if="!isLoading && !vacancies[0]" class="full-box" />

        <div v-if="!isLoading && vacancies[0]">
            <Vacancies v-if="!isLoading && vacancies[0]" :vacancies="vacancies" />
            <v-pagination v-model="page" :length="lastPage" :total-visible="6"></v-pagination>

        </div>
    </div>
</template>


<script setup>
import Vacancies from "./Vacancies.vue";
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
const isdesc = ref(route.query?.isdesc || false);
const sort = ref(route.query?.sort || '');

function setSort(name, value) {
    sort.value = name;
    isdesc.value = value;
}

watch(vacancies, () => {
    const query = {};

    if (name.value) query.name = name.value;
    if (area.value.id) query.area = area.value.id;
    if (profession.value.id) query.profession = profession.value.id;
    if (sort.value) query.sort = sort.value;
    if (isdesc.value) query.isdesc = isdesc.value;
    if (page.value && page.value !== 1) query.page = page.value;

    router.push({ query });
});


watch(
    [name, area, profession, page, sort, isdesc],
    (
        [newName, newArea, newProfession, newPage, newSort, newIsdesc],
        [oldName, oldArea, oldProfession, oldPage, oldSort, oldIsdesc]
    ) => {

        if (newPage === oldPage) page.value = 1;

        debounce(() => {
            getVacancies(newName, newProfession.id, newArea.id, newPage, newSort, newIsdesc);
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
        route.query?.page,
        route.query?.sort,
        route.query?.isdesc
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

.row {
    display: flex;
    justify-content: space-between;
}

.row_sort {
    padding: 5px;
    display: flex;
    justify-content: space-around;
}

.text_sort {
    padding: 10px;
}

.btn {
    margin: 0;
    min-width: 60px;
}



.filter_input {
    margin-bottom: -30px;
}

.full-box {
    margin-top: -45px;
}

.active {
    background-color: aquamarine;
}
</style>