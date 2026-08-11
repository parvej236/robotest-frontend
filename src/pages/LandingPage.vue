<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import * as THREE from 'three'
import { useContestStore } from '@/stores/contest'
import { useAuthStore } from '@/stores/auth'
import StatusBadge from '@/components/common/StatusBadge.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { format } from 'date-fns'
import { useHead } from '@vueuse/head'

useHead({
  title: 'RMEDU Robotics Society - Home',
  meta: [
    {
      name: 'description',
      content: 'Official platform for RMEDU robotics contests, CAD challenges, and student competitions.'
    }
  ]
})

const router = useRouter()
const auth = useAuthStore()
const contestStore = useContestStore()

const canvasRef = ref(null)
const activeContests = ref([])
const loading = ref(true)

let renderer, scene, camera, animId, particles, robotGroup

// ── Three.js ──────────────────────────────────────────────────
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
  const pos = new Float32Array(count * 3)
  const col = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 120
    pos[i * 3 + 1] = (Math.random() - 0.5) * 80
    pos[i * 3 + 2] = (Math.random() - 0.5) * 60
    const t = Math.random()
    if (t < 0.5) { col[i * 3] = 1; col[i * 3 + 1] = 0; col[i * 3 + 2] = 0.2 }
    else { col[i * 3] = 0; col[i * 3 + 1] = 0.75; col[i * 3 + 2] = 1 }
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  pGeo.setAttribute('color', new THREE.BufferAttribute(col, 3))
  particles = new THREE.Points(pGeo, new THREE.PointsMaterial({ size: 0.15, vertexColors: true, transparent: true, opacity: 0.7 }))
  scene.add(particles)

  // Robot
  robotGroup = new THREE.Group()
  const mR = new THREE.MeshBasicMaterial({ color: 0xff0033, wireframe: true, transparent: true, opacity: 0.15 })
  const mB = new THREE.MeshBasicMaterial({ color: 0x00bfff, wireframe: true, transparent: true, opacity: 0.12 })

  robotGroup.add(Object.assign(new THREE.Mesh(new THREE.BoxGeometry(5, 6, 3), mR)))
  const head = new THREE.Mesh(new THREE.BoxGeometry(3, 2.5, 2.5), mB); head.position.y = 4.5; robotGroup.add(head)
  const eL = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 8), new THREE.MeshBasicMaterial({ color: 0xff0033 })); eL.position.set(-0.6, 4.6, 1.3); robotGroup.add(eL)
  const eR = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 8), new THREE.MeshBasicMaterial({ color: 0x00ffff })); eR.position.set(0.6, 4.6, 1.3); robotGroup.add(eR)
  const aL = new THREE.Mesh(new THREE.BoxGeometry(1.2, 5, 1.2), mR); aL.position.set(-3.2, -0.5, 0); robotGroup.add(aL)
  const aR = new THREE.Mesh(new THREE.BoxGeometry(1.2, 5, 1.2), mB); aR.position.set(3.2, -0.5, 0); robotGroup.add(aR)
  const lL = new THREE.Mesh(new THREE.BoxGeometry(1.8, 4, 1.8), mB); lL.position.set(-1.3, -5.5, 0); robotGroup.add(lL)
  const lR = new THREE.Mesh(new THREE.BoxGeometry(1.8, 4, 1.8), mR); lR.position.set(1.3, -5.5, 0); robotGroup.add(lR)
  for (let i = 0; i < 3; i++) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(8 + i * 2, 0.05, 4, 64),
      new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0xff0033 : 0x00bfff, transparent: true, opacity: 0.15 - i * 0.03 }))
    ring.rotation.x = Math.PI / (3 + i); ring.rotation.y = Math.PI / (5 + i * 2)
    robotGroup.add(ring)
  }
  robotGroup.position.set(8, 8, 0)
  scene.add(robotGroup)

  // Grid
  const grid = new THREE.Mesh(new THREE.PlaneGeometry(40, 40, 20, 20),
    new THREE.MeshBasicMaterial({ color: 0xff0033, wireframe: true, transparent: true, opacity: 0.04 }))
  grid.rotation.x = -Math.PI / 2; grid.position.y = -12
  scene.add(grid)
  scene.add(new THREE.AmbientLight(0x111111))

  function animate() {
    animId = requestAnimationFrame(animate)
    const t = Date.now() * 0.001
    particles.rotation.y = t * 0.02; particles.rotation.x = t * 0.01
    robotGroup.rotation.y = Math.sin(t * 0.4) * 0.3
    robotGroup.position.y = 8 + Math.sin(t * 0.5) * 1.5
    robotGroup.children.forEach((c, i) => {
      if (c.geometry?.type === 'TorusGeometry') { c.rotation.z = t * (0.3 + i * 0.1); c.rotation.x = t * (0.2 - i * 0.05) }
    })
    renderer.render(scene, camera)
  }
  animate()
  window.addEventListener('resize', onResize)
}

