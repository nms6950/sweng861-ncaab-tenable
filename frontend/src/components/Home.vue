<template>
    <div class="main-content">
        <Navigation />
        <Account :user="user"/>
    </div>
</template>

<style>
.main-content {
    height: 100%;
    width: 100%;
    position: relative;
}
</style>

<script>
import Navigation from './Navigation.vue';
import Account from './Account.vue';
export default {
    name: 'Home',
    components: {
        Navigation,
        Account
    },
    data() {
        return {
            user: null
        }
    }
}
</script>