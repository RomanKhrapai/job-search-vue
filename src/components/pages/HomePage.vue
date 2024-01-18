<template>
    <div>

        <!-- <GridFilms v-if="films" :films="films" /> -->
        <NoFilms class="full-box" />
        <Pagination />

    </div>
</template>

<script setup>

import GridFilms from "../GridFilms.vue"
import Pagination from "../Pagination.vue"
import NoFilms from "../NoFilms.vue"
import { debounce } from "../../utils/debounce"
import { watch, onMounted } from 'vue'
import { storeToRefs } from "pinia"




onMounted(() => { })

</script>
  