<template>
    <template v-for="vacancy in vacancies">
        <router-link :to="`/vacancies/${vacancy.id}`" class="link">

            <v-col cols="12">
                <v-card class="mx-auto card" prepend-icon="mdi-twitter" :title="vacancy.title">
                    <template v-slot:prepend>
                        {{ vacancy.profession }}
                    </template>

                    <v-card-text class="text-h5 py-2">
                        {{ truncatedText(vacancy.description, 150) }}
                    </v-card-text>

                    <v-card-actions>
                        <v-list-item class="w-100">
                            <template v-slot:prepend>
                                <v-avatar color="grey-darken-3" :image="vacancy.company.image"></v-avatar>
                            </template>

                            <v-list-item-title>{{ vacancy.company.name }}</v-list-item-title>

                            <v-list-item-subtitle>Sarary: {{ vacancy.salary }} - {{ vacancy.max_salary
                            }}</v-list-item-subtitle>

                            <template v-slot:append>
                                <div class="justify-self-end">
                                    <v-rating half-increments :length="5" readonly :size="28"
                                        :model-value="vacancy.avgVote / 2" color="warning" active-color="warning" />

                                    <span class="me-1">·</span>
                                    <v-icon class="me-1" icon="mdi-message-text-outline"></v-icon>
                                    <span class="subheading">{{ vacancy.countReviews }}</span>
                                </div>
                            </template>
                        </v-list-item>
                    </v-card-actions>
                </v-card>
            </v-col>
        </router-link>
    </template>
</template>
<script setup>
import { defineProps } from 'vue'
const { vacancies } = defineProps({
    vacancies: Array,
});

function truncatedText(text, maxLength = 200) {
    if (text.length > maxLength) {
        return text.slice(0, maxLength) + '...';
    } else {
        return text;
    }
}

</script>

<style lang="scss" scoped>
@import "../../assets/scss/variables.scss";

.card {
    background-color: $bg-secondary-color;
}
</style>