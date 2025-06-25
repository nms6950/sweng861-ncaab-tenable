<template>
    <div class="main-content">
        <Navigation :activeTab="activeTab" @tab-change="activeTab = $event"/>
        <Account :user="user" @login="login($event)" @logout="logout()"/>
        <Game v-if="activeTab === 'game'" :user="user" :activeTab="activeTab" @resetStats="triggerStats()"/>
        <Teams v-if="activeTab === 'teams'" @openPlayers="initTeamPlayers($event)"/>
        <Players v-if="activeTab === 'players'" :selectedTeam="selectedTeam" :activeTab="activeTab"/>
        <CreateAccount @newUser="newUserCreated($event)"/>
        <Stats v-show="activeTab == 'game' && user" :user="user" :statsTrigger="statsTrigger"/>
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
import CreateAccount from './CreateAccount.vue';
import Stats from './Stats.vue';
export default {
    name: 'Home',
    components: {
        Navigation,
        Account,
        Game,
        Teams,
        Players,
        CreateAccount,
        Stats
    },
    data() {
        return {
            user: null,
            activeTab: 'game',
            selectedTeam: null,
            statsTrigger: false
        }
    },
    methods: {
        newUserCreated(user) {
            this.user = user
        },
        login(user) {
            this.user = user;
        },
        logout() {
            this.user=null;
        },
        triggerStats() {
            this.statsTrigger = !this.statsTrigger
        },
        initTeamPlayers(team) {
            this.activeTab = 'players'
            this.selectedTeam = team
        }
    }
}
</script>