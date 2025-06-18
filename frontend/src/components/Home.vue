<template>
    <div class="main-content">
        <Navigation :activeTab="activeTab" @tab-change="activeTab = $event"/>
        <Account :user="user"/>
        <Game v-if="activeTab === 'game'"/>
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
import Game from './Game.vue';
export default {
    name: 'Home',
    components: {
        Navigation,
        Account,
        Game
    },
    data() {
        return {
            user: null,
            activeTab: 'game'
        }
    }
}
</script>