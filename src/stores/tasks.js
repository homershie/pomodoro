import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useSettingsStore } from './settings.js'

export const useTasksStore = defineStore(
  'tasks',
  () => {
    const items = ref([])
    const finishedTasks = ref([])
    const currentTask = ref('')
    const nextId = ref(1)

    const isBreak = ref(false)

    // 使用 settings store 的時間設定
    const settings = useSettingsStore()

    // 計算工作和休息時間（秒）
    const workTime = computed(() => settings.workMinutes * 60)
    const breakTime = computed(() => settings.breakMinutes * 60)

    const timeleft = ref(workTime.value)

    // 清理重複ID並重新分配
    const cleanupDuplicateIds = () => {
      const allTasks = [...items.value, ...finishedTasks.value]
      const seenIds = new Set()
      const duplicateIds = new Set()

      // 找出重複的ID
      allTasks.forEach((task) => {
        if (seenIds.has(task.id)) {
          duplicateIds.add(task.id)
        } else {
          seenIds.add(task.id)
        }
      })

      if (duplicateIds.size > 0) {
        console.warn('發現重複ID:', Array.from(duplicateIds))

        // 重新分配ID給所有任務
        let newId = 1
        items.value.forEach((task) => {
          task.id = newId++
        })
        finishedTasks.value.forEach((task) => {
          task.id = newId++
        })

        nextId.value = newId
        console.log('已重新分配所有ID')
      }
    }

    // 生成唯一 ID
    const getNextId = () => {
      return nextId.value++
    }

    // 初始化 ID 系統
    const initializeIds = () => {
      // 先清理重複ID
      cleanupDuplicateIds()

      // 確保 nextId 是最大值 + 1
      const allIds = [
        ...items.value.map((item) => item.id),
        ...finishedTasks.value.map((item) => item.id),
      ]

      if (allIds.length > 0) {
        nextId.value = Math.max(...allIds) + 1
      }

      console.log('ID系統初始化完成，nextId:', nextId.value)
    }

    const addTask = (text) => {
      const newTask = {
        id: getNextId(),
        text,
        edit: false,
        model: text,
      }
      items.value.push(newTask)
      console.log('添加任務 ID:', newTask.id)
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

    const completeTask = (task) => {
      const index = items.value.findIndex((t) => t.id === task.id)
      if (index !== -1) {
        finishedTasks.value.push({
          id: task.id,
          text: task.text,
        })
        items.value.splice(index, 1)
      }
    }

    const setCurrentItem = () => {
      if (!isBreak.value && items.value.length > 0) {
        currentTask.value = items.value[0].text
      } else {
        currentTask.value = isBreak.value ? '休息時間' : ''
      }
    }

    const countdown = () => {
      timeleft.value--
    }

    const setFinishedItem = () => {
      if (!isBreak.value && currentTask.value) {
        finishedTasks.value.push({
          id: getNextId(),
          text: currentTask.value,
        })
        if (items.value.length > 0) {
          items.value.shift()
        }
      }

      currentTask.value = ''

      if (items.value.length > 0) {
        isBreak.value = !isBreak.value
      }

      timeleft.value = isBreak.value ? breakTime.value : workTime.value
    }

    const delFinishedItem = (id) => {
      const i = finishedTasks.value.findIndex((item) => item.id === id)
      if (i !== -1) {
        finishedTasks.value.splice(i, 1)
      }
    }

    const restoreTask = (id) => {
      const i = finishedTasks.value.findIndex((item) => item.id === id)
      if (i !== -1) {
        const task = finishedTasks.value[i]
        items.value.push({
          id: getNextId(),
          text: task.text,
          edit: false,
          model: task.text,
        })
        finishedTasks.value.splice(i, 1)
      }
    }

    // 重置所有數據
    const resetAllData = () => {
      items.value = []
      finishedTasks.value = []
      currentTask.value = ''
      nextId.value = 1
      console.log('已重置所有數據')
    }

    // 在 store 初始化時調用
    initializeIds()

    // 監控數據變化，確保沒有重複ID
    watch(
      [items, finishedTasks],
      () => {
        const allIds = [
          ...items.value.map((item) => item.id),
          ...finishedTasks.value.map((item) => item.id),
        ]
        const uniqueIds = new Set(allIds)
        if (allIds.length !== uniqueIds.size) {
          console.error('檢測到重複ID，正在修復...')
          cleanupDuplicateIds()
        }
      },
      { deep: true }
    )

    return {
      items,
      finishedTasks,
      currentTask,
      timeleft,
      isBreak,
      workTime,
      breakTime,
      nextId,
      addTask,
      editTask,
      submitEdit,
      cancelEdit,
      deleteTask,
      completeTask,
      setCurrentItem,
      countdown,
      setFinishedItem,
      delFinishedItem,
      restoreTask,
      initializeIds,
      resetAllData,
      cleanupDuplicateIds,
    }
  },
  {
    persist: {
      key: 'pomodoro-list',
    },
  }
)
