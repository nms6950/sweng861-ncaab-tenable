<template>
    <div class="nav-bar">
        <div class="logo">
            <img src="./../assets/btn-logo.png">
        </div>
        <a href="#" class="active">
            <fa icon="list-ul" />
            <b class="ms-4">Tenable</b>
        </a>
        <a href="#" class="">
            <fa icon="people-group" />
            <b class="ms-4">Team Profiles</b>
        </a>
        <a href="#">
            <fa icon="user" />
            <b class="ms-4">Player Profiles</b>
        </a>
    </div>
</template>

<style>
.nav-bar {
    width: 15%;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background-color: #063c6d;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
}

.active {
    background-color: var(--btn-blue);
}


.nav-bar a {
  padding: 15px 20px;
  width: 100%;
  text-decoration: none;
  color: white;
  transition: background 0.3s;
}

.nav-bar a svg {
    width: 20px !important;
}

.nav-bar a:hover {
  background-color: var(--btn-gray);
}
</style>

<script>
export default {
    name: 'Navigation',
    data() {
        return {
            
        }
    }
}
</script>