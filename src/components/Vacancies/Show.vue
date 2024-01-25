<script setup>
// import Modal from './shared/Modal.vue';
import NoFound from '.././NoFound.vue';
// import Reviews from './Reviews.vue'
// import ActivPanel from './ActivPanel.vue';
import { useEmploymentStore } from "../../store/employmentStore";
import { useAuthStore } from '../../store/authStore.js';
// import { useReviewsStore } from '../store/reviewsStore';
import useComputed from '../../utils/useComputed';
import { ref, defineProps } from 'vue'
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router'
const router = useRouter();


const { id } = defineProps({
    id: String,
});


const { getVacancy, deleteVacancy } = useEmploymentStore();
const { vacancy, isLoading } = storeToRefs(useEmploymentStore())

const dialogDelete = ref(false);

function handDestroy() {
    deleteVacancy(id)
    dialogDelete.value = false;
    router.push({
        path: '/companies',
    })
}

function redirectTo(path) {

    router.push({
        path,
    })
}

getVacancy(id);

</script>

<template>
    <div class="">
        <v-container>
            <v-row>
                <v-col>
                    <v-card>
                        <v-card-title>{{ vacancy.title }}</v-card-title>
                        <v-img v-if="vacancy?.company?.image" :src="vacancy.company.image" height="200" width="200"
                            cover></v-img>
                        <img v-if="!vacancy?.company?.image" height="200" width="200"
                            src="/src/assets/images/fix-poster.jpg" alt="Постер фільму відсутній">
                        <v-card-text>

                            <v-row>
                                <router-link :to="`/companies/${vacancy.company?.id}`">
                                    <v-col>
                                        <strong>Company:</strong> {{ vacancy.company?.name }}
                                    </v-col>
                                </router-link>
                            </v-row>
                            <v-row>
                                <v-col>
                                    <strong>Profession:</strong> {{ vacancy.profession }}
                                </v-col>

                            </v-row>
                            <v-row>
                                <v-col>
                                    <strong>Salary:</strong> {{ vacancy.salary }} - {{ vacancy.max_salary }}
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>
                                    <strong>Area:</strong> {{ vacancy.area }}
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>
                                    <strong>Nature:</strong> {{ vacancy.nature }}
                                </v-col>
                                <v-col>
                                    <strong>Type:</strong> {{ vacancy.type }}
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>
                                    <strong>Description:</strong> {{ vacancy.description }}
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>
                                    <strong>Skills:</strong>
                                    <v-chip v-for="skill, i in vacancy.skills" :key="i" variant="flat" color="secondary">
                                        {{ skill }}
                                    </v-chip>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>

        <NoFound v-if="!vacancy && !isLoading" />
    </div>
</template>

    
<style scoped>
.btn-box {
    padding: 5px;
    display: flex;
    justify-content: center;
}

.box {
    padding: 5px;
}

.show-video__playr {
    height: 70vh;
    width: 70vw
}

.modal-footer {
    display: flex;
    justify-content: space-around;
}

.film_box {
    background-size: cover;
    background-repeat: no-repeat;
}

.film_box-background {
    background-image: linear-gradient(to right, rgba(220.5, 220.5, 220.5, 1) calc((50vw - 170px) - 340px), rgba(220.5, 220.5, 220.5, 0.44) 50%, rgba(220.5, 220.5, 220.5, 0.84) 100%);
    display: flex;
    align-items: flex-end;
}

.film_img-box {
    padding: 15px;

}

.film_img {
    box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);
}

.film_info {
    border-radius: 30px 30px 0 0;
    background-image: linear-gradient(to right, rgba(220.5, 220.5, 220.5, 1) 0, rgba(220.5, 220.5, 220.5, 0.44) 50%, rgba(220.5, 220.5, 220.5, 0.84) 100%);
    box-shadow: 0px -14px 32px 3px rgba(220.5, 220.5, 220.5, 1), 0px 0px 0px -4px rgba(220.5, 220.5, 220.5, 1)
}
</style>