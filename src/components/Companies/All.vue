<template>
    <div>
        <FilterBox class="filter">
            <CustomInput v-model="name" :label="'Name:'" />
            <CustomInput v-model="area" :label="'Address:'" />
            <v-btn v-if="role === 2" @click="redirectTo('/companies/create')">
                Add company
            </v-btn>
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
import CustomInput from "../shared/CustomInput.vue"
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

const name = ref("")
const area = ref('')

const router = useRouter();

function redirectTo(path) {

    router.push({
        path,
    })
}

watch(name, () => {
    debounce(() => {
        getCompanies(name.value, area.value);
    },
        200)
})

watch(area, () => {
    debounce(() => {
        getCompanies(name.value, area.value);
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
}

.btn {
    margin: 0;
    min-width: 60px;
}
</style>