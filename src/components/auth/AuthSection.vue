<template>
    <section class="auth-section">
        <slot></slot>
    </section>
</template>

<style lang="scss" scoped>
.auth-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;


    min-height: calc(100vh - 50px);
}
</style>