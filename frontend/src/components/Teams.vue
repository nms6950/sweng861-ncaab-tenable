<template>
    <div class="teams-box" v-if="!teamSelected">
        <div class="team-card" v-for="(team, index) in teams" :key="index" @click="teamSelected = team">
            <div class="team-logo">
                <img :src="`/assets/${team.logo_src}`" alt="Card Image" class="card-image" :id="team.team_abbrev"/>
            </div>
            <div class="card-text">
                {{ team.name }} <br>
                {{ team.mascot }} <br>
                {{ team.city }}
            </div>
        </div>
    </div>
</template>

<style>
.teams-box {
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
    flex-direction: row;
    flex-wrap: wrap;
    gap: 3%;
    overflow-y: auto;
    padding-top: 2%;
}

.team-card {
  width: 20%; /* or 100% or any other value */
  height: 50%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  border: 3px solid black;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2),
}

.team-card:hover {
    opacity: 0.8;
    cursor: pointer;
}

.team-logo {
    height: 70%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
}

.card-image {
  max-width: 80%;
  max-height: 80%;
  object-fit: contain;
}

#WIS, #RUT {
    max-width: 60%;
}

#PSU, #MINN {
    max-width: 140%;
}

#ORE, #MINN {
    max-height: 150%;
}

.card-text {
  height: 30%;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  background-color: #f7f7f7;
  text-align: center;
  font-weight: 500;
}

#oregon, #minnesota {
    width: 140%
}

#ucla, #purdue {
    padding: 50px;
}

#rutgers {
    padding: 25px;
}
</style>

<script>
import axios from 'axios';
export default {
    name: 'Teams',
    components: {
        
    },
    prop: ['activeTab'],
    data() {
        return {
            teamSelected: null,
            teams: []
        }
    },
    methods: {
        async getTeams() {
            let url = 'http://localhost:4000/getTeams'

            axios.get(url)
            .then(res => {
                this.teams = res.data
            })
            .catch(err => {
                console.log(err)
            })
        }
    },
    mounted() {
        this.getTeams()
    },
    watch: {
        teamSelected: function (newValue) {
            if (newValue) {
                this.$emit('openPlayers', newValue)
            }
        }
    }
}
</script>