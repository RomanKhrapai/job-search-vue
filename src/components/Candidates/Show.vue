<script setup>
// import Modal from './shared/Modal.vue';
import NoFound from '.././NoFound.vue';
// import Reviews from './Reviews.vue'
// import ActivPanel from './ActivPanel.vue';
import { useEmploymentStore } from "../../store/employmentStore";
import { storeCandidate } from '../../store/actions/candidate';
// import { useReviewsStore } from '../store/reviewsStore';
import useComputed from '../../utils/useComputed';
import { ref, defineProps } from 'vue'
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router'
const router = useRouter();

const { id } = defineProps({
    id: String,
});

const { candidate, isLoading } = storeToRefs(useEmploymentStore())

const dialogDelete = ref(false);

function handDestroy() {
    deleteCandidate(id)
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

getCandidate(id);

</script>

<template>
    <div class="">
        <v-container>
            <v-row>
                <v-col>
                    <v-card>
                        <div class="box">
                            <v-card-title>{{ candidate.title }}</v-card-title>
                            <v-dialog v-if="candidate.isOwner" v-model="dialogDelete" width="auto">
                                <template v-slot:activator="{ props }">
                                    <v-btn color="primary" v-bind="props"> destroy </v-btn>
                                </template>
                                <v-card>
                                    <v-card-title class="text-h5"> delete confirmation </v-card-title>
                                    <v-card-text>Are you sure you want to delete the candidate?</v-card-text>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="green-darken-1" variant="text" @click="dialogDelete = false">
                                            Close
                                        </v-btn>
                                        <v-btn color="green-darken-1" variant="text" @click="handDestroy">
                                            delete
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </div>

                        <v-img v-if="candidate?.user?.image" :src="candidate.user.image" height="200" width="200"
                            cover></v-img>
                        <img v-if="!candidate?.user?.image" height="200" width="200" src="/src/assets/images/fix-poster.jpg"
                            alt="Постер фільму відсутній">
                        <v-card-text>

                            <v-row>
                                <router-link :to="`/companies/${candidate.user?.id}`">
                                    <v-col>
                                        <strong>Candidate name:</strong> {{ candidate.user?.name }}
                                    </v-col>
                                </router-link>
                            </v-row>
                            <v-row>
                                <v-col>
                                    <strong>Profession:</strong> {{ candidate.profession }}
                                </v-col>

                            </v-row>
                            <v-row>
                                <v-col>
                                    <strong>Salary:</strong> {{ candidate.salary }} - {{ candidate.max_salary }}
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>
                                    <strong>Area:</strong> {{ candidate.area }}
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>
                                    <strong>Nature:</strong> {{ candidate.nature }}
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>
                                    <strong>Type:</strong>
                                    <v-chip v-for="type, i in candidate.types" :key="i" variant="flat" color="secondary">
                                        {{ type }}
                                    </v-chip>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>
                                    <strong>Description:</strong> {{ candidate.description }}
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>
                                    <strong>Skills:</strong>
                                    <v-chip v-for="skill, i in candidate.skills" :key="i" variant="flat" color="secondary">
                                        {{ skill }}
                                    </v-chip>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>

        <NoFound v-if="!candidate && !isLoading" />
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

.box {
    display: flex;
    justify-content: space-between;
}
</style>