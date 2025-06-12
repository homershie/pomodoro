<template>
  <svg
    version="1.1"
    class="DigitNumber"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    width="251.333px"
    height="380.004px"
    viewBox="0 0 251.333 380.004"
    enable-background="new 0 0 251.333 380.004"
    xml:space="preserve"
  >
    <rect
      class="digit-a"
      :class="{ active: '02356789'.includes(data) }"
      x="31.667"
      width="189"
      height="22"
      rx="5"
    />
    <rect
      class="digit-b"
      :class="{ active: '045689'.includes(data) }"
      y="22"
      width="21.333"
      height="157.001"
      rx="5"
    />
    <rect
      class="digit-c"
      :class="{ active: '01234789'.includes(data) }"
      x="230"
      y="22"
      width="21.332"
      height="157.001"
      rx="5"
    />
    <rect
      class="digit-d"
      :class="{ active: '2345689'.includes(data) }"
      x="31.667"
      y="179.001"
      width="189"
      height="22"
      rx="5"
    />
    <rect
      class="digit-e"
      :class="{ active: '0268'.includes(data) }"
      y="201.001"
      width="21.333"
      height="157.001"
      rx="5"
    />
    <rect
      class="digit-f"
      :class="{ active: '013456789'.includes(data) }"
      x="230"
      y="201.001"
      width="21.332"
      height="157.001"
      rx="5"
    />
    <rect
      class="digit-g"
      :class="{ active: '0235689'.includes(data) }"
      x="31.667"
      y="358.004"
      width="189"
      height="22"
      rx="5"
    />
    <circle :class="{ active: ':'.includes(data) }" cx="126.167" cy="100.5" r="22" />
    <circle :class="{ active: ':'.includes(data) }" cx="126.167" cy="279.502" r="22" />
  </svg>
</template>

<script setup>
defineProps({
  // 定義組件的屬性
  // 例如: color: String
  data: {
    type: String,
    default: '0', // 預設數字
  },
  color: {
    type: String,
    default: '#000000', // 預設顏色
  },
})
</script>

<style scoped lang="scss">
svg {
  margin: 5px;
  width: 100px;
  height: auto;
}
rect,
circle {
  fill: rgba(255, 255, 255, 0.05);
  &.active {
    // v-bind 把 CSS 值和 Vue 變數綁定
    // https://zh-hk.vuejs.org/api/sfc-css-features.html#v-bind-in-css
    fill: v-bind('color');
  }
}
</style>
