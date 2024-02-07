<template>
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
                        <!-- <StarsRating :rating="company.rating"></StarsRating> -->
                        <!-- <div class="btn-box" v-if="company?.idDoc">
                            <v-btn v-if="company?.idDoc" @click.stop="delfilm(company.idDoc)">
                                видалити
                            </v-btn>
                        </div> -->

                    </v-card>
                </v-sheet>
            </v-col>
        </v-row>
        <!-- <Pagination /> -->
    </div>
</template>


<script setup>
import FilterBox from "../shared/FilterBox.vue"
import CustomInput from "../shared/form/custominput/CustomInput.vue";
// import Button from "../shared/form/Button/Button.vue";
import { useAuthStore } from "../../store/authStore"
// import { useGenreStore } from "../store/genresStore"
import { storeToRefs } from "pinia"
import { debounce } from "../../utils/debounce"
// import Pagination from "./Pagination.vue"
import { useEmploymentStore } from '../../store/employmentStore';
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getCompanies } from "../../store/actions/company"

const employmentStore = useEmploymentStore();

const { role } = storeToRefs(useAuthStore());
const { companies } = storeToRefs(employmentStore);

const name = ref("");
const area = ref('');
const isdesc = ref(false);
const sort = ref('');


const router = useRouter();

function redirectTo(path) {

    router.push({
        path,
    })
}
watch([name, area, isdesc, sort], ([newName, newArea, newIsdesc, newSort]) => {
    debounce(() => {
        getCompanies(newName, newArea, newIsdesc, newSort);
    },
        200)
})

onMounted(() => {
    getCompanies();
})

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
    /*  display: flex;
    justify-content: center;
    align-items: center;
    background-color: aquamarine;
    height: 30px;
    width: 30px;
    border-radius: 15px;
    border: solid #00000012; */
}

.active {
    background-color: aquamarine;
}
</style>