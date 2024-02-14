<script setup>
import CustomTextArea from '../shared/form/CustomTextArea.vue';
import CustomOneSearchSelect from '../shared/form/CustomOneSearchSelect.vue'
import CustomForm from '../shared/form/CustomForm.vue';
import NoFound from '../NoFound.vue';
import Reviews from '../Reviews.vue';
import Loader from '../Loader.vue';
import { useEmploymentStore } from "../../store/employmentStore";
import { useAuthStore } from '../../store/authStore';
import { useChatsStore } from '../../store/chatsStore';
import { getCandidate, deleteCandidate } from '../../store/actions/candidate';
import { maxString, isRequiredId } from '../../utils/validationRules';

import { ref, defineProps, computed, watch } from 'vue'
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router'
const router = useRouter();

const { id } = defineProps({
    id: String,
});
const { sendOffer, setInfoMessage } = useChatsStore();
const { candidate, isLoading } = storeToRefs(useEmploymentStore())
const { companies, role, isAuthorized } = storeToRefs(useAuthStore());

const dialogDelete = ref(false);
const dialogSendOffer = ref(false);

const company = ref({ id: '', name: '' });
const message = ref('');
const formSendOffer = ref(null);

const messageRules = computed(() => [maxString(1000)]);
const companyRules = computed(() => [isRequiredId,]);

function handDestroy() {
    deleteCandidate(id)
    dialogDelete.value = false;
    router.push({
        path: '/candidates',
    })
}

function sendOfferJob() {
    const isFormValid = formSendOffer.value.validate()
    if (isFormValid) {
        sendOffer(message.value, company.value, candidate.value)
        dialogSendOffer.value = false;
        router.push({
            name: 'chat',
        })
    };
}
watch(dialogSendOffer, (newVal) => {
    if (newVal && companies[0]) {
        setInfoMessage("First, create a company");
    }
})

getCandidate(id);

</script>

<template>
    <div class="">
        <Loader v-if="isLoading" />
        <v-container v-if="candidate.id">
            <v-row>
                <v-col>
                    <v-card class="wrapper_candidate">
                        <div class="box">
                            <v-card-title class="card__title">{{ candidate.title }}</v-card-title>
                            <v-dialog v-if="role != 3 && isAuthorized" v-model="dialogSendOffer" width="auto">
                                <template v-slot:activator="{ props }">
                                    <v-btn color="primary" v-bind="props"> Offer a job </v-btn>
                                </template>
                                <v-card class="card-form">
                                    <CustomForm ref="formSendOffer" class="login__form" @submit.prevent="sendOfferJob">

                                        <v-card-title class="text-h5">
                                            Offer a job to this candidate
                                        </v-card-title>
                                        <v-card-text>

                                            <CustomOneSearchSelect v-model="company" class="login__input" label="company"
                                                name="company" list-class='relative' :options="companies"
                                                :rules="companyRules" :no-btn="true" />

                                            <CustomTextArea v-model="message" autocomplete="message"
                                                placeholder="enter message" name="message" :rules="messageRules"
                                                class="login__input" label="message" />

                                        </v-card-text>
                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn color="green-darken-1" variant="text" @click="dialogSendOffer = false">
                                                Close
                                            </v-btn>
                                            <v-btn color="green-darken-1" variant="text" type="submit">send
                                            </v-btn>

                                        </v-card-actions>
                                    </CustomForm>
                                </v-card>
                            </v-dialog>
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
                        <div class="box_second">
                            <div class="wrapper_candidates__image">
                                <v-img v-if="candidate?.user?.image" :src="candidate.user.image"  width="200"
                                    cover></v-img>
                                <img v-if="!candidate?.user?.image"  width="200"
                                    src="/src/assets/images/fix-poster.jpg" alt="">
                            </div>

                            <v-card-text class="wrapper_candidates__text">
                                <div class="block_text">
                                    <div class="block_text__first">
                                        <v-row>
                                            <v-col class="candidate__text">
                                                <strong>Candidate name:</strong> {{ candidate.user?.name }}
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col class="candidate__text">
                                                <strong>phone:</strong> {{ candidate.user.phone }}
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col class="candidate__text">
                                                <strong>email:</strong> {{ candidate.user.email }}
                                            </v-col>
                                        </v-row>

                                    </div>
                                    <div class="block_text__second">
                                        <v-row>
                                            <v-col class="candidate__text">
                                                <strong>Profession:</strong> {{ candidate.profession }}
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col class="candidate__text">
                                                <strong>Experiance:</strong> {{ candidate.experience_months }} month
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col class="candidate__text">
                                                <strong>Salary:</strong> {{ candidate.salary }}
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col class="candidate__text">
                                                <strong>Area:</strong> {{ candidate.area }}
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col class="candidate__text">
                                                <strong>Nature:</strong> {{ candidate.nature }}
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col class="candidate__text">
                                                <strong>Type:</strong>
                                                <span v-for="type, i in candidate.types" :key="i" variant="flat"
                                                    color="secondary">
                                                    {{ type }}
                                                </span>
                                            </v-col>
                                        </v-row>
                                    </div>
                                </div>
                                <v-row>
                                    <v-col>
                                        <strong>Description:</strong> {{ candidate.description }}
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col>
                                        <strong>Skills:</strong>
                                        <v-chip v-for="skill, i in candidate.skills" :key="i" variant="flat"
                                            color="secondary">
                                            {{ skill }}
                                        </v-chip>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </div>
                    </v-card>
                    <Reviews v-if="candidate?.user" :id="Number(candidate.user.id)" :isUser='true' />
                </v-col>
            </v-row>
        </v-container>

        <NoFound v-if="!candidate.id && !isLoading" />
    </div>
</template>

    
<style scoped>
.wrapper_candidate {
    padding: 20px;
    height: auto;
    border-radius: 30px;
    background-image: linear-gradient(to right, #a3a19d 0, #768297 50%, #579BB1 100%);
    box-shadow: 0px -14px 32px 3px rgba(220.5, 220.5, 220.5, 1), 0px 0px 0px -4px rgba(220.5, 220.5, 220.5, 1);
}

.box_second {
    display: flex;
    margin-bottom: 20px;
}

.wrapper_candidates__text {
    display: flex;
    flex-direction: column;
    width: 65%;
    height: 65%;
    gap: 20px;
    padding: 25px;
    border-radius: 10px;
}

.wrapper_candidates__image {
    width: 30%;
    height: 30%;
}

.block_text {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}

.block_text__first,
.block_text__second {
    width: 45%;
    height: auto;
}

.candidate__text {
    padding: 3px;
    font-size: 16px;
    line-height: 18px;
}

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


.box {
    display: flex;
    justify-content: space-between;
}
</style>