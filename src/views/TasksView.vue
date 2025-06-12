<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-center">未完成</h1>
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="input"
          append-icon="mdi-plus"
          clearable
          label="新增事項"
          :rules="[rules.required, rules.length]"
          @click:append="onAddFormSubmit"
          @keyup.enter="onAddFormSubmit"
          ref="inputField"
        />
        <v-table>
          <thead>
            <tr>
              <th>事項</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="tasks.items.length === 0">
              <td colspan="2" class="text-center">沒有待辦事項</td>
            </tr>
            <tr v-for="(task, i) in tasks.items" :key="task.id">
              <td>
                <v-text-field
                  v-if="task.edit"
                  v-model="task.model"
                  :rules="[rules.required, rules.length]"
                  autofocus
                  ref="editField"
                  @keyup.enter="onEditSubmit(task, i)"
                  @keyup.esc="onEditCancel(task)"
                />
                <span v-else>{{ task.text }}</span>
              </td>
              <td>
                <template v-if="task.edit">
                  <v-btn icon="mdi-check" @click="onEditSubmit(task, i)" />
                  <v-btn icon="mdi-undo" @click="onEditCancel(task)" />
                </template>
                <template v-else>
                  <v-btn icon="mdi-pencil" @click="tasks.editTask(task)" />
                  <v-btn icon="mdi-delete" @click="tasks.deleteTask(task)" />
                </template>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
      <v-col cols="12">
        <h1 class="text-center">已完成</h1>
      </v-col>
      <v-col cols="12">
        <v-table>
          <thead>
            <tr>
              <th>事項</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="tasks.finishedTasks.length === 0">
              <td colspan="2">沒有事項</td>
            </tr>
            <tr v-for="item in tasks.finishedTasks" :key="item.id">
              <td>{{ item.text }}</td>
              <td>
                <v-btn icon="mdi-delete" @click="tasks.delFinishedItem(item.id)" />
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, useTemplateRef } from 'vue'
import { useTasksStore } from '@/stores/tasks.js'
const tasks = useTasksStore()

const input = ref('')
// 取得輸入欄位的模板引用
// Vue 3.5 以前寫法
// const inputTextField = ref(null)
// Vue 3.5 寫法
const inputField = useTemplateRef('inputField')
const editField = useTemplateRef('editField')
1
const rules = {
  // eslint-disable-next-line @stylistic/arrow-parens
  required: (value) => {
    return Boolean(value) || '此欄位為必填'
  },
  // eslint-disable-next-line @stylistic/arrow-parens
  length: (value) => {
    return (value.length <= 20 && value.length >= 3) || '長度必須大於3個字，不超過20個字'
  },
}

const onAddFormSubmit = () => {
  if (!inputField.value.isValid) return
  tasks.addTask(input.value)
  input.value = ''
}

const onEditSubmit = (task, i) => {
  if (!editField.value[i].isValid) return
  tasks.submitEdit(task)
}
const onEditCancel = (task) => {
  tasks.cancelEdit(task)
}
</script>
