<template>
    <div class="main-content">
        <Navigation :activeTab="activeTab" @tab-change="activeTab = $event"/>
        <Account :user="user" @login="login($event)"/>
        <Game v-if="activeTab === 'game'"/>
        <Teams v-if="activeTab === 'teams'" @openPlayers="initTeamPlayers($event)"/>
        <Players v-if="activeTab === 'players'" :selectedTeam="selectedTeam" :activeTab="activeTab"/>
        <CreateAccount @newUser="newUserCreated($event)"/>
        <Stats v-if="activeTab == 'game'"/>
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
            selectedTeam: null
        }
    },
    methods: {
        newUserCreated(user) {
            console.log(user)
            this.user = user
        },
        login(user) {
            console.log(user)
            this.user = user
        },
        initTeamPlayers(team) {
            this.activeTab = 'players'
            console.log(team)
            this.selectedTeam = team
        }
    }
}
</script>