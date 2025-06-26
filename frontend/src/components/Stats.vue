<template>
    <div class="stats-window">
        <div class="row w-100">
            <div class="col-1"></div>
            <div class="col-4">
                <div class="row text-center">
                    <label>Played</label>
                </div>
                <div class="row data text-center">
                    <label>{{ games_played }}</label>
                </div>
            </div>
            <div class="col-2"></div>
            <div class="col-4">
                <div class="row text-center">
                    <label>Average</label>
                </div>
                <div class="row data text-center">
                    <label>{{ average_score ? parseFloat(average_score).toFixed(2) : 'N/A' }}</label>
                </div>
            </div>
            <div class="col-1"></div>
        </div>
        <div class="row w-100">
            <div class="col-1"></div>
            <div class="col-4">
                <div class="row text-center">
                    <label>Wins</label>
                </div>
                <div class="row data text-center">
                    <label>{{ num_wins }}</label>
                </div>
            </div>
            <div class="col-2"></div>
            <div class="col-4">
                <div class="row text-center">
                    <label>Losses</label>
                </div>
                <div class="row data text-center">
                    <label>{{ num_losses }}</label>
                </div>
            </div>
            <div class="col-1"></div>
        </div>
        <div class="game-stats">
            <div class="row stat" v-for="game in games" :key="game.id">
                <div class="col-6">
                    {{ game.game_date.split('T')[0] }}
                </div>
                <div class="col-6">
                    {{ game.num_correct != null ? `${game.num_correct} / 10` : 'N/A' }}
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.stats-window {
    height: 60%;
    width: 20%;
    top: 10%;
    right: 2%;
    position: absolute;
    background-color: rgb(6, 60, 109, 0.3);
    border: 3px solid #063c6d;
    border-radius: 10px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    gap: 5%;
    padding: 2%;
}

.game-stats {
    max-height: 60%;
    height: 60%;
    width: 100%;
    border: 2px #063c6d solid;
    overflow-y: auto;
    border-radius: 10px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    padding-top: 10px;
    gap: 5px;
    padding-bottom: 10px;
}   

.stats-window label {
    color: #063c6d;
    font-size: 1rem;
}

.data label {
    border: 2px #063c6d solid;
    border-radius: 5px;
    background-color: lightgray;
}

.stat {
    background-color: var(--btn-blue);
    color: #063c6d;
    border: 2px #063c6d solid;
    border-radius: 5px;
    text-align: center;
    font-size: 0.9rem !important;
    height: 10%;
    width: 90%;
}

.stat .col-6 {
    padding: 0 !important;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-weight: bold;
}
</style>

<script>
import axios from 'axios';
export default {
    name: 'Stats',
    props: ['activeTab', 'user', 'statsTrigger'],
    data() {
        return {
            games_played: 0,
            average_score: 0,
            num_wins: 0,
            num_losses: 0,
            games: []
        }
    },
    methods: {
        async getUserStats() {
            // let url = 'http://localhost:4000/getUserStats'
            if (this.user && this.user.id) {
                axios.get('/getUserStats', {
                    params: {
                        user_id: this.user.id
                    }
                }).then((res) => {
                    const content = res.data[0];
                    this.games_played = content.games_played;
                    this.average_score = content.avg_score;
                }).catch((err) => {
                    console.log(err);
                })
            }
        },
        async getIndividualGames() {
            // let url = 'http://localhost:4000/getIndividualGames'
            if (this.user && this.user.id) {
                axios.get('/getIndividualGames', {
                    params: {
                        user_id: this.user.id
                    }
                }).then((res) => {
                    const content = res.data;
                    this.num_wins = content.filter(game => game.num_correct == 10).length;
                    this.num_losses = content.filter(game => game.num_correct != 10 && game.num_correct != null).length;
                    this.games = content;
                }).catch((err) => {
                    console.log(err);
                })
            }
        }
    },
    watch: {
        user: function (newValue) {
            if (newValue) {
                this.getUserStats();
                this.getIndividualGames();
            }
        },
        statsTrigger: function (newValue) {
            this.getUserStats();
            this.getIndividualGames();
        }
    }
}
</script>