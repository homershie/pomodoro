import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useSettingsStore = defineStore(
  'settings',
  () => {
    const alarms = [
      { id: 1, name: '鬧鐘', file: new URL('@/assets/alarm.mp3', import.meta.url).href },
      { id: 2, name: 'yay', file: new URL('@/assets/yay.mp3', import.meta.url).href },
    ]
    const selected = ref(1)

    // 音量設定 (0-1)
    const volume = ref(1)

    // 工作時間和休息時間設定 (分鐘)
    const workMinutes = ref(25)
    const breakMinutes = ref(5)

    // 通知設定
    const notifications = ref(true)

    const selectedAlarm = computed(() => {
      const i = alarms.findIndex((alarm) => alarm.id === selected.value)
      return alarms[i] || alarms[0]
    })

    return {
      alarms,
      selected,
      selectedAlarm,
      volume,
      workMinutes,
      breakMinutes,
      notifications,
    }
  },
  {
    persist: {
      key: 'pomodoro-settings',
      pick: ['selected', 'volume', 'workMinutes', 'breakMinutes', 'notifications'],
    },
  }
)
