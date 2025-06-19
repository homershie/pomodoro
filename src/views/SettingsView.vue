<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-center text-secondary">鈴聲設定</h1>
      </v-col>
      <v-col cols="12">
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
  </v-container>
</template>

<script setup>
import { useSettingsStore } from '@/stores/settings'

const settings = useSettingsStore()
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
