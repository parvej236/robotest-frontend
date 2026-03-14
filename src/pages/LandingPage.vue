<template>
  <div class="relative w-full h-screen overflow-hidden flex flex-col">
    <!-- Three.js Canvas -->
    <canvas ref="canvasRef" class="absolute inset-0 w-full h-full"></canvas>

    <!-- Overlay gradients -->
    <div class="absolute inset-0 bg-gradient-to-b from-dark-900/20 via-transparent to-dark-900"></div>
    <div class="absolute inset-0 bg-gradient-to-r from-dark-900/60 via-transparent to-dark-900/40"></div>

    <!-- Main Content (flex: 1 to take full height minus contests) -->
    <div class="relative z-10 flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-20 pt-16">
      <div class="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-12">
        <!-- Hero Text -->
        <div class="flex-1 max-w-xl">
          <div class="flex items-center gap-2 mb-4">
            <div class="w-8 h-px bg-neon-red"></div>
            <span class="text-xs font-display tracking-[0.3em] text-neon-red uppercase">
              Robotics Contest Platform
            </span>
          </div>

          <h1 class="font-display text-5xl md:text-6xl xl:text-7xl font-black leading-none mb-4">
            <span class="block text-white">ROBO</span>
            <span class="block" style="color:#ff0033; text-shadow:0 0 30px rgba(255,0,51,0.6)">
              CONTEST
            </span>
          </h1>

          <div class="text-white/50 font-body text-lg max-w-md leading-relaxed mb-4">
            The ultimate arena for robotics engineers.
          </div>

          <div class="text-white font-body font-bold text-lg mb-8 max-w-md leading-relaxed">
            Compete. Rank. Dominate.
          </div>

          <div class="flex gap-3 flex-wrap mb-10">
            <router-link to="/contests" class="btn-primary">Explore Contests</router-link>
            <router-link to="/register" class="btn-secondary">Join Now</router-link>
          </div>

          <!-- Stats -->
          <div class="flex gap-8 mt-10 pt-8 border-t border-white/5">
            <div v-for="stat in stats" :key="stat.label">
              <div class="font-display text-2xl font-black glow-text-red">{{ stat.value }}</div>
              <div class="text-xs font-body text-white/40 uppercase">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Live Contests Section -->
    <div class="relative z-10 w-full bg-dark-900/80 backdrop-blur-md py-4 px-6 md:px-12 lg:px-20 flex-shrink-0">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="flex items-center gap-3 mb-4">
          <div class="w-3 h-3 bg-neon-red rounded-full animate-pulse"></div>
          <span class="text-sm md:text-xs font-display text-neon-red uppercase tracking-wider">
            Live & Open Contests
          </span>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="flex justify-center py-6">
          <LoadingSpinner label="Loading contests..." />
        </div>

        <!-- Empty State -->
        <div v-else-if="activeContests.length === 0" class="glass-card p-4 text-center neon-border-red">
          <div class="text-3xl mb-2 animate-bounce">🤖</div>
          <p class="text-white/50 font-body text-sm">No active contests at the moment.</p>
        </div>

        <!-- Active Contests (fit max 1 row each) -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[160px] overflow-hidden">
          <div v-for="(contest, i) in activeContests" :key="contest.id"
               class="glass-card p-3 neon-border-red hover:shadow-neon-red/30 transition-all duration-300 cursor-pointer group"
               :style="`animation-delay: ${i * 0.05}s`" @click="handleContestClick(contest)">
            <div class="flex items-center justify-between mb-1">
              <StatusBadge :status="contest.status" size="xs" />
              <span class="text-xs text-white/40 font-mono">{{ formatDate(contest.contestDate) }}</span>
            </div>
            <h3 class="font-display font-bold text-sm text-white group-hover:text-neon-red truncate">{{ contest.name }}</h3>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="relative z-10 w-full text-center py-1 text-xs text-white/40">
      © 2026 RoboContest Platform — All Rights Reserved
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import * as THREE from 'three'
import { useContestStore } from '@/stores/contest'
import { useAuthStore } from '@/stores/auth'
import StatusBadge from '@/components/common/StatusBadge.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { format } from 'date-fns'

const router = useRouter()
const auth = useAuthStore()
const contestStore = useContestStore()

const canvasRef = ref(null)
const activeContests = ref([])
const loading = ref(true)
const stats = [
  { value: '10+', label: 'Contests' },
  { value: '50+', label: 'Participants' },
  { value: '24/7', label: 'Live Arena' },
]

let renderer, scene, camera, animId
let particles, robotGroup

