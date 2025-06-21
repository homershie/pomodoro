<template>
  <div class="time-container">
    <div class="time-display" ref="timeDisplayRef">
      <span
        v-for="(char, index) in timeChars"
        :key="`${char}-${index}`"
        :ref="(el) => setCharRef(el, index)"
        class="digit"
        :class="{ colon: char === ':' }"
      >
        {{ char }}
      </span>
    </div>

    <!-- 粒子容器 -->
    <div class="particles-container" ref="particlesContainer"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed, nextTick } from 'vue'
import { gsap } from 'gsap'
import { useTheme } from 'vuetify'

// 定義 props
const props = defineProps({
  time: {
    type: String,
    required: true,
    default: '00:00',
  },
})

const theme = useTheme()
const currentTime = ref('')
const previousTime = ref('')
const timeDisplayRef = ref(null)
const particlesContainer = ref(null)
const charRefs = ref([])

// 將時間字符串轉換為字符陣列
const timeChars = computed(() => {
  return currentTime.value.split('')
})

// 設定字符引用
const setCharRef = (el, index) => {
  if (el) {
    charRefs.value[index] = el
  }
}

// 監聽外部傳入的時間變化
watch(
  () => props.time,
  (newTime) => {
    if (newTime !== currentTime.value) {
      previousTime.value = currentTime.value
      currentTime.value = newTime
    }
  },
  { immediate: true }
)

// 時間由外部 props 提供，不再需要內部更新時間

// 找出變動的字符位置
const getChangedIndices = (oldTime, newTime) => {
  const oldChars = oldTime.split('')
  const newChars = newTime.split('')
  const changedIndices = []

  for (let i = 0; i < newChars.length; i++) {
    if (oldChars[i] !== newChars[i]) {
      changedIndices.push(i)
    }
  }

  return changedIndices
}

// 爆炸文字動畫效果（只針對變動的字符）
const playExplosionAnimation = async () => {
  if (!previousTime.value) return

  const changedIndices = getChangedIndices(previousTime.value, currentTime.value)
  if (changedIndices.length === 0) return

  // 只獲取變動的字符元素
  const changedDigits = changedIndices.map((index) => charRefs.value[index]).filter((el) => el)

  if (changedDigits.length === 0) return

  // 停止所有正在進行的動畫
  gsap.killTweensOf(changedDigits)

  // 為每個變化的數字創建粒子爆炸效果
  changedDigits.forEach((digit) => {
    createExplosionParticles(digit)
  })

  // 創建更流暢的動畫序列
  const tl = gsap.timeline()

  // 階段1：輕微放大並向上移動同時淡出
  tl.to(changedDigits, {
    scale: 2,
    opacity: 0.1,
    rotation: () => gsap.utils.random(-5, 5),
    duration: 0.25,
    ease: 'power1.out',
    stagger: {
      amount: 0.08,
      from: 'center',
    },
  })

    // 階段2：完全消失並重置到新位置
    .to(changedDigits, {
      opacity: 0,
      scale: 1,
      duration: 0.15,
      ease: 'power1.in',
    })

    // 階段3：立即重置到下方準備位置
    .set(changedDigits, {
      scale: 0.6,
      rotation: 0,
      opacity: 0,
    })

    // 階段4：彈性出現新數字
    .to(
      changedDigits,
      {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: 'back.out(1.5)',
        stagger: {
          amount: 0.12,
          from: 'center',
        },
      },
      '-=0.05'
    ) // 稍微重疊避免停頓感
}

