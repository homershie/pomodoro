<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>目前事項</h1>
        <h2>{{ tasks.currentTask }}</h2>
        <h2>{{ tasks.timeleft }}</h2>
        <h2>{{ timeLeftText }}</h2>
      </v-col>
      <v-col cols="12"
        ><DigitNumber v-for="(data, i) in timeLeftText" :key="i" color="white" :data="data" />
      </v-col>
      <v-col cols="12">
        <!--
        開始按鈕停用條件：
        1. 開始倒數中
        2. 目前沒有任何事項且沒有未完成事項
         -->
        <v-btn
          :disabled="
            status === STATUS.START || (tasks.currentTask.length === 0 && tasks.items.length === 0)
          "
          icon="mdi-play"
          @click="startTimer"
        ></v-btn>
        <!-- 只有開始倒數中才能暫停 -->
        <v-btn :disabled="status !== STATUS.START" icon="mdi-pause" @click="pause"></v-btn>
        <!-- 目前有事項才能跳過 -->
        <v-btn
          :disabled="tasks.currentTask.length === 0"
          icon="mdi-skip-next"
          @click="finish"
        ></v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useWebNotification } from '@vueuse/core'
import { computed, ref } from 'vue'
import DigitNumber from '@/components/DigitNumber.vue'
import { useTasksStore } from '@/stores/tasks.js'
import { useSettingsStore } from '@/stores/settings'

const tasks = useTasksStore()
const settings = useSettingsStore()

// 倒數狀態
const STATUS = {
  STOP: 0, // 停止
  START: 1, // 開始
  PAUSE: 2, // 暫停
}
const status = ref(STATUS.STOP)

// 計時器
let timer = 0
// 開始計時器
// 暫停繼續 + 停止開始
const startTimer = () => {
  // 如果是停止開始，更新目前事項
  if (status.value === STATUS.STOP && tasks.items.length > 0) {
    tasks.setCurrentItem()
  }

  // 狀態變成開始
  status.value = STATUS.START
  // 開始倒數
  timer = setInterval(() => {
    // 每秒更新目前事項的時間
    tasks.countdown()

    if (tasks.timeleft < 0) {
      finish()
    }
  }, 1000)
}

const pause = () => {
  clearInterval(timer)
  // 狀態變成暫停
  status.value = STATUS.PAUSE
}

const finish = () => {
  // 停止計時器
  clearInterval(timer)
  // 狀態變成停止
  status.value = STATUS.STOP
  // 播放鈴聲
  const audio = new Audio()
  audio.src = settings.selectedAlarm.file
  audio.play()

  const { show, isSupported } = useWebNotification({
    title: '事項完成',
    body: tasks.currentTask,
    icon: new URL('@/assets/tomato.png', import.meta.url).href,
  })
  // 顯示通知
  if (isSupported.value) {
    show()
  }

  // 重置
  tasks.setFinishedItem()

  if (tasks.items.length > 0) {
    // 開始下一個事項
    startTimer()
  }
}

const timeLeftText = computed(() => {
  const minutes = Math.floor(tasks.timeleft / 60)
    .toString()
    .padStart(2, '0')
  const seconds = (tasks.timeleft % 60).toString().padStart(2, '0')
  return `${minutes}:${seconds}`
})
</script>
