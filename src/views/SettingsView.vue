<template>
  <v-container>
    <v-row class="justify-center">
      <v-col xxl="5" xl="5" lg="7" md="7" sm="12" xs="12">
        <h1 class="text-secondary">鈴聲設定</h1>

        <!-- 鈴聲設定區塊 -->
      </v-col>
      <v-col xxl="3" xl="3" lg="3" md="3" sm="12" xs="12" class="d-flex align-center">
        <v-icon @click="toggleMute()">{{
          settings.volume === 0 ? 'mdi-volume-off' : 'mdi-volume-high'
        }}</v-icon>
        <v-slider
          v-model="settings.volume"
          :min="0"
          :max="1"
          :step="0.01"
          class="mx-4"
          style="flex: 1"
          hide-details
        />
        <span style="min-width: 40px">{{
          isNaN(settings.volume) ? '100%' : Math.round(settings.volume * 100) + '%'
        }}</span>
      </v-col>
      <v-col xxl="8" xl="8" lg="10" md="10" sm="12" xs="12">
        <v-table>
          <thead>
            <tr>
              <th>名稱</th>
              <th>試聽</th>
              <th>選擇</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="alarm in settings.alarms" :key="alarm.id">
              <td>{{ alarm.name }}</td>
              <td>
                <audio controls :src="alarm.file" />
              </td>
              <td>
                <v-radio-group v-model="settings.selected" hide-details>
                  <v-radio class="justify-center" :value="alarm.id" />
                </v-radio-group>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>

    <!-- 時間設定區塊 -->
    <v-row class="justify-center">
      <v-col xxl="8" xl="8" lg="10" md="10" sm="12" xs="12">
        <h1 class="text-secondary">時間設定</h1>
      </v-col>
    </v-row>

    <v-row class="justify-center">
      <v-col xxl="8" xl="8" lg="10" md="10" sm="12" xs="12">
        <v-table
          ><tr>
            <td class="pa-5">
              <v-text-field
                v-model.number="settings.workMinutes"
                label="工作時間 (分鐘)"
                type="number"
                min="1"
                max="120"
                :rules="[(v) => v > 0 || '必須大於0分鐘']"
                variant="outlined"
                density="compact"
                class="mt-5"
              />
            </td>
            <td class="pa-5">
              <v-text-field
                v-model.number="settings.breakMinutes"
                label="休息時間 (分鐘)"
                type="number"
                min="1"
                max="60"
                :rules="[(v) => v > 0 || '必須大於0分鐘']"
                variant="outlined"
                density="compact"
                class="mt-5"
              />
            </td></tr
        ></v-table>
      </v-col>
    </v-row>

    <!-- 通知設定區塊 -->
    <v-row class="justify-center">
      <v-col xxl="8" xl="8" lg="10" md="10" sm="12" xs="12">
        <h1 class="text-secondary">通知設定</h1>
      </v-col>
    </v-row>

    <v-row class="justify-center">
      <v-col xxl="8" xl="8" lg="10" md="10" sm="12" xs="12">
        <v-table>
          <tr>
            <td class="pa-5">
              <v-switch
                v-model="settings.notifications"
                label="啟用桌面通知"
                color="primary"
                :prepend-icon="settings.notifications ? 'mdi-bell' : 'mdi-bell-off'"
                inset
                hide-details
              />
              <div class="text-caption text-medium-emphasis mt-2">
                當番茄鐘結束時顯示 Windows 桌面通知
              </div>
            </td>
          </tr>
        </v-table>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
import { onMounted, watch, nextTick, ref } from 'vue'
import { useSettingsStore } from '@/stores/settings'

const settings = useSettingsStore()
const previousVolume = ref(1) // 記錄靜音前的音量

// 音量預設值處理
onMounted(() => {
  if (typeof settings.volume !== 'number' || isNaN(settings.volume)) {
    settings.volume = 1
  }
  previousVolume.value = settings.volume
})

// 切換靜音/恢復音量
const toggleMute = () => {
  if (settings.volume > 0) {
    // 記錄當前音量並靜音
    previousVolume.value = settings.volume
    settings.volume = 0
  } else {
    // 恢復到之前的音量
    settings.volume = previousVolume.value
  }
}

// 音量同步到所有 audio
watch(
  () => settings.volume,
  (val) => {
    nextTick(() => {
      document.querySelectorAll('audio').forEach((audio) => {
        audio.volume = typeof val === 'number' && !isNaN(val) ? val : 1
      })
    })
  },
  { immediate: true }
)
</script>

<style scoped lang="scss">
:deep(tbody) {
  tr {
    height: 100px;
  }

  td {
    &:nth-child(2) {
      width: 60%;
      padding: 8px;
    }

    &:nth-child(1) {
      width: 25%;
    }

    &:nth-child(3) {
      width: 15%;
      text-align: center;
    }
  }

  audio {
    width: 100%;
    max-width: 100%;
    height: 40px;
    border-radius: 4px;
    background-color: rgb(var(--v-theme-surface)) !important;

    &::-webkit-media-controls-panel {
      background-color: rgb(var(--v-theme-surface)) !important;
    }
  }
}

.v-table {
  th {
    &:nth-child(2) {
      width: 60%;
    }

    &:nth-child(1) {
      width: 25%;
    }

    &:nth-child(3) {
      width: 15%;
      text-align: center;
    }
  }
}
</style>
