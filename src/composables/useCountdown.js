import { ref, onMounted, onUnmounted } from 'vue'

export function useCountdown(targetDate) {
  const timeLeft = ref({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const expired = ref(false)
  let interval = null

  function update() {
    const now = new Date().getTime()
    const target = new Date(targetDate).getTime()
    const diff = target - now
    if (diff <= 0) {
      expired.value = true
      timeLeft.value = { days: 0, hours: 0, minutes: 0, seconds: 0 }
      clearInterval(interval)
      return
    }
    timeLeft.value = {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000)
    }
  }

  onMounted(() => { update(); interval = setInterval(update, 1000) })
  onUnmounted(() => clearInterval(interval))
  return { timeLeft, expired }
}