// --- Three.js Initialization ---
function initThree() {
  const canvas = canvasRef.value
  const W = window.innerWidth, H = window.innerHeight
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setSize(W, H)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x000000, 0)
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 1000)
  camera.position.set(0, 0, 30)

  // Particles
  const pGeo = new THREE.BufferGeometry()
  const count = 2000
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 120
    positions[i * 3 + 1] = (Math.random() - 0.5) * 80
    positions[i * 3 + 2] = (Math.random() - 0.5) * 60
    const t = Math.random()
    if (t < 0.5) { colors[i * 3] = 1; colors[i * 3 + 1] = 0; colors[i * 3 + 2] = 0.2; }
    else { colors[i * 3] = 0; colors[i * 3 + 1] = 0.75; colors[i * 3 + 2] = 1; }
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  const pMat = new THREE.PointsMaterial({ size: 0.15, vertexColors: true, transparent: true, opacity: 0.7 })
  particles = new THREE.Points(pGeo, pMat)
  scene.add(particles)

  // Robot Group
  robotGroup = new THREE.Group()
  robotGroup.position.set(8, 0, 0)
  const matRed = new THREE.MeshBasicMaterial({ color: 0xff0033, wireframe: true, transparent: true, opacity: 0.15 })
  const matBlue = new THREE.MeshBasicMaterial({ color: 0x00bfff, wireframe: true, transparent: true, opacity: 0.12 })

  const body = new THREE.Mesh(new THREE.BoxGeometry(5, 6, 3), matRed)
  robotGroup.add(body)
  const head = new THREE.Mesh(new THREE.BoxGeometry(3, 2.5, 2.5), matBlue)
  head.position.y = 4.5
  robotGroup.add(head)

  // Eyes
  const eyeGeo = new THREE.SphereGeometry(0.3, 8, 8)
  const eyeL = new THREE.Mesh(eyeGeo, new THREE.MeshBasicMaterial({ color: 0xff0033 }))
  const eyeR = new THREE.Mesh(eyeGeo, new THREE.MeshBasicMaterial({ color: 0x00ffff }))
  eyeL.position.set(-0.6, 4.6, 1.3)
  eyeR.position.set(0.6, 4.6, 1.3)
  robotGroup.add(eyeL, eyeR)

  // Arms
  const armGeo = new THREE.BoxGeometry(1.2, 5, 1.2)
  const armL = new THREE.Mesh(armGeo, matRed)
  const armR = new THREE.Mesh(armGeo, matBlue)
  armL.position.set(-3.2, -0.5, 0)
  armR.position.set(3.2, -0.5, 0)
  robotGroup.add(armL, armR)

  // Legs
  const legGeo = new THREE.BoxGeometry(1.8, 4, 1.8)
  const legL = new THREE.Mesh(legGeo, matBlue)
  const legR = new THREE.Mesh(legGeo, matRed)
  legL.position.set(-1.3, -5.5, 0)
  legR.position.set(1.3, -5.5, 0)
  robotGroup.add(legL, legR)

  // Rings
  for (let i = 0; i < 3; i++) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(8 + i * 2, 0.05, 4, 64), new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0xff0033 : 0x00bfff, transparent: true, opacity: 0.15 - i * 0.03 }))
    ring.rotation.x = Math.PI / (3 + i)
    ring.rotation.y = Math.PI / (5 + i * 2)
    robotGroup.add(ring)
  }

  // Grid
  const gridGeo = new THREE.PlaneGeometry(40, 40, 20, 20)
  const gridMat = new THREE.MeshBasicMaterial({ color: 0xff0033, wireframe: true, transparent: true, opacity: 0.04 })
  const grid = new THREE.Mesh(gridGeo, gridMat)
  grid.rotation.x = -Math.PI / 2
  grid.position.y = -12
  scene.add(grid)

  scene.add(robotGroup)
  scene.add(new THREE.AmbientLight(0x111111))

  function animate() {
    animId = requestAnimationFrame(animate)
    const t = Date.now() * 0.001
    particles.rotation.y = t * 0.02
    particles.rotation.x = t * 0.01
    robotGroup.rotation.y = Math.sin(t * 0.4) * 0.3
    robotGroup.position.y = Math.sin(t * 0.5) * 1.5
    robotGroup.children.forEach((c, i) => { if (c.geometry?.type === 'TorusGeometry') { c.rotation.z = t * (0.3 + i * 0.1); c.rotation.x = t * (0.2 - i * 0.05) } })
    renderer.render(scene, camera)
  }
  animate()
  window.addEventListener('resize', onResize)
}

function onResize() { if (!renderer) return; const W = window.innerWidth, H = window.innerHeight; camera.aspect = W / H; camera.updateProjectionMatrix(); renderer.setSize(W, H) }

function handleContestClick(contest) { router.push(`/contests/${contest.id}`) }
function handleRegister(contest) { if (!auth.isLoggedIn) { router.push('/login'); return } router.push(`/contests/${contest.id}`) }
function handleJoin(contest) { if (!auth.isLoggedIn) { router.push('/login'); return } router.push(`/contests/${contest.id}/join`) }
function formatDate(d) { if (!d) return 'TBD'; try { return format(new Date(d), 'MMM dd, yyyy') } catch { return d } }

onMounted(async () => {
  initThree()
  try { activeContests.value = await contestStore.fetchActiveContests() } catch (e) { console.error(e) } finally { loading.value = false }
})

onUnmounted(() => {
  cancelAnimationFrame(animId)
  renderer?.dispose()
  window.removeEventListener('resize', onResize)
})
</script>

<style scoped>
.custom-scroll::-webkit-scrollbar {
  width: 2px;
}

.custom-scroll::-webkit-scrollbar-thumb {
  background: #ff003344;
  border-radius: 1px;
}
</style>