// 創建爆炸粒子效果
const createExplosionParticles = (element) => {
  if (!particlesContainer.value) return

  const rect = element.getBoundingClientRect()
  const containerRect = particlesContainer.value.getBoundingClientRect()

  // 計算相對於粒子容器的位置
  const centerX = rect.left + rect.width / 2 - containerRect.left
  const centerY = rect.top + rect.height / 2 - containerRect.top

  // 創建 8-12 個粒子
  const particleCount = gsap.utils.random(8, 12, 1)
  const particles = []

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div')
    particle.className = 'particle'

    // 隨機粒子樣式
    const size = gsap.utils.random(3, 8)
    particle.style.width = `${size}px`
    particle.style.height = `${size}px`
    particle.style.left = `${centerX}px`
    particle.style.top = `${centerY}px`

    // 隨機顏色（基於 secondary 主題色彩）
    const secondaryColor = theme.current.value.colors.secondary
    const colors = [
      secondaryColor, // 主要 secondary 色
      `${secondaryColor}CC`, // secondary 色 80% 透明度
      `${secondaryColor}99`, // secondary 色 60% 透明度
      '#FF6B6B', // 珊瑚紅
      '#4ECDC4', // 青綠色
      '#45B7D1', // 天藍色
      '#FFA07A', // 淺鮭魚色
      '#98D8C8', // 薄荷綠
    ]
    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]

    particlesContainer.value.appendChild(particle)
    particles.push(particle)
  }

  // 粒子爆炸動畫
  particles.forEach((particle, index) => {
    const angle = (360 / particles.length) * index + gsap.utils.random(-30, 30)
    const distance = gsap.utils.random(60, 120)
    const endX = centerX + Math.cos((angle * Math.PI) / 180) * distance
    const endY = centerY + Math.sin((angle * Math.PI) / 180) * distance

    gsap
      .timeline()
      .set(particle, {
        scale: 0,
        opacity: 1,
      })
      .to(particle, {
        scale: 2,
        duration: 0.1,
        ease: 'power2.out',
      })
      .to(
        particle,
        {
          x: endX - centerX,
          y: endY - centerY,
          scale: gsap.utils.random(1, 2),
          opacity: 0,
          duration: gsap.utils.random(0.6, 1.2),
          ease: 'power2.out',
        },
        '-=0.05'
      )
      .call(() => {
        // 動畫完成後移除粒子
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle)
        }
      })
  })
}

// 監聽時間變化，觸發爆炸動畫
watch(currentTime, async () => {
  // 確保 DOM 更新後再執行動畫
  await nextTick()
  playExplosionAnimation()
})

onMounted(() => {
  // 初始動畫（所有字符）
  nextTick(() => {
    const digits = charRefs.value.filter((el) => el)
    if (digits.length > 0) {
      gsap.fromTo(
        digits,
        {
          opacity: 0,
          scale: 0.5,
        },
        {
          opacity: 1,
          scale: 1,
          stagger: 0.05,
          duration: 0.6,
          ease: 'back.out(1.7)',
        }
      )
    }
  })
})

onUnmounted(() => {
  // 清理 GSAP 動畫
  gsap.killTweensOf('.digit')
})
</script>

<style scoped lang="scss">
.time-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  padding: 20px;
}

.time-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.1em;
  font-family: 'Baloo Bhaijaan 2', sans-serif;
  font-weight: 900;

  .digit {
    display: inline-block;
    font-size: 10rem;
    background: linear-gradient(
      135deg,
      rgb(var(--v-theme-secondary)),
      rgba(var(--v-theme-secondary), 0.7)
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 2px 2px 4px rgba(var(--v-theme-secondary), 0.3);
    transform-origin: center;
    line-height: 1;

    // 冒號特殊樣式
    &.colon {
      color: rgb(var(--v-theme-secondary));
      -webkit-text-fill-color: rgb(var(--v-theme-secondary));
      animation: pulse 1s ease-in-out infinite alternate;
      line-height: 1.2; // 調高冒號的行高
      vertical-align: middle;
      font-weight: normal;
    }

    // 響應式設計
    @media (max-width: 768px) {
      font-size: 2.5rem;
    }

    @media (max-width: 480px) {
      font-size: 2rem;
    }
  }
}

// 冒號脈衝動畫
@keyframes pulse {
  from {
    opacity: 0.6;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1.05);
  }
}

// 增加一些粒子效果的視覺增強
.time-display::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(var(--v-theme-secondary), 0.1) 0%, transparent 70%);
  transform: translate(-50%, -50%);
  border-radius: 50%;
  pointer-events: none;
  z-index: -1;
}

// 粒子容器
.particles-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

// 粒子樣式
:deep(.particle) {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  z-index: 10;
  box-shadow: 0 0 6px rgba(var(--v-theme-secondary), 0.4),
    0 0 12px rgba(var(--v-theme-secondary), 0.2);

  // 增加一些粒子變化
  &:nth-child(odd) {
    border-radius: 2px;
  }

  &:nth-child(3n) {
    border-radius: 0;
    transform: rotate(45deg);
  }

  // 增加發光效果
  &:nth-child(4n) {
    box-shadow: 0 0 8px rgba(var(--v-theme-secondary), 0.6),
      0 0 16px rgba(var(--v-theme-secondary), 0.3);
  }
}
</style>
