<template>
    <div>
        addvacancy
        <VacancyForm titleText="Add vacancy" />
    </div>
</template>


<script setup>
import VacancyForm from "../shared/form/VacancyForm.vue";
import { useRouter, } from "vue-router"

const router = useRouter();
function redirectTo(path) {
    router.push({
        path,
    })
}

</script>
