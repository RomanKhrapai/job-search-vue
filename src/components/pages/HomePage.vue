<template>
    <div>

        <!-- <GridFilms v-if="films" :films="films" /> -->
        <NoFoundJob class="full-box" />
        <!-- <Pagination />  -->

    </div>
</template>

<script setup>


// import Pagination from "../Pagination.vue"
import NoFoundJob from "../NoFoundJob.vue"
import { debounce } from "../../utils/debounce"
import { watch, onMounted } from 'vue'
import { storeToRefs } from "pinia"




onMounted(() => { })

</script>
  