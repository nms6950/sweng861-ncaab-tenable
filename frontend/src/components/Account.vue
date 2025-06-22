<template>
    <div>
        <div class="login-content" v-if="!user">
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
                <button class="btn btn-primary" @click="login()">LOGIN</button>
                <button class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#createAccountModal">REGISTER</button>
            </div>
        </div>
        <div class="user-content" v-else>
            <div class="user-info">
                <fa icon="circle-user" size="lg" style="color: skyblue;"/>
                <div>Welcome {{ user ? user.name : 'Guest'}}</div>
            </div>
            <button class="btn btn-danger" @click="$emit('logout')">LOGOUT</button>
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
    justify-content: space-evenly;
    align-items: center;
    gap: 10px;
    color: #063c6d
}

.user-info {
    height: 80%;
    width: 70%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
    text-align: center;
}

.user-content div {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.1rem !important;
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
import axios from 'axios';
import { toast } from 'vue3-toastify'
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
    },
    methods: {
        async login() {  
            // Validate data
            let errMsg = 'The following fields are missing: ';
            let missingFields = []
            if (!this.email) {
                missingFields.push('Email')
            }
            if (!this.password) {
                missingFields.push('Password')
            }
            if (missingFields.length > 0) {
                errMsg += missingFields.join(', ')
                toast.error(errMsg, {
                    position: "top-right",
                    timeout: 5000,
                })
            } else {
                // Submit data
                // Testing - localhost url
                //let url = `http://localhost:4000/login`
                const baseURL = import.meta.env.DEV ? 'http://localhost:4000' : '';
                console.log(baseURL)
                try {
                    const response = await axios.post(`${baseURL}/login`, {
                        email: this.email,
                        password: this.password
                    })

                    if (response.data.error) {
                        toast.error(response.data.error, {
                            position: "top-right",
                            timeout: 10000,
                        })
                    } else {
                        this.$emit('login', response.data)
                        console.log(response.data)
                    }
                } catch (error) {
                    toast.error('Error logging in', {
                        position: "top-right",
                        timeout: 10000,
                    })
                }
            }
        },
    }
}
</script>