<template>
    <AuthSection>
        <LogInForm />
    </AuthSection>
</template>

<script setup>
import LogInForm from "../auth/LogIn/LogIn.vue";
import AuthSection from "../auth/AuthSection.vue";
import { onMounted } from "vue"



onMounted(() => { })

</script>

<style lang="scss" scoped></style>