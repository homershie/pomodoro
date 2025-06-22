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
    const shouldStopTimer = ref(false) // 用於通知首頁停止計時器

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
        // 檢查刪除的是否為當前正在進行的任務（第一個任務）
        const isCurrentTask = index === 0 && !isBreak.value && currentTask.value === task.text

        items.value.splice(index, 1)

        // 如果刪除的是當前任務，需要更新狀態
        if (isCurrentTask) {
          console.log('刪除了當前正在進行的任務:', task.text)
          // 通知首頁停止計時器
          shouldStopTimer.value = true

          // 清空當前任務
          currentTask.value = ''
          // 重置為工作時間
          timeleft.value = workTime.value
        }
      }
    }

    const completeTask = (task) => {
      const index = items.value.findIndex((t) => t.id === task.id)
      if (index !== -1) {
        // 檢查完成的是否為當前正在進行的任務（第一個任務）
        const isCurrentTask = index === 0 && !isBreak.value && currentTask.value === task.text

        finishedTasks.value.push({
          id: task.id,
          text: task.text,
        })
        items.value.splice(index, 1)

        // 如果完成的是當前任務，需要更新狀態
        if (isCurrentTask) {
          console.log('完成了當前正在進行的任務:', task.text)
          // 通知首頁停止計時器
          shouldStopTimer.value = true

          // 清空當前任務
          currentTask.value = ''

          // 如果還有更多任務，進入休息時間；否則結束
          if (items.value.length > 0) {
            isBreak.value = true
            timeleft.value = breakTime.value
            console.log('進入休息時間')
          } else {
            // 沒有更多任務，重置為工作時間
            timeleft.value = workTime.value
            console.log('所有任務完成')
          }
        }
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
        // 工作時間完成：將任務標記為完成
        finishedTasks.value.push({
          id: getNextId(),
          text: currentTask.value,
        })
        // 從待辦列表中移除已完成的任務
        if (items.value.length > 0) {
          items.value.shift()
        }

        // 清空當前任務顯示
        currentTask.value = ''

        // 如果還有更多任務，進入休息時間；否則結束
        if (items.value.length > 0) {
          isBreak.value = true
          timeleft.value = breakTime.value
          console.log('工作完成，進入休息時間')
        } else {
          // 沒有更多任務，保持工作狀態但清空任務
          timeleft.value = workTime.value
          console.log('所有任務完成')
        }
      } else if (isBreak.value) {
        // 休息時間完成：結束休息，準備下一個工作任務
        isBreak.value = false
        timeleft.value = workTime.value
        currentTask.value = ''
        console.log('休息結束，準備下一個任務')
      }
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

    // 將當前任務移動到未完成事項的最後一個位置
    const moveCurrentTaskToEnd = () => {
      // 如果是休息時間，直接跳過休息，不移動任何任務
      if (isBreak.value) {
        console.log('跳過休息時間')
        // 切換到工作狀態
        isBreak.value = false
        // 重置為工作時間
        timeleft.value = workTime.value
        // 清空當前任務顯示
        currentTask.value = ''
        return
      }

      // 工作時間的邏輯：移動當前任務到最後
      if (items.value.length > 0) {
        // 取得第一個任務（當前任務）
        const currentTaskItem = items.value.shift()
        // 將其添加到列表最後
        items.value.push(currentTaskItem)

        // 清空當前任務顯示
        currentTask.value = ''

        // 重置時間（保持工作狀態）
        timeleft.value = workTime.value

        console.log(
          '當前任務已移至最後，新的任務列表:',
          items.value.map((t) => t.text)
        )
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
      shouldStopTimer,
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
      moveCurrentTaskToEnd,
    }
  },
  {
    persist: {
      key: 'pomodoro-list',
    },
  }
)
