<template>
    <!-- <div>


        <NoFoundJob class="full-box" />


    </div> -->
    <div class="box-content">
        <v-card class="mx-auto my-12 ">
            <div class="box">
                <img src="\src\assets\images\2104842.jpeg" alt="">
            </div>
            <h2> Frontent part of the final project laravel and Vue 3 in Palmo </h2>
        </v-card>
    </div>
</template>

<script setup>



import NoFoundJob from "../NoFoundJob.vue"

import { watch, onMounted } from 'vue'





onMounted(() => { })

</script>
<style scoped>
h2 {
    font-size: 24px;
    text-align: center;
}

.box-content {
    padding-bottom: 1px;
}

.box {
    display: flex;
    height: calc(100vh - 300px);
    justify-content: center;
}
</style>