function onResize() {
  if (!renderer) return
  const W = window.innerWidth, H = window.innerHeight
  camera.aspect = W / H; camera.updateProjectionMatrix(); renderer.setSize(W, H)
}

// ── Actions ───────────────────────────────────────────────────
function handleJoin(contest, e) {
  e.stopPropagation()
  if (!auth.isLoggedIn) { router.push('/login'); return }
  router.push(`/contests/${contest.id}/join`)
}
function handleRegister(contest, e) {
  e.stopPropagation()
  if (!auth.isLoggedIn) { router.push('/login'); return }
  router.push(`/contests/${contest.id}`)
}
function handleCard(contest) { router.push(`/contests/${contest.id}`) }

// ── Helpers ───────────────────────────────────────────────────
function formatDate(d) {
  if (!d) return 'TBD'
  try { return format(new Date(d), 'MMM dd, yyyy') } catch { return d }
}
function formatShort(d) {
  if (!d) return '—'
  try { return format(new Date(d), 'MMM dd hh:mm a') } catch { return d }
}
function contestEnd(c) {
  if (!c.contestEnd) return '—'
  try { return format(new Date(c.contestEnd), 'hh:mm a, MMM dd') } catch { return '—' }
}

// ── Mount ─────────────────────────────────────────────────────
onMounted(async () => {
  initThree()
  try {
    activeContests.value = await contestStore.fetchActiveContests()
  } catch (e) { console.error(e) }
  finally { loading.value = false }
})

onUnmounted(() => {
  cancelAnimationFrame(animId)
  renderer?.dispose()
  window.removeEventListener('resize', onResize)
})
</script>

