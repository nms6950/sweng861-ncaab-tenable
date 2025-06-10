<template>
    <div>
        <div class="login-content" v-if="!user && false">
            <div class="inputs">
                <div class="login-input">
                    <label>Email</label>
                    <input type="text" v-model="email">
                </div>
                <div class="login-input">
                    <label>Password</label>
                    <input type="password" v-model="password">
                </div>
            </div>
            <div class="login-btn">
                <button class="btn btn-primary">LOGIN</button>
                <button class="btn btn-warning">REGISTER</button>
            </div>
        </div>
        <div class="user-content" v-else>
            <h4>Welcome {{ user ? user.email : 'Guest'}}</h4>
        </div>
    </div>
</template>

<style>
.user-content {
    width: 25%;
    position: absolute;
    top: 10px;
    right: 10px;
    height: 8%;
    background-color: rgb(6, 60, 109, 0.5);
    border: 2px solid #063c6d;
    border-radius: 10px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.login-content {
    width: 55%;
    position: absolute;
    top: 10px;
    right: 10px;
    height: 8%;
    background-color: rgb(6, 60, 109, 0.5);
    border: 2px solid #063c6d;
    border-radius: 10px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.inputs {
    width: 75%;
    height: 90%;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
}

.login-btn {
    width: 25%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
}

.login-input {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 10px;
    color: black;
    height: 100%;
    width: 50%;
}

.login-input input {
    height: 60%;
    width: 70%;
    background-color: white;
    color: black;
    border: 2px solid black;
    border-radius: 5px;
}
</style>

<script>
export default {
    name: 'Account',
    components: {
        
    },
    props: [
        'user'
    ],
    data() {
        return {
            email: '',
            password: ''
        }
    }
}
</script>