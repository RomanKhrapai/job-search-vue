<template>
    <div>
        <Loader v-if="isLoading" />
        <div>
            <FilterBox class="filter">
                <CustomInput v-model="name" :label="'Search name:'" class="filter_input" />
                <CustomInput v-model="area" :label="'Search address:'" class="filter_input" />
                <div class="sort_desc">

                    <v-btn v-if="isdesc" density="comfortable" icon="mdi-sort-ascending" class="sort_btn-text"
                        @click="isdesc = false"></v-btn>
                    <v-btn v-else density="comfortable" icon="mdi-sort-descending" class="sort_btn-text"
                        @click="isdesc = true"></v-btn>


                    <v-btn density="comfortable" icon="mdi-timer-check-outline" class="sort_btn-text"
                        :class="{ 'active': sort === 'created_at' }" @click="sort = 'created_at'"></v-btn>

                    <v-btn density="comfortable" icon="mdi-star-circle-outline" class="sort_btn-text"
                        :class="{ 'active': sort === 'received_reviews_avg_vote' }"
                        @click="sort = 'received_reviews_avg_vote'"></v-btn>
                </div>
            </FilterBox>

            <NoFound v-if="!isLoading && companies.length === 0" />
            <div v-if="!isLoading && companies.length !== 0">
                <v-row no-gutters>
                    <v-col v-for="company in companies" :key="company.id" cols="12" sm="4">

                        <v-sheet class="ma-2 pa-2">
                            <v-card class="mx-auto" @click="redirectTo(`/companies/${company.id}`)" max-width="344">

                                <v-img v-if="company.image" :src="company.image" height="200" width="200" cover></v-img>
                                <img v-if="!company.image" height="200" width="200" src="/src/assets/images/fix-poster.jpg"
                                    alt="Постер фільму відсутній">
                                <v-card-title>
                                    {{ company.name }}
                                </v-card-title>
                                <v-rating half-increments :length="5" readonly :size="28" :model-value="company.avgVote / 2"
                                    color="warning" active-color="warning" />
                                <v-card-subtitle>
                                    Вакансій: {{ company.vacancies.length }}
                                </v-card-subtitle>
                            </v-card>
                        </v-sheet>
                    </v-col>

                </v-row>
                <v-pagination v-model="page" :length="lastPage" :total-visible="6"></v-pagination>
            </div>
        </div>
    </div>
</template>


<script setup>
import FilterBox from "../shared/FilterBox.vue"
import CustomInput from "../shared/form/custominput/CustomInput.vue";
import NoFound from "../NoFound.vue"
import Loader from "../Loader.vue";

import { useAuthStore } from "../../store/authStore"
import { storeToRefs } from "pinia"
import { debounce } from "../../utils/debounce"
import { useEmploymentStore } from '../../store/employmentStore';
import { ref, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getCompanies } from "../../store/actions/company"

const { role } = storeToRefs(useAuthStore());
const { companies, lastPage, isLoading } = storeToRefs(useEmploymentStore());

const router = useRouter();
const route = useRoute()


const name = ref(route.query?.name || '');
const area = ref(route.query?.area || '');
const isdesc = ref(route.query?.isdesc || false);
const sort = ref(route.query?.sort || '');
const page = ref(Number(route.query?.page) || 1);

function redirectTo(path) {

    router.push({
        path,
    })
}

watch([name, area, isdesc, sort, page], ([newName, newArea, newIsdesc, newSort, newPage]) => {

    const query = {};
    if (newName) query.name = newName;
    if (newArea) query.area = newArea;
    if (newIsdesc) query.isdesc = newIsdesc;
    if (newSort) query.sort = newSort;
    if (newPage && newPage !== 1) query.page = newPage;
    router.push({ query });
    debounce(() => {
        getCompanies(newName, newArea, newIsdesc, newSort, newPage);
    },
        200)
},
    { immediate: true })

</script>
  
<style scoped>
.filter {
    display: flex;
    justify-content: space-between;
    border-radius: 0 0 15px 15px;
}

.btn {
    margin: 0;
    min-width: 60px;
}

.filter_input {
    margin-bottom: -30px;
}

.swich_hide .v-selection-control__wrapper {
    visibility: hidden;
    height: 0;
    width: 0;
}

.sort_desc {
    display: flex;
    align-items: center;
}

.sort_btn-text {
    margin: 5px;
}

.active {
    background-color: aquamarine;
}
</style>