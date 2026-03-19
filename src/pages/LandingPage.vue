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

  // --- Particles ---
  const pGeo = new THREE.BufferGeometry()
  const count = 2000
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 120
    positions[i * 3 + 1] = (Math.random() - 0.5) * 80
    positions[i * 3 + 2] = (Math.random() - 0.5) * 60
    const t = Math.random()
    if (t < 0.5) { colors[i * 3] = 1; colors[i * 3 + 1] = 0; colors[i * 3 + 2] = 0.2 }
    else { colors[i * 3] = 0; colors[i * 3 + 1] = 0.75; colors[i * 3 + 2] = 1 }
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  const pMat = new THREE.PointsMaterial({ size: 0.15, vertexColors: true, transparent: true, opacity: 0.7 })
  particles = new THREE.Points(pGeo, pMat)
  scene.add(particles)

  // --- Robot ---
  robotGroup = new THREE.Group()
  const matRed = new THREE.MeshBasicMaterial({ color: 0xff0033, wireframe: true, transparent: true, opacity: 0.15 })
  const matBlue = new THREE.MeshBasicMaterial({ color: 0x00bfff, wireframe: true, transparent: true, opacity: 0.12 })

  // Body
  const body = new THREE.Mesh(new THREE.BoxGeometry(5, 6, 3), matRed)
  robotGroup.add(body)

  // Head
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
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(8 + i * 2, 0.05, 4, 64),
      new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0xff0033 : 0x00bfff,
        transparent: true,
        opacity: 0.15 - i * 0.03,
      })
    )
    ring.rotation.x = Math.PI / (3 + i)
    ring.rotation.y = Math.PI / (5 + i * 2)
    robotGroup.add(ring)
  }

  robotGroup.position.set(8, 8, 0)
  scene.add(robotGroup)

  // --- Grid ---
  const gridGeo = new THREE.PlaneGeometry(40, 40, 20, 20)
  const gridMat = new THREE.MeshBasicMaterial({ color: 0xff0033, wireframe: true, transparent: true, opacity: 0.04 })
  const grid = new THREE.Mesh(gridGeo, gridMat)
  grid.rotation.x = -Math.PI / 2
  grid.position.y = -12
  scene.add(grid)

  scene.add(new THREE.AmbientLight(0x111111))

  // --- Animate ---
  function animate() {
    animId = requestAnimationFrame(animate)
    const t = Date.now() * 0.001

    particles.rotation.y = t * 0.02
    particles.rotation.x = t * 0.01

    robotGroup.rotation.y = Math.sin(t * 0.4) * 0.3
    robotGroup.position.y = 8 + Math.sin(t * 0.5) * 1.5

    robotGroup.children.forEach((c, i) => {
      if (c.geometry?.type === 'TorusGeometry') {
        c.rotation.z = t * (0.3 + i * 0.1)
        c.rotation.x = t * (0.2 - i * 0.05)
      }
    })

    renderer.render(scene, camera)
  }

  animate()
  window.addEventListener('resize', onResize)
}

function onResize() {
  if (!renderer) return
  const W = window.innerWidth, H = window.innerHeight
  camera.aspect = W / H
  camera.updateProjectionMatrix()
  renderer.setSize(W, H)
}

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


<template>
  <!-- MAIN -->
  <div class="relative w-full min-h-screen overflow-hidden flex flex-col">

    <!-- BG -->
    <canvas ref="canvasRef" class="absolute inset-0 w-full h-full"></canvas>

    <div class="absolute inset-0 bg-gradient-to-b from-dark-900/20 via-transparent to-dark-900"></div>
    <div class="absolute inset-0 bg-gradient-to-r from-dark-900/60 via-transparent to-dark-900/40"></div>


    <!-- HERO -->
    <div class="relative z-10 flex-grow flex flex-col justify-center px-6 md:px-12 lg:px-20 pt-16">
      <div class="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-12">

        <!-- TEXT -->
        <div class="flex-1 max-w-xl">
          <div class="flex items-center gap-2 mb-4">
            <div class="w-8 h-px bg-red-500"></div>
            <span class="text-xs tracking-[0.3em] text-neon-red uppercase">
              Robotics Contest Platform
            </span>
          </div>
          <h1 class="text-5xl md:text-6xl xl:text-7xl font-black leading-none mb-4">
            <span class="block text-white">RMEDU</span>
            <span class="block uppercase" style="color:#ff0033; text-shadow:0 0 30px rgba(255,0,51,0.6)">
              Robotics Society
            </span>
          </h1>
          <div class="text-white/50 text-lg mb-4 max-w-md">
            The ultimate arena for robotics students.
          </div>
          <div class="text-white font-bold text-lg mb-8">
            Compete . Rank . Dominate.
          </div>
          <div class="flex gap-3 flex-wrap mb-6">
            <router-link to="/contests" class="btn-primary">
              Explore Contests
            </router-link>
            <router-link to="/register" class="btn-secondary">
              Join Now
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- CONTEST -->
    <div class="relative z-10 flex-1 px-6 md:px-12 lg:px-20 flex">

      <div
        class="max-w-7xl mx-auto w-full bg-dark-900/80 backdrop-blur-md rounded-lg p-4 flex flex-col overflow-hidden">
        <div class="mb-3 text-neon-red uppercase">
          Live & Open Contests
        </div>

        <!-- scroll -->
        <div class="flex-1 overflow-y-auto border border-red-700/50 rounded-lg p-3">
          <div v-if="loading" class="flex justify-center py-6">
            <LoadingSpinner />
          </div>
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div v-for="c in activeContests" :key="c.id" class="glass-card p-3 cursor-pointer"
              @click="handleContestClick(c)">
              <div class="flex justify-between mb-1">
                <StatusBadge :status="c.status" size="xs" />
                <span class="text-xs text-white/40">
                  {{ formatDate(c.contestDate) }}
                </span>
              </div>
              <h3 class="text-white text-sm truncate">
                {{ c.name }}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- FOOTER -->
    <div class="relative z-10 text-center py-1 text-xs text-white/40 mt-auto">
      © 2026 RoboContest Platform — All Rights Reserved
    </div>
  </div>
</template>