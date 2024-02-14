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
                <div v-if="role == 2">
                    <v-btn density="comfortable" icon="mdi-arrow-down-bold-outline" class="sort_btn-text"
                        :class="{ 'active': sort === 'vote' && isdesc }" @click="setSort('vote', true)"></v-btn>
                    <span class="text_sort">rating</span>
                    <v-btn density="comfortable" icon="mdi-arrow-up-bold-outline" class="sort_btn-text"
                        :class="{ 'active': sort === 'vote' && !isdesc }" @click="setSort('vote', false)"></v-btn>
                </div>

            </div>

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
import CustomInput from "../shared/form/CustomInput.vue";
import CustomOneSearchSelect from "../shared/form/CustomOneSearchSelect.vue";
import NoFound from "../NoFound.vue"
import Loader from "../Loader.vue";

import { useAuthStore } from "../../store/authStore"
import { storeToRefs } from "pinia"
import { debounce } from "../../utils/debounce"
import { useEmploymentStore } from '../../store/employmentStore';
import { useFormParametersStore } from '../../store/formParametersStore';
import { ref, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getCandidates } from '../../store/actions/candidate';
import { getProfesionById, getAreaById } from "../../store/actions/form";

const { candidates, lastPage, isLoading } = storeToRefs(useEmploymentStore());
const { professions, areas } = storeToRefs(useFormParametersStore());
const { getProfessions, getAreas } = useFormParametersStore();
const { role } = storeToRefs(useAuthStore());

const router = useRouter();
const route = useRoute();

const name = ref(route.query?.name || '')
const page = ref(Number(route.query?.page) || 1);
const profession = ref({ id: '', name: '' });
const area = ref({ id: '', name: '' });
const isdesc = ref(route.query?.isdesc || true);
const sort = ref(route.query?.sort || 'created_at');

function setSort(name, value) {
    sort.value = name;
    isdesc.value = value;
}

watch(candidates, () => {
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
            getCandidates(newName, newProfession.id, newArea.id, newPage, newSort, newIsdesc);
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

.card {
    background-color: $bg-secondary-color;
}

.filter_input {
    margin-bottom: 0;
}

.active {
    background-color: aquamarine;
}
</style>