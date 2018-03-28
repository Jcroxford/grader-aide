<template>
  <div class="assignment-container main-background">
    <v-container>
      <v-layout row>
        <v-flex xs12>
          <v-card>
            <v-card-title primary-title>
              <v-layout row>
                <v-flex xs12>
                  <p class="display-3">test title</p>
                  <h5 class="title mb-3">total points possible</h5>
                  <v-divider></v-divider>
                </v-flex>
              </v-layout>
            </v-card-title>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>

<style scoped>
.main-background {
  background: linear-gradient(rgb(76, 175, 80) 50%, rgb(250, 250, 250) 0%);
  position: fixed;
  background-attachment: fixed;
}

.assignment-container {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: min-content;
  position: relative;
}
</style>
