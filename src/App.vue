<template>
  <v-app>
    <v-app-bar class="bg-primary">
      <v-container class="d-flex align-center" style="max-width: 1200px">
        <v-app-bar-title>
          <router-link to="/" class="text-decoration-none">
            <img style="height: 32px" src="@/assets/tomato.png" alt="logo" /> </router-link
        ></v-app-bar-title>
        <v-btn prepend-icon="mdi-home" to="/" :ripple="false" rounded="0">首頁</v-btn>
        <v-btn prepend-icon="mdi-format-list-bulleted" to="/tasks" :ripple="false" rounded="0"
          >任務列表</v-btn
        >
        <v-btn prepend-icon="mdi-cog" to="/settings" :ripple="false" rounded="0">設定</v-btn>
        <v-btn icon="mdi-theme-light-dark" @click="toggleTheme" :ripple="false"></v-btn>
      </v-container>
    </v-app-bar>
    <v-main>
      <router-view v-slot="{ Component }">
        <!--
        keep-alive 包住的項目不會被銷毀
        include 屬性指定哪些組件需要被保留(快取)
           https://zh-hk.vuejs.org/guide/built-ins/keep-alive.html#include-exclude
          -->
        <!--
            component 動態元件
            is 要使用的元件
          -->
        <keep-alive include="HomeView">
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </v-main>
  </v-app>
</template>

<script setup>
import { useTheme } from 'vuetify'
const theme = useTheme()
function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'pomodoroTheme' : 'pomodoroDarkTheme'
}
</script>

<style scoped lang="scss">
:deep(.v-btn) {
  margin-left: 10px;
  font-size: 1rem;
  font-weight: bold;
  box-shadow: none;
  background-color: transparent;
  filter: none;
  transition: all 0.1s ease;

  &.v-btn--active {
    color: #e74c3c;
    font-weight: bold;
  }
}

:deep(.v-btn--active > .v-btn__overlay) {
  opacity: 0 !important;
}

:deep(.v-ripple__container) {
  display: none !important;
}

:deep(.v-ripple__animation) {
  display: none !important;
}
</style>
