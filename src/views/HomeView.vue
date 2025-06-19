<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <!-- Swiper 卡片區域 -->
        <div class="swiper-container">
          <swiper
            :slides-per-view="1"
            :space-between="40"
            :centered-slides="true"
            :loop="false"
            :pagination="{ clickable: true }"
            :modules="modules"
            class="task-swiper"
          >
            <!-- 當前任務卡片 -->
            <swiper-slide v-if="tasks.currentTask">
              <v-card class="mx-auto task-card current-task" max-width="344">
                <v-card-text>
                  <div class="task-status">目前事項</div>
                  <p class="text-h3 font-weight-black task-title">{{ tasks.currentTask }}</p>
                  <p class="time-display">{{ timeLeftText }}</p>
                  <div class="text-medium-emphasis task-description">
                    專注於當前任務，保持高效工作節奏。<br />
                    完成後記得休息一下，保持身心健康。
                  </div>
                </v-card-text>
              </v-card>
            </swiper-slide>

            <!-- 待辦任務卡片 -->
            <swiper-slide v-for="(task, index) in pendingTasks" :key="task.id">
              <v-card class="mx-auto task-card pending-task" max-width="344">
                <v-card-text>
                  <div class="task-status">待辦事項 #{{ index + (tasks.currentTask ? 2 : 1) }}</div>
                  <p class="text-h3 font-weight-bold task-title">{{ task.text }}</p>
                  <p class="time-display">{{ formatTime(time) }}</p>
                  <div class="text-medium-emphasis task-description">
                    預計需要 {{ Math.ceil(time / 60) }} 分鐘完成<br />
                    準備好開始這個任務了嗎？
                  </div>
                </v-card-text>
              </v-card>
            </swiper-slide>

            <!-- 已完成任務卡片 -->
            <swiper-slide
              v-for="finishedTask in tasks.finishedTasks.slice(-3)"
              :key="'finished-' + finishedTask.id"
            >
              <v-card class="mx-auto task-card completed-task" max-width="344">
                <v-card-text>
                  <div class="task-status">已完成</div>
                  <p class="text-h3 font-weight-bold task-title">{{ finishedTask.text }}</p>
                  <div class="completed-icon">
                    <v-icon size="48" color="success">mdi-check-circle</v-icon>
                  </div>
                  <div class="text-medium-emphasis task-description">
                    恭喜完成這個任務！<br />
                    繼續保持這個節奏。
                  </div>
                </v-card-text>
              </v-card>
            </swiper-slide>

            <!-- 空狀態卡片 -->
            <swiper-slide
              v-if="
                tasks.items.length === 0 && !tasks.currentTask && tasks.finishedTasks.length === 0
              "
            >
              <v-card class="mx-auto task-card empty-state" max-width="344">
                <v-card-text class="text-center d-flex flex-column justify-center align-center">
                  <v-icon size="64" color="secondary">mdi-plus-circle-outline</v-icon>
                  <p class="text-h4 font-weight-bold mt-4">開始您的番茄鐘</p>
                  <div class="text-medium-emphasis">
                    前往任務頁面新增您的第一個任務<br />
                    開始高效的工作時光！
                  </div>
                  <v-btn color="secondary" class="mt-4" to="/tasks">新增任務</v-btn>
                </v-card-text>
              </v-card>
            </swiper-slide>
          </swiper>
        </div>
      </v-col>
    </v-row>
    <v-row class="my-5">
      <v-col cols="12" class="text-center"
        ><DigitNumber v-for="(data, i) in timeLeftText" :key="i" :color="digitColor" :data="data" />
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <v-col cols="1" class="text-center">
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
          class="bg-secondary"
        ></v-btn>
      </v-col>
      <v-col cols="1" class="text-center">
        <!-- 只有開始倒數中才能暫停 -->
        <v-btn
          :disabled="status !== STATUS.START"
          icon="mdi-pause"
          @click="pause"
          class="bg-secondary"
        ></v-btn>
      </v-col>
      <v-col cols="1" class="text-center">
        <v-btn
          :disabled="tasks.currentTask.length === 0"
          icon="mdi-skip-next"
          @click="finish(true)"
          class="bg-secondary"
        ></v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useWebNotification } from '@vueuse/core'
