<template>
    <div class="main-content">
        <Navigation :activeTab="activeTab" @tab-change="activeTab = $event"/>
        <Account :user="user"/>
        <Game v-if="activeTab === 'game'"/>
        <Teams v-if="activeTab === 'teams'"/>
        <Players v-if="activeTab === 'players'" />
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
import Teams from './Teams.vue';
import Players from './Players.vue'
export default {
    name: 'Home',
    components: {
        Navigation,
        Account,
        Game,
        Teams,
        Players
    },
    data() {
        return {
            user: null,
            activeTab: 'game'
        }
    }
}
</script>