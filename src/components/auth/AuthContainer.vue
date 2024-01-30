<template>
    <div class="auth-container">
        <slot></slot>
    </div>
</template>
    
<style lang="scss" scoped>
.auth-container {
    padding: 30px;
    max-width: 550px;
    width: 100%;
    background: #fff;
    border: 1px solid #0462c760;
    border-radius: 15px;
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.12), 0px 1px 1px rgba(0, 0, 0, 0.14),
        0px 2px 1px rgba(0, 0, 0, 0.2);
}
</style>