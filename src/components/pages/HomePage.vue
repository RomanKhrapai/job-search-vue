<template>
    <div>


        <NoFoundJob class="full-box" />


    </div>
</template>

<script setup>



import NoFoundJob from "../NoFoundJob.vue"
import { debounce } from "../../utils/debounce"
import { watch, onMounted } from 'vue'
import { storeToRefs } from "pinia"




onMounted(() => { })

</script>
  