import { computed, ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import DigitNumber from '@/components/DigitNumber.vue'
import { useTasksStore } from '@/stores/tasks.js'
import { useSettingsStore } from '@/stores/settings'
import { useTheme } from 'vuetify'

const theme = useTheme()
const digitColor = computed(() => theme.global.current.value.colors['on-background'] || '#fff')
const tasks = useTasksStore()
const settings = useSettingsStore()

// Swiper modules
const modules = [Pagination]

// 取得環境變數中的時間設定
const time = parseInt(import.meta.env.VITE_TIME) || 1500 // 預設 25 分鐘
const timeBreak = parseInt(import.meta.env.VITE_TIME_BREAK) || 300 // 預設 5 分鐘

// 格式化時間函數
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0')
  const secs = (seconds % 60).toString().padStart(2, '0')
  return `${minutes}:${secs}`
}

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

const finish = (isSkip = false) => {
  // 停止計時器
  clearInterval(timer)
  // 狀態變成停止
  status.value = STATUS.STOP

  // 只有在不是跳過的情況下才播放鈴聲和顯示通知
  if (!isSkip) {
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

const pendingTasks = computed(() => {
  // 如果有當前任務，則排除第一個任務（因為當前任務是從 items[0] 取得的）
  // 如果沒有當前任務，則顯示所有任務
  if (tasks.currentTask && tasks.items.length > 0) {
    return tasks.items.slice(1) // 排除第一個任務
  }
  return tasks.items
})
</script>

<style scoped lang="scss">
.v-btn {
  box-shadow: none;
  transition: filter 0.2s ease;
  &:hover {
    box-shadow: none;
    filter: brightness(1.1);
  }
}

.swiper-container {
  padding: 20px 0;
  overflow: visible;

  .task-swiper {
    height: 300px;
    overflow: visible;

    :deep(.swiper-wrapper) {
      overflow: visible;
    }

    :deep(.swiper-slide) {
      overflow: visible;
    }

    :deep(.swiper-pagination) {
      bottom: 10px;

      .swiper-pagination-bullet {
        background: rgba(var(--v-theme-secondary), 0.5);

        &.swiper-pagination-bullet-active {
          background: rgb(var(--v-theme-secondary));
        }
      }
    }
  }
}

.task-card {
  height: 240px;
  transition: all 0.3s ease;
  border-radius: 16px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }

  .task-status {
    font-size: 0.875rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
  }

  .task-title {
    margin: 8px 0;
    line-height: 1.2;
    min-height: 60px;
    display: flex;
    align-items: center;
  }

  .time-display {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 12px 0;
    color: rgb(var(--v-theme-secondary));
  }

  .task-description {
    font-size: 0.875rem;
    line-height: 1.4;
  }

  .completed-icon {
    text-align: center;
    margin: 16px 0;
  }

  // 不同狀態的卡片樣式
  &.current-task {
    border: 2px solid rgb(var(--v-theme-secondary));
    background: linear-gradient(
      135deg,
      rgba(var(--v-theme-secondary), 0.05) 0%,
      rgba(var(--v-theme-secondary), 0.02) 100%
    );

    .task-status {
      color: rgb(var(--v-theme-secondary));
    }
  }

  &.pending-task {
    border: 1px solid rgba(var(--v-theme-surface-variant), 0.3);

    .task-status {
      color: rgb(var(--v-theme-secondary));
    }
  }

  &.completed-task {
    border: 1px solid rgba(var(--v-theme-success), 0.3);
    background: linear-gradient(
      135deg,
      rgba(var(--v-theme-success), 0.05) 0%,
      rgba(var(--v-theme-success), 0.02) 100%
    );

    .task-status {
      color: rgb(var(--v-theme-secondary));
    }
  }

  &.empty-state {
    border: 2px dashed rgba(var(--v-theme-secondary), 0.3);
    background: rgba(var(--v-theme-surface-variant), 0.1);
    display: flex;
    align-items: center;
    justify-content: center;

    .v-card-text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100%;
      text-align: center;
      padding: 24px;
      margin: 0;
    }
  }
}

// 響應式設計
@media (max-width: 600px) {
  .swiper-container {
    padding: 30px 0; // 小螢幕的 padding
    overflow: visible;
  }

  .task-card {
    max-width: 300px !important;
    height: 220px;

    .task-title {
      font-size: 1.25rem !important;
      min-height: 50px;
    }

    &.empty-state {
      .v-card-text {
        padding: 16px;
      }
    }
  }

  .swiper-container .task-swiper {
    height: 300px; // 小螢幕的高度
    overflow: visible;
  }
}
</style>
