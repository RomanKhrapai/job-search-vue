<template>
    <div>
        <div>

            <v-dialog v-model="dialogAddCompany" width="auto">
                <template v-slot:activator="{ props }">
                    <v-btn color="primary" v-bind="props"> add company </v-btn>
                </template>
                <v-card class="card-form">
                    <CustomForm ref="form" class="login__form" @submit.prevent="handleSubmit">

                        <v-card-title class="text-h5"> to create a company, select a profession
                        </v-card-title>
                        <v-card-text>

                            <CustomOneSearchSelect v-model="profession" class="login__input" :label="'profession'"
                                :rules="professionRules" name="profession" :list-class="'relative'"
                                :options="professions" />

                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="green-darken-1" variant="text" @click="dialogAddCompany = false">
                                Close
                            </v-btn>
                            <v-btn color="green-darken-1" variant="text" type="submit">add vacancy
                            </v-btn>

                        </v-card-actions>
                    </CustomForm>
                </v-card>
            </v-dialog>
            <v-dialog v-model="dialogAddResume" width="auto">
                <template v-slot:activator="{ props }">
                    <v-btn color="primary" v-bind="props"> add resume </v-btn>
                </template>
                <v-card class="card-form">
                    <CustomForm ref="form" class="login__form" @submit.prevent="handleSubmit">

                        <v-card-title class="text-h5"> to create a resume, select a profession
                        </v-card-title>
                        <v-card-text>

                            <CustomOneSearchSelect v-model="profession" class="login__input" :label="'profession'"
                                :rules="professionRules" name="profession" :list-class="'relative'"
                                :options="professions" />

                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="green-darken-1" variant="text" @click="dialogAddResume = false">
                                Close
                            </v-btn>
                            <v-btn color="green-darken-1" variant="text" type="submit">add vacancy
                            </v-btn>

                        </v-card-actions>
                    </CustomForm>
                </v-card>
            </v-dialog>
        </div>
        <NotFoundPageVue v-if="!isLoading && isError"></NotFoundPageVue>
    </div>
</template>

<script setup>
import NotFoundPageVue from './NotFoundPage.vue';
import { useEmploymentStore } from '../../store/employmentStore';
import { storeToRefs } from 'pinia';

const { isLoading, isError } = storeToRefs(useEmploymentStore())


</script>
  
<style scoped></style>