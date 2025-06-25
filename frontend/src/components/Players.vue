<template>
    <div class="tab-content">
        <div class="players-header">
            <div class="player-input">
                <label>Search</label>
                <input type="text" v-model="search" placeholder="Search for a player...">
            </div>
            <div class="player-dropdown position-relative">
                <label>Team</label>
                <select v-model="selected" class="form-control">
                    <option value="">All Teams</option>
                    <option v-for="team in teams" :key="team">{{ team.name }}</option>
                </select>
                <fa icon="chevron-down" class="dropdown-icon"/>
            </div>
        </div>
        <div class="players-box">
            <div class="player-card" v-for="(player, index) in filteredPlayers" :key="index">
                <div class="team-logo">
                    <img :src="`/assets/${player.logo_src}`" alt="Card Image" />
                </div>
                <div class="card-text">
                    {{ player.name }} | {{ player.team_abbrev}} <br />
                    {{ player.position_abbrev }} | {{ getPlayerYear(player) }} <br>
                    {{ player.home_city }} <br />
                </div>
                <div class="player-number">
                    {{ player.number }}
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.tab-content {
    height: 85%;
    width: 80%;
    top: 12%;
    left: 17.5%;
    position: absolute;
    background-color: lightgray;
    border: 3px solid #063c6d;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 2%;
    overflow-y: auto;
}

.players-box {
    height: 86%;
    width: 95%;
    border: 2px solid #063c6d;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 5%;
    overflow-y: auto;
}

.players-header {
    width: 95%;
    height: 10%;
    background-color: rgb(6, 60, 109, 0.5);
    border: 2px solid #063c6d;
    border-radius: 10px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.player-input {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 10px;
    color: black;
    height: 100%;
    width: 50%;
}

.player-dropdown {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 10px;
    color: black;
    height: 100%;
    width: 40%;
}

.player-input input, .player-dropdown select {
    height: 60%;
    width: 70%;
    background-color: white;
    color: black;
    border: 2px solid black;
    border-radius: 5px;
}

select {
  padding: 6px;
  font-size: 14px;
}

.player-card {
  width: 40%; /* or 100% or any other value */
  height: 14%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  border: 3px solid black;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2),
}

.player-card .card-text {
  height: 100%;
  width: 70%;
  padding: 10px;
  box-sizing: border-box;
  background-color: #f7f7f7;
  font-weight: 500;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 1rem !important;
}

.player-card .card-text b {
    font-size: 1rem;
    font-weight: 600;
}

.player-card .player-number {
  height: 100%;
  width: 15%;
  padding: 10px;
  box-sizing: border-box;
  background-color: rgb(6, 60, 109, 0.5);
  color: white;
  text-align: center;
  font-weight: 500;
  font-size: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.player-card .team-logo {
  height: 100%;
  width: 15%;
  padding: 10px;
  box-sizing: border-box;
  background-color: rgb(6, 60, 109, 0.5);
  color: white;
  text-align: center;
  font-weight: 500;
  font-size: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.player-card .team-logo img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain; /* or cover depending on your goal */
}
.player-dropdown .dropdown-icon {
  position: absolute;
  right: 12%;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: black; /* optional: match Bootstrap’s default gray */
}
</style>

<script>
import axios from 'axios';
export default {
    name: 'Players',
    components: {
        
    },
    props: ['activeTab', 'selectedTeam'],
    data() {
        return {
            search: null,
            teams: [],
            selected: '',
            players: []
        }
    },
    methods: {
        async getAllPlayers() {
            let url = 'http://localhost:4000/getPlayers'

            axios.get(url)
            .then(res => {
                this.players = res.data
            })
            .catch(err => {
                console.log(err)
            })
        },
        async getTeams() {
            let url = 'http://localhost:4000/getTeams'

            axios.get(url)
            .then(res => {
                this.teams = res.data
            })
            .catch(err => {
                console.log(err)
            })
        },
        getPlayerYear(player) {
            return player.redshirt ? `R-${player.abbrev}` : `${player.abbrev}`
        }
    },
    mounted() {
        this.getAllPlayers();
        this.getTeams();
        if (this.selectedTeam) {
            this.selected = this.selectedTeam.name;
        }
    },
    watch: {
        selectedTeam: function (newValue) {
            this.selected = newValue.name;
        },
    },
    computed: {
        filteredPlayers() {
            return this.players.filter(player => {
                const matchesSearch = this.search
                    ? player.name.toLowerCase().includes(this.search.toLowerCase())
                    : true;

                const matchesTeam = this.selected
                    ? player.team_name === this.selected
                    : true;

                return matchesSearch && matchesTeam;
            });
        }
    }
}
</script>