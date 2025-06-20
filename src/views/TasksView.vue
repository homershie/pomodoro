<template>
  <v-container>
    <v-row class="justify-center">
      <v-col xxl="8" xl="8" lg="10" md="10" sm="12" xs="12">
        <h1 class="text-secondary">未完成</h1>
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <v-col xxl="7" xl="7" lg="9" md="9" sm="12" xs="12">
        <v-text-field
          v-model="input"
          prepend-inner-icon="mdi-plus"
          clearable
          label="新增事項"
          :rules="[rules.required, rules.length]"
          @keyup.enter="onAddFormSubmit"
          ref="inputField"
          color="secondary"
          variant="outlined"
          validate-on-blur
        />
      </v-col>
      <v-col cols="1">
        <v-btn
          class="addBtn"
          text="新增"
          @click="onAddFormSubmit"
          color="secondary"
          variant="elevated"
        />
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <v-col xxl="8" xl="8" lg="10" md="10" sm="12" xs="12">
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
                  <v-btn icon="mdi-check-circle" @click="tasks.completeTask(task)" />
                  <v-btn icon="mdi-pencil" @click="tasks.editTask(task)" />
                  <v-btn icon="mdi-delete" @click="tasks.deleteTask(task)" />
                </template>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <v-col xxl="8" xl="8" lg="10" md="10" sm="12" xs="12">
        <h1 class="text-secondary">已完成</h1>
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <v-col xxl="8" xl="8" lg="10" md="10" sm="12" xs="12">
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
                <v-btn icon="mdi-restore" @click="tasks.restoreTask(item.id)" />
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

<style scoped lang="scss">
.v-text-field {
  background-color: transparent;
  --v-theme-surface: transparent !important;
  --v-hover-opacity: 0 !important;
}

.v-table {
  .v-btn {
    box-shadow: none;
    background-color: transparent;
    filter: none;
    transition: color 0.2s ease;
    --v-theme-surface: transparent !important;
    --v-hover-opacity: 0 !important;

    &:hover {
      color: #e74c3c;
      background-color: transparent !important;
      opacity: 1 !important;
    }
  }
  tr {
    th {
      &:first-child {
        width: 70%;
      }
      &:last-child {
        width: 30%;
        text-align: center;
      }
    }
    td {
      &:first-child {
        width: 70%;
      }
      &:last-child {
        width: 30%;
        text-align: center;
      }
    }
  }
}

.addBtn {
  margin-top: 4px;
  height: 48px;
  width: 100%;
  box-shadow: none;
  transition: filter 0.2s ease;
  &:hover {
    filter: brightness(1.1);
  }
}
</style>
