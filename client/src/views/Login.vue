<template>
  <div class="login-container main-background">
    <div class="navbar-offest">
      <v-layout>
        <v-flex xs12 sm6 offset-sm3>
        <v-card>
        <template>
          <div class="login-div">
            <v-tabs
              color="yellow"
              light
              slider-color="black"
              centered
            >
            <v-tab
              :key="'login'"
              ripple
            >
              Login
            </v-tab>
            <v-tab-item
              :key="'login'"
            >
              <v-card flat>
              <v-card-text>
                <v-form ref="login" lazy-validation @submit.prevent="login">
                  <v-text-field
                    label="E-mail"
                    v-model="email"
                    :rules="emailRules"
                    required
                  ></v-text-field>
                  <v-text-field
                    label="Password"
                    v-model="password"
                    :rules="passwordRules"
                    :append-icon="hidePassword ? 'visibility' : 'visibility_off'"
                    :append-icon-cb="() => (hidePassword = !hidePassword)"
                    :type="hidePassword ? 'password' : 'text'"
                    required
                  ></v-text-field>

                  <v-btn
                    @click="login"
                    class="centered"
                    color="success"
                    type="submit"
                  >
                  Login
                  </v-btn>
                </v-form>
              </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab
              :key="'register'"
              ripple
            >
              Register
            </v-tab>
            <v-tab-item
              :key="'register'"
            >
              <v-card flat>
              <v-card-text>
                <v-form ref="signup" lazy-validation @submit.prevent="login">
                  <v-text-field
                    label="Full Name"
                    v-model="name"
                    :rules="nameRules"
                    required
                  ></v-text-field>
                  <v-text-field
                    label="E-mail"
                    v-model="email"
                    :rules="emailRules"
                    required
                  ></v-text-field>
                  <v-text-field
                    label="Password"
                    v-model="password"
                    :rules="passwordRules"
                    :append-icon="hidePassword ? 'visibility' : 'visibility_off'"
                    :append-icon-cb="() => (hidePassword = !hidePassword)"
                    :type="hidePassword ? 'password' : 'text'"
                    required
                  ></v-text-field>
                  <v-text-field
                    label="Confirm Password"
                    v-model="confirmPassword"
                    :rules="confirmPasswordRules"
                    :append-icon="hideConfirmPassword ? 'visibility' : 'visibility_off'"
                    :append-icon-cb="() => (hideConfirmPassword = !hideConfirmPassword)"
                    :type="hideConfirmPassword ? 'password' : 'text'"
                    required
                  ></v-text-field>

                  <v-btn
                    @click="register"
                    class="centered"
                    color="success"
                    type="submit"
                  >
                    Register
                  </v-btn>
                </v-form>
              </v-card-text>
              </v-card>
            </v-tab-item>
            </v-tabs>

          </div>
        </template>
        </v-card>
        </v-flex>
      </v-layout>
    </div>
    <v-snackbar
      :timeout="5000"
      bottom
      v-model="snackbar"
    >
      {{ snackthat }}
    </v-snackbar>
  </div>
</template>

<script>
import * as jwt from 'jsonwebtoken';

import axiosBase from '@/utils/requestBase';

export default {
  data() {
    return {
      name: '',
      nameRules: [v => !!v || 'Name is required'],
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
      ],
      password: '',
      passwordRules: [v => !!v || 'Password is required'],
      hidePassword: true,
      hideConfirmPassword: true,
      confirmPassword: '',
      confirmPasswordRules: [
        v => !!v || 'Confirm Password is required',
        v => v === this.password || 'Passwords do not match'
      ],
      snackbar: false,
      timeout: 5000,
      snackthat: 'Unable to login. Please try again.'
    };
  },
  methods: {
    login() {
      const self = this;
      axiosBase
        .post('/api/auth/login', {
          email: self.email,
          password: self.password
        })
        .then(response => self.onAuthSuccess(response.data.token))
        .catch(self.onError);
    },
    register() {
      const self = this;
      axiosBase
        .post('/api/auth/signup', {
          name: self.name,
          email: self.email,
          password: self.password,
          confirmPassword: self.confirmPassword
        })
        .then(response => self.onAuthSuccess(response.data.token))
        .catch(self.onError);
    },
    onAuthSuccess(token) {
      window.localStorage.setItem('authorization', token);
      const decoded = jwt.decode(token);

      if (decoded.type === 'student') return this.$router.push({ path: '/student' });
      if (decoded.type === 'admin') return this.$router.push({ path: '/courses' });
      self.snackbar = true;

      return 'Unable to authenticate. Please try again.';
    },
    onError() {
      this.snackbar = true;
      return 'Unable to authenticate. Please try again.';
    }
  },
  computed: {}
};
</script>

<style scoped>
.main-background {
  background: linear-gradient(rgb(76, 175, 80) 50%, rgb(248, 250, 248) 0%);
  position: fixed;
  background-attachment: fixed;
  height: 100vh;
  width: 100%;
}
.navbar-offest {
  margin-top: 25vh;
}
.login-div {
  vertical-align: 'center';
  padding: auto auto;
}
.centered {
  margin: 0px auto;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
