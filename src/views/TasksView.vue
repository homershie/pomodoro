<template>
  <v-container>
    <v-row class="justify-center">
      <v-col xxl="8" xl="8" lg="10" md="10" sm="12" xs="12">
        <h1 class="text-secondary">未完成任務</h1>
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <v-col xxl="7" xl="7" lg="9" md="9" sm="12" xs="12">
        <v-text-field
          v-model="input"
          prepend-inner-icon="mdi-plus"
          clearable
          label="新增任務"
          :rules="[rules.required, rules.length]"
          @keyup.enter="onAddFormSubmit"
          ref="inputField"
          color="secondary"
          variant="outlined"
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
        <draggable
          v-model="tasks.items"
          class="sortable-container"
          item-key="id"
          handle=".drag-handle"
          :animation="150"
          ghost-class="ghost"
          chosen-class="chosen"
          drag-class="drag"
          :component-data="{
            tag: 'div',
            type: 'transition-group',
            name: !drag ? 'flip-list' : null,
          }"
          @start="drag = true"
          @end="drag = false"
        >
          <template #item="{ element: task, index: i }">
            <v-card class="task-item mb-2" elevation="0">
              <v-card-text class="d-flex align-center">
                <v-icon class="drag-handle me-3" color="secondary">mdi-drag</v-icon>
                <div class="flex-grow-1">
                  <v-text-field
                    v-if="task.edit"
                    v-model="task.model"
                    :rules="[rules.required, rules.length]"
                    autofocus
                    @keyup.enter="onEditSubmit(task, i)"
                    @keyup.esc="onEditCancel(task)"
                    variant="underlined"
                  />
                  <span v-else class="task-text">{{ task.text }}</span>
                </div>
                <div class="task-actions">
                  <template v-if="task.edit">
                    <v-btn icon="mdi-check" size="small" @click="onEditSubmit(task, i)" />
                    <v-btn icon="mdi-undo" size="small" @click="onEditCancel(task)" />
                  </template>
                  <template v-else>
                    <v-btn icon="mdi-check-circle" size="small" @click="tasks.completeTask(task)" />
                    <v-btn icon="mdi-pencil" size="small" @click="tasks.editTask(task)" />
                    <v-btn icon="mdi-delete" size="small" @click="tasks.deleteTask(task)" />
                  </template>
                </div>
              </v-card-text>
            </v-card>
          </template>
        </draggable>
        <v-card v-if="tasks.items.length === 0" class="text-center pa-4" variant="outlined">
          <v-card-text>
            <v-icon size="48" color="secondary" class="mb-2">mdi-clipboard-text-outline</v-icon>
            <div class="text-h6">沒有待辦任務</div>
            <div class="text-caption text-medium-emphasis">新增一個任務開始您的番茄鐘！</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <v-col xxl="8" xl="8" lg="10" md="10" sm="12" xs="12">
        <h1 class="text-success">已完成任務</h1>
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <v-col xxl="8" xl="8" lg="10" md="10" sm="12" xs="12">
        <draggable
          v-model="tasks.finishedTasks"
          class="sortable-container"
          item-key="id"
          handle=".drag-handle"
          :animation="150"
          ghost-class="ghost"
          chosen-class="chosen"
          drag-class="drag"
          :component-data="{
            tag: 'div',
            type: 'transition-group',
            name: !drag ? 'flip-list' : null,
          }"
          @start="drag = true"
          @end="drag = false"
        >
          <template #item="{ element: item }">
            <v-card class="task-item mb-2" elevation="0">
              <v-card-text class="d-flex align-center">
                <v-icon class="drag-handle me-3" color="success">mdi-drag</v-icon>
                <div class="flex-grow-1">
                  <span class="task-text completed">{{ item.text }}</span>
                </div>
                <div class="task-actions">
                  <v-btn icon="mdi-restore" size="small" @click="tasks.restoreTask(item.id)" />
                  <v-btn icon="mdi-delete" size="small" @click="tasks.delFinishedItem(item.id)" />
                </div>
              </v-card-text>
            </v-card>
          </template>
        </draggable>
        <v-card v-if="tasks.finishedTasks.length === 0" class="text-center pa-4" variant="outlined">
          <v-card-text>
            <v-icon size="48" color="success" class="mb-2">mdi-trophy-outline</v-icon>
            <div class="text-h6">還沒有完成的任務</div>
            <div class="text-caption text-medium-emphasis">完成任務後會顯示在這裡</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, useTemplateRef } from 'vue'
import draggable from 'vuedraggable'
import { useTasksStore } from '@/stores/tasks.js'

const tasks = useTasksStore()
const input = ref('')
const inputField = useTemplateRef('inputField')
const drag = ref(false)

const rules = {
  required: (value) => Boolean(value) || '此欄位為必填',
  length: (value) => (value.length <= 20 && value.length >= 3) || '長度必須大於3個字，不超過20個字',
}

const onAddFormSubmit = () => {
  if (!inputField.value.isValid) return
  tasks.addTask(input.value)
  input.value = ''
}

const onEditSubmit = (task, i) => {
  tasks.submitEdit(task)
}

const onEditCancel = (task) => {
  tasks.cancelEdit(task)
}
</script>

<style scoped lang="scss">
.sortable-container {
  min-height: 60px;
}

.task-item {
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(var(--v-theme-surface-variant), 0.2);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &.ghost {
    opacity: 0.5;
    background: rgba(var(--v-theme-secondary), 0.1);
  }

  &.chosen {
    transform: scale(1.02);
    box-shadow: 0 6px 20px rgba(var(--v-theme-secondary), 0.3);
  }

  &.drag {
    transform: rotate(2deg);
  }
}

.drag-handle {
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
}

.task-text {
  font-size: 1rem;
  line-height: 1.5;

  &.completed {
    text-decoration: line-through;
    opacity: 0.7;
  }
}

.task-actions {
  display: flex;
  gap: 4px;

  .v-btn {
    transition: all 0.2s ease;

    &:hover {
      transform: scale(1.1);
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

// 拖拽過渡效果
.flip-list-move {
  transition: transform 0.3s ease;
}
</style>
