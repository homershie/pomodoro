import { defineStore } from 'pinia'
import { ref } from 'vue'

const time = parseInt(import.meta.env.VITE_TIME)
const timeBreak = parseInt(import.meta.env.VITE_TIME_BREAK)

export const useTasksStore = defineStore(
  'tasks',
  () => {
    const items = ref([])
    const finishedTasks = ref([])
    const currentTask = ref('')
    let id = 1

    const timeleft = ref(time)
    const isBreak = ref(false)
    const addTask = (text) => {
      items.value.push({
        id: id++,
        text,
        edit: false,
        model: text,
      })
    }

    const editTask = (task) => {
      const t = items.value.find((t) => t.id === task.id)
      if (t) t.edit = true
    }

    const submitEdit = (task) => {
      const t = items.value.find((t) => t.id === task.id)
      if (t) {
        t.text = t.model
        t.edit = false
      }
    }

    const cancelEdit = (task) => {
      const t = items.value.find((t) => t.id === task.id)
      if (t) {
        t.edit = false
        t.model = t.text
      }
    }

    const deleteTask = (task) => {
      const index = items.value.findIndex((t) => t.id === task.id)
      if (index !== -1) {
        items.value.splice(index, 1)
      }
    }

    const setCurrentItem = () => {
      if (!isBreak.value && items.value.length > 0) {
        currentTask.value = items.value[0].text // 只取得第一個事項的文字，不移除
      } else {
        currentTask.value = isBreak.value ? '休息時間' : ''
      }
    }

    const countdown = () => {
      timeleft.value--
    }

    const setFinishedItem = () => {
      if (!isBreak.value && currentTask.value) {
        // 如果不是休息時間且有當前任務，將其加入完成清單
        finishedTasks.value.push({
          id: id++,
          text: currentTask.value,
        })
        // 從待辦清單中移除已完成的事項
        if (items.value.length > 0) {
          items.value.shift()
        }
      }

      // 清空當前任務
      currentTask.value = ''

      // 切換休息狀態
      if (items.value.length > 0) {
        isBreak.value = !isBreak.value
      }

      // 重置時間
      timeleft.value = isBreak.value ? timeBreak : time
    }

    const delFinishedItem = (id) => {
      const i = finishedTasks.value.findIndex((item) => item.id === id)
      if (i !== -1) {
        finishedTasks.value.splice(i, 1)
      }
    }
    return {
      items,
      finishedTasks,
      currentTask,
      timeleft,
      addTask,
      editTask,
      submitEdit,
      cancelEdit,
      deleteTask,
      setCurrentItem,
      countdown,
      setFinishedItem,
      delFinishedItem,
    }
  },
  {
    persist: {
      key: 'pomodoro-list',
    },
  }
)
