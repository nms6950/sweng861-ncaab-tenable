<template>
    <div class="stats-window">
        <div class="row w-100">
            <div class="col-1"></div>
            <div class="col-4">
                <div class="row text-center">
                    <label>Played</label>
                </div>
                <div class="row data text-center">
                    <label>10</label>
                </div>
            </div>
            <div class="col-2"></div>
            <div class="col-4">
                <div class="row text-center">
                    <label>Average</label>
                </div>
                <div class="row data text-center">
                    <label>10</label>
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
                    <label>10</label>
                </div>
            </div>
            <div class="col-2"></div>
            <div class="col-4">
                <div class="row text-center">
                    <label>Losses</label>
                </div>
                <div class="row data text-center">
                    <label>10</label>
                </div>
            </div>
            <div class="col-1"></div>
        </div>
        <div class="game-stats">

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
    width: 95%;
    border: 2px #063c6d solid;
    overflow-y: auto;
    border-radius: 10px;
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
</style>

<script>
export default {
    name: 'Stats',
    data() {
        return {

        }
    }
}
</script>