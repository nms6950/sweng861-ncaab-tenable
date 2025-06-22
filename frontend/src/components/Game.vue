<template>
    <div class="game-box">
        <div class="game-date">
            <div class="icon" :class="!prevEnabled ? 'disabled': ''" @click="date = new Date(date.setDate(date.getDate() - 1))">
                <fa icon="angles-left" size="lg"/>
            </div>
            <div class="ms-4 date">{{ formattedDate }}</div>
            <div class="icon" :class="!nextEnabled ? 'disabled': ''" @click="date = new Date(date.setDate(date.getDate() + 1))">
                <fa icon="angles-right" size="lg"/>
            </div>
            <div class="game-details">
                <div
                    class="timer position-relative"
                    v-if="gameStarted"
                    @mouseover="hoverTimer = true"
                    @mouseout="hoverTimer = false"
                    @click="togglePause"
                    :class="{ paused: isPaused, hovering: hoverTimer }"
                >
                    {{ currentGame.timer }}s

                    <div class="pause-overlay" v-if="hoverTimer || isPaused">
                        <fa :icon="isPaused ? 'play' : 'pause'" class="timer-icon"/>
                    </div>
                </div>
                <button class="btn btn-primary" v-else @click="startGame()">START GAME</button>
                <div class="lives">
                    <fa icon="heart" size="lg" :class="numLives >= 1 ? 'red': ''"/>
                    <fa icon="heart" size="lg" :class="numLives >= 2 ? 'red': ''"/>
                    <fa icon="heart" size="lg" :class="numLives == 3 ? 'red': ''"/>
                </div>
            </div>
        </div>
        <div class="answers">
            <div class="answer" v-for="(check, index) in currentGame.checking" v-if="currentGame.id">
                <div v-if="currentGame.checking[index]" class="checking">
                    {{ this.checkingPlayer }}
                </div>
                <div v-else-if="currentGame.correct[index]" class="correct">
                    {{ currentGame.answers[index] }}
                </div>
                <div v-else-if="currentGame.checking[index] && index == this.lastCheckingIndex" class="wrong">
                    {{ this.checkingPlayer }}
                </div>
            </div>
            <div v-else>
                <span style="font-size: 1.5rem; font-weight: bold;">No Game Today. Come back tomorrow!</span>
            </div>
        </div>
        <div class="prompt" v-if="currentGame.id">
            {{ currentGame.prompt }}
        </div>
        <div class="game-input" v-if="currentGame.id">
            <div class="dropdown">
                <input
                    type="text"
                    class="form-control"
                    placeholder="Type to search..."
                    v-model="playerInput"
                    @focus="show = true"
                    @blur="handleBlur"
                    :disabled="!gameStarted"
                />
                <ul
                    class="dropdown-menu show w-100"
                    v-if="show && filteredOptions.length"
                    style="max-height: 200px; overflow-y: auto;"
                >
                    <li v-for="player in filteredOptions" :key="player.id" @mousedown.prevent="selectOption(player)">
                        <a class="dropdown-item" href="#">{{ player.name }}</a>
                    </li>
                </ul>
            </div>
        </div>
        <EndGame :num_correct="num_correct" />
    </div>
</template>

<style>
.game-box {
    height: 85%;
    width: 60%;
    top: 10%;
    left: 16%;
    position: absolute;
    background-color: lightgray;
    border: 3px solid #063c6d;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 3%;
}

.prompt {
    height: 5%;
    width: 100%;
    color: black;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.25rem;
    /* border: 2px gray solid; */
}

.answers {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 50%;
    width: 100%;
    /* border: 2px gray solid; */
    gap: 1%;
}

.answer {
    width: 60%;
    height: 9%;
    border: 2px black solid;
    background-color: white;
    border-radius: 30px;
}

.game-input {
    width: 100%;
    height: 25%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    /* border: 2px gray solid; */
}

.dropdown {
    width: 50%;
}

.game-date {
    height: 5%;
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    /* border: 2px gray solid; */
}

.game-date .date {
    font-size: 1.5rem !important;
}

.game-date .icon {
    width: 50px;
    height: 50px;
    border-radius: 25px;
    background: var(--btn-blue);
    border: 2px #063c6d solid;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}

.game-details {
    /* height: 5%;
    width: 100%; */
    display: flex;
    justify-content: center;
    align-items: center;
    /* border: 2px gray solid; */
    gap: 20px;
}

.game-details .timer {
    padding: 0% 10%;
    width: 80px;
    height: 40px;
    position: relative;
    cursor: pointer;
    transition: opacity 0.3s ease;
    border-radius: 5px;
    background: var(--btn-blue);
    border: 2px #063c6d solid;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
}

.timer.hovering {
  opacity: 0.8;
}

.timer.paused {
  opacity: 0.8;
}

.timer.hovering .timer-icon {
    opacity: 1.0;
}

.timer.paused .timer-icon {
    opacity: 1.0;
}

.timer-icon {
    color: #063c6d;
}

.pause-overlay {
  position: absolute;
  font-size: 1.25rem;
  color: #333;
}

.game-details .lives {
    width: 10%;
    height: 100%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    gap: 5px;
}

.red {
    color: red;
}

.correct {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--btn-blue);
    color: white;
    border-radius: 30px;
}

.wrong {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: red;
    color: white;
    border-radius: 30px;
}

.checking {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--btn-gray);
    color: white;
    border-radius: 30px;;
}

.disabled {
    cursor: not-allowed;
    pointer-events: none;
    opacity: 0.5;
}
</style>

