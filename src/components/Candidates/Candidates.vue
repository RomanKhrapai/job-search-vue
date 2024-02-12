<template>
    <template v-for="candidate in candidates">
        <router-link :to="`/candidates/${candidate.id}`">

            <v-col cols="12">
                <v-card class="mx-auto card" prepend-icon="mdi-twitter" :title="candidate.title">
                    <template v-slot:prepend>
                        {{ candidate.profession }}
                    </template>

                    <v-card-text class="text-h5 py-2">
                        {{ truncatedText(candidate.description, 130) }}
                    </v-card-text>

                    <v-card-actions>
                        <v-list-item class="w-100">
                            <template v-slot:prepend>
                                <v-avatar color="grey-darken-3" :image="candidate.user.image"></v-avatar>
                            </template>

                            <v-list-item-title>{{ candidate.user.name }}</v-list-item-title>

                            <v-list-item-subtitle>Sarary: {{ candidate.salary }} {{ candidate.max_salary ? '-' : ''
                            }}
                                {{
                                    candidate.max_salary
                                }}</v-list-item-subtitle>

                            <template v-slot:append>
                                <div class="justify-self-end">
                                    <v-icon class="me-1" icon="mdi-heart"></v-icon>
                                    <span class="subheading me-2">256</span>
                                    <span class="me-1">·</span>
                                    <v-icon class="me-1" icon="mdi-share-variant"></v-icon>
                                    <span class="subheading">45</span>
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
const { candidates } = defineProps({
    candidates: Array,
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