<template>
  <div class="relative w-full min-h-screen overflow-hidden flex flex-col">

    <!-- Background canvas -->
    <canvas ref="canvasRef" class="absolute inset-0 w-full h-full"></canvas>
    <div class="absolute inset-0 bg-gradient-to-b from-dark-900/20 via-transparent to-dark-900"></div>
    <div class="absolute inset-0 bg-gradient-to-r from-dark-900/60 via-transparent to-dark-900/40"></div>

    <!-- ── HERO ───────────────────────────────────────────────── -->
    <div class="relative z-10 flex-grow flex flex-col justify-center px-6 md:px-12 lg:px-20 pt-16">
      <div class="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-12">
        <div class="flex-1 max-w-xl">
          <div class="flex items-center gap-2 mb-4">
            <div class="w-8 h-px bg-red-500"></div>
            <span class="text-xs tracking-[0.3em] text-neon-red uppercase">Robotics Contest Platform</span>
          </div>
          <h1 class="text-5xl md:text-6xl xl:text-7xl font-black leading-none mb-4">
            <span class="block text-white">RMEDU</span>
            <span class="block uppercase" style="color:#ff0033;text-shadow:0 0 30px rgba(255,0,51,0.6)">
              Robotics Society
            </span>
          </h1>
          <p class="text-white/50 text-lg mb-2 max-w-md">The ultimate arena for robotics students.</p>
          <p class="text-white font-bold text-lg mb-8">Compete . Rank . Dominate.</p>
          <div class="flex gap-3 flex-wrap">
            <router-link to="/contests" class="btn-primary">Explore Contests</router-link>
            <router-link to="/register" class="btn-secondary">Join Now</router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- ── CONTESTS SECTION ────────────────────────────────────── -->
    <div class="relative z-10 px-6 md:px-12 lg:px-20 pb-6">
      <div class="max-w-7xl mx-auto">

        <!-- Section header -->
        <div class="flex items-center justify-between mb-4 mt-5">
          <div class="flex items-center gap-3">
            <div class="w-1 h-6 bg-neon-red rounded-full"></div>
            <span class="font-display text-sm font-bold text-white uppercase tracking-widest">
              Live &amp; Open Contests
            </span>
            <!-- Live pulse indicator -->
            <div class="flex items-center gap-1.5">
              <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span class="text-[10px] text-green-400 font-mono">LIVE</span>
            </div>
          </div>
          <router-link to="/contests"
            class="text-xs font-display text-neon-blue hover:text-white transition-colors tracking-wider">
            View All →
          </router-link>
        </div>

        <!-- Contest cards grid -->
        <div class="bg-dark-900/70 backdrop-blur-md border border-neon-red/10 rounded-xl p-4">
          <div v-if="loading" class="flex justify-center py-8">
            <LoadingSpinner />
          </div>

          <div v-else-if="activeContests.length === 0" class="text-center py-10">
            <div class="text-5xl mb-3 animate-bounce">🤖</div>
            <p class="text-white/30 font-body text-sm ">No active contests right now</p>
            <router-link to="/contests" class="text-neon-blue text-xs mt-2 inline-block hover:underline">
              Browse all contests →
            </router-link>
          </div>

          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div v-for="c in activeContests" :key="c.id"
              class="relative group overflow-hidden rounded-3xl border border-white/10 bg-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.18)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20"
              @click="handleCard(c)">

              <div
                class="rounded-3xl border border-white/20 bg-green-200/1 backdrop-blur-9xl p-4 shadow-inner shadow-white/5">
                <div class="h-1 w-full rounded-full mb-3"
                  :class="c.status === 'RUNNING' ? 'bg-gradient-to-r from-emerald-400 to-sky-400' : 'bg-gradient-to-r from-sky-400 to-fuchsia-400'">
                </div>

                <div class="flex items-center justify-between gap-2 text-[12px] text-slate-300">
                  <StatusBadge :status="c.status" size="sm" />
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="rounded-full bg-white/10 px-2 py-1 text-[11px] text-slate-200 border border-white/10">
                      {{ c.registrationCount || 0 }} registered
                    </span>
                    <span class="rounded-full bg-white/10 px-2 py-1 text-[11px] text-slate-200 border border-white/10">
                      {{ formatShort(c.contestStart) }}
                    </span>
                  </div>
                </div>

                <h3
                  class="mt-3 text-base font-semibold text-white leading-tight line-clamp-2 group-hover:text-sky-300 transition">
                  {{ c.name }}
                </h3>
                <p v-if="c.description" class="mt-2 text-sm text-slate-400 line-clamp-2">
                  {{ c.description }}
                </p>

                <div class="mt-4 flex flex-wrap gap-2">
                  <button v-if="c.status === 'RUNNING'" @click="handleJoin(c, $event)"
                    class="flex-1 rounded-2xl bg-emerald-500/20 px-3 py-2 text-sm font-semibold text-emerald-100 shadow-sm shadow-emerald-500/10 transition hover:bg-emerald-500/30 hover:text-white">
                    Join
                  </button>
                  <button v-else-if="c.status === 'REGISTRATION_OPEN'" @click="handleRegister(c, $event)"
                    class="flex-1 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:from-sky-400 hover:to-blue-400">
                    Register
                  </button>
                  <button @click="handleCard(c)"
                    class="flex-1 rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-white/20 hover:text-white">
                    Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="relative z-10 text-center py-3 text-xs text-white/20 mt-auto">
      © 2026 RoboContest Platform — All Rights Reserved
    </div>
  </div>
</template>