<script>
import axios from 'axios';
import EndGame from './EndGame.vue';
import { Modal } from 'bootstrap';
export default {
    name: 'Game',
    components: {
        EndGame
    },
    props: ['activeTab', 'user'],
    data() {
        return {
            currentGame: {
                prompt: '',
                answerSet: '',
                answers: [],
                correct: [false, false, false, false, false, false, false, false, false, false],
                checking: [false, false, false, false, false, false, false, false, false, false],
                timer: 200
            },
            show: false,
            playerInput: '',
            checkingPlayer: '',
            date: null,
            numLives: 3,
            players: [],
            answerInterval: null,
            timerInterval: null,
            hoverTimer: false,
            isPaused: false,
            lastCheckingIndex: 0,
            maxDate: null,
            prevEnabled: false,
            nextEnabled: false,
            maxDate: null,
            num_correct: 0,
            gameStarted: false,
            timerInterval: null,
            gameEnded: false
        }
    },
    computed: {
        filteredOptions() {
            if (!this.playerInput) return [];
            const s = this.playerInput.toLowerCase();
            return this.players.filter(player => player.name.toLowerCase().includes(s));
        },
        formattedDate() {
            if (!this.date) {
                return '';
            }
            const formatted = this.date.toLocaleDateString('en-US', {
                weekday: 'long',  // e.g., Monday
                year: 'numeric',
                month: 'long',    // e.g., June
                day: 'numeric'    // e.g., 17
            });
            return formatted;
        }
    },
    methods: {
        startGame() {
            this.gameStarted = true;
            this.gameEnded = false;
            this.startTimer();
        },
        clearGame() {
            this.numLives = 3;
            this.lastCheckingIndex = 0;
            this.num_correct = 0;
            this.gameStarted = false;
            this.isPaused = false;
            clearInterval(this.answerInterval);
            clearInterval(this.timerInterval);
        },
        resetStats() {
            this.numLives = 3;
            this.lastCheckingIndex = 0;
            this.num_correct = 0;
            this.gameStarted = false;
            this.isPaused = false;
            clearInterval(this.answerInterval);
            clearInterval(this.timerInterval);
        },
        endGame() {
            clearInterval(this.timerInterval);
            // Get the modal element by ID
            const modalEl = document.getElementById('endGameModal')

            // Initialize and show the modal
            const modalInstance = new Modal(modalEl)
            modalInstance.show()

            // Save Game
            if (this.user && this.user.id) {
                this.saveStats();
            }

            this.gameEnded = true;
        },
        saveStats() {
            const game_id = this.currentGame.id;
            let url = 'http://localhost:4000/saveStats'
            console.log(this.num_correct)
            console.log(this.user.id)
            console.log(this.currentGame.id)    
            console.log(this.numLives)
            axios.post(url, {
                num_correct: this.num_correct,
                num_lives: this.numLives,
                game_id: this.currentGame.id,
                user_id: this.user.id
            }).then((res) => {
                const content = res.data;
                console.log(content);
                this.$emit('resetStats')
            }).catch((err) => {
                console.log(err);
            })

        },
        selectOption(player) {
            this.playerInput = player.name;
            this.checkingPlayer = player.name;
            this.show = false;
            this.answer();
        },
        answer() {
            let index = 9;
            let correct = this.check(index);
            if (correct) {
                return;
            }
            this.answerInterval = setInterval(() => {
                index--;
                this.check(index)
            }, 750)
        },
        check(index) {
            if (index != 9) {
                // Remove checking style from prev index
                this.currentGame.checking[index + 1] = false;
            }
            if (index < 0 || index < this.lastCheckingIndex) {
                clearInterval(this.answerInterval);
                this.playerInput = ''
                this.numLives--;
                if (this.numLives == 0) {
                    this.endGame();
                }
                this.currentGame.checking[index + 1] = false;
                return;
            }
            if (this.playerInput == this.currentGame.answers[index]) {
                clearInterval(this.answerInterval);
                this.currentGame.checking[index] = false;
                this.currentGame.correct[index] = true;
                // clearInterval(this.answerInterval);
                this.playerInput = ''
                this.num_correct++;
                if (index == this.lastCheckingIndex) {
                    this.lastCheckingIndex = this.currentGame.correct.indexOf(false);
                }
                if (this.num_correct == 10 && this.gameEnded == false) {
                    this.endGame();
                }
                return true;
            } else {
                this.currentGame.checking[index] = true
            }
        },
        handleBlur() {
            // Delay to allow click event to register before hiding
            setTimeout(() => {
                this.show = false;
            }, 100);
        },
        async getPlayers() {
            let url = 'http://localhost:4000/getPlayers'
            await axios.get(url).then((res) => {
                const content = res.data;
                this.players = content;
            }).catch((err) => {
                console.log(err);
            });
        },
        startTimer() {
            clearInterval(this.timerInterval);
            this.timerInterval = setInterval(() => {
                if (!this.isPaused && this.currentGame.timer > 0) {
                    this.currentGame.timer--;
                }
                if (this.currentGame.timer <= 0) {
                    this.endGame();
                }
            }, 1000);
        },
        togglePause() {
            this.isPaused = !this.isPaused;
        },
        async getGame() {
            this.gameStarted = false;
            let url = 'http://localhost:4000/getGame'
            axios.get(url, {
                params: {
                    date: this.date.toISOString().split('T')[0]
                }
            }).then((res) => {
                const content = res.data[0];
                this.currentGame = {
                    prompt: content.prompt,
                    answerSet: content.answerSet,
                    answers: content.answers,
                    correct: [false, false, false, false, false, false, false, false, false, false],
                    checking: [false, false, false, false, false, false, false, false, false, false],
                    timer: 200,
                    id: content.id
                };
                //this.startTimer();
            }).catch((err) => {
                console.log(err);
            })
        },
        async getMaxDate() {
            let url = 'http://localhost:4000/getMaxDate'
            await axios.get(url).then((res) => {
                const content = res.data;
                console.log(content)
                this.maxDate = new Date(content.max).toISOString().split('T')[0];
            }).catch((err) => {
                console.log(err);
            })
        },
    },
    async mounted() {
        await this.getMaxDate();
        const today = new Date();
        this.date = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        this.getPlayers();
    },
    watch: {
        activeTab: function (newValue) {
            if (newValue == 'game') {
                this.getGame();
            } else {
                this.date = new Date();
                this.clearGame();
            }
        },
        date: function (newValue) {
            this.clearGame();
            const firstDate = new Date('2025-06-17').toISOString().split('T')[0];
            let dateString = newValue.toISOString().split('T')[0];
            // console.log(dateString)
            // console.log(firstDate)
            // console.log(dateString <= firstDate)
            // console.log(this.maxDate)
            // console.log(dateString >= this.maxDate)
            if (dateString <= firstDate) {
                this.prevEnabled = false;
            } else {
                this.prevEnabled = true;
            }
            if (dateString >= this.maxDate) {
                this.nextEnabled = false;
            } else {
                this.nextEnabled = true;
            }
            this.getGame()
        },
        user: async function (newValue) {
            await this.clearGame();
            this.getGame();
        }
    }
}
</script>