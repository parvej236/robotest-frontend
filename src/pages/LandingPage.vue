<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import * as THREE from 'three'
import { useContestStore } from '@/stores/contest'
import { useAuthStore } from '@/stores/auth'
import StatusBadge from '@/components/common/StatusBadge.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { format } from 'date-fns'

const router       = useRouter()
const auth         = useAuthStore()
const contestStore = useContestStore()

const canvasRef     = ref(null)
const activeContests = ref([])
const loading        = ref(true)

let renderer, scene, camera, animId, particles, robotGroup

// ── Three.js ──────────────────────────────────────────────────
function initThree() {
  const canvas = canvasRef.value
  const W = window.innerWidth, H = window.innerHeight
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setSize(W, H)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x000000, 0)

  scene  = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 1000)
  camera.position.set(0, 0, 30)

  // Particles
  const pGeo  = new THREE.BufferGeometry()
  const count = 2000
  const pos   = new Float32Array(count * 3)
  const col   = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    pos[i*3]   = (Math.random()-0.5)*120
    pos[i*3+1] = (Math.random()-0.5)*80
    pos[i*3+2] = (Math.random()-0.5)*60
    const t = Math.random()
    if (t < 0.5) { col[i*3]=1; col[i*3+1]=0; col[i*3+2]=0.2 }
    else          { col[i*3]=0; col[i*3+1]=0.75; col[i*3+2]=1 }
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  pGeo.setAttribute('color',    new THREE.BufferAttribute(col, 3))
  particles = new THREE.Points(pGeo, new THREE.PointsMaterial({ size:0.15, vertexColors:true, transparent:true, opacity:0.7 }))
  scene.add(particles)

  // Robot
  robotGroup = new THREE.Group()
  const mR = new THREE.MeshBasicMaterial({ color:0xff0033, wireframe:true, transparent:true, opacity:0.15 })
  const mB = new THREE.MeshBasicMaterial({ color:0x00bfff, wireframe:true, transparent:true, opacity:0.12 })

  robotGroup.add(Object.assign(new THREE.Mesh(new THREE.BoxGeometry(5,6,3), mR)))
  const head = new THREE.Mesh(new THREE.BoxGeometry(3,2.5,2.5), mB); head.position.y=4.5; robotGroup.add(head)
  const eL = new THREE.Mesh(new THREE.SphereGeometry(0.3,8,8), new THREE.MeshBasicMaterial({color:0xff0033})); eL.position.set(-0.6,4.6,1.3); robotGroup.add(eL)
  const eR = new THREE.Mesh(new THREE.SphereGeometry(0.3,8,8), new THREE.MeshBasicMaterial({color:0x00ffff})); eR.position.set( 0.6,4.6,1.3); robotGroup.add(eR)
  const aL = new THREE.Mesh(new THREE.BoxGeometry(1.2,5,1.2), mR); aL.position.set(-3.2,-0.5,0); robotGroup.add(aL)
  const aR = new THREE.Mesh(new THREE.BoxGeometry(1.2,5,1.2), mB); aR.position.set( 3.2,-0.5,0); robotGroup.add(aR)
  const lL = new THREE.Mesh(new THREE.BoxGeometry(1.8,4,1.8), mB); lL.position.set(-1.3,-5.5,0); robotGroup.add(lL)
  const lR = new THREE.Mesh(new THREE.BoxGeometry(1.8,4,1.8), mR); lR.position.set( 1.3,-5.5,0); robotGroup.add(lR)
  for (let i=0; i<3; i++) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(8+i*2,0.05,4,64),
      new THREE.MeshBasicMaterial({ color:i%2===0?0xff0033:0x00bfff, transparent:true, opacity:0.15-i*0.03 }))
    ring.rotation.x = Math.PI/(3+i); ring.rotation.y = Math.PI/(5+i*2)
    robotGroup.add(ring)
  }
  robotGroup.position.set(8, 8, 0)
  scene.add(robotGroup)

  // Grid
  const grid = new THREE.Mesh(new THREE.PlaneGeometry(40,40,20,20),
    new THREE.MeshBasicMaterial({ color:0xff0033, wireframe:true, transparent:true, opacity:0.04 }))
  grid.rotation.x = -Math.PI/2; grid.position.y = -12
  scene.add(grid)
  scene.add(new THREE.AmbientLight(0x111111))

  function animate() {
    animId = requestAnimationFrame(animate)
    const t = Date.now()*0.001
    particles.rotation.y = t*0.02; particles.rotation.x = t*0.01
    robotGroup.rotation.y = Math.sin(t*0.4)*0.3
    robotGroup.position.y = 8+Math.sin(t*0.5)*1.5
    robotGroup.children.forEach((c,i) => {
      if (c.geometry?.type==='TorusGeometry') { c.rotation.z=t*(0.3+i*0.1); c.rotation.x=t*(0.2-i*0.05) }
    })
    renderer.render(scene, camera)
  }
  animate()
  window.addEventListener('resize', onResize)
}

function onResize() {
  if (!renderer) return
  const W=window.innerWidth, H=window.innerHeight
  camera.aspect=W/H; camera.updateProjectionMatrix(); renderer.setSize(W,H)
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
  try { return format(new Date(d), 'MMM dd HH:mm') } catch { return d }
}
function contestEnd(c) {
  if (!c.contestEnd) return '—'
  try { return format(new Date(c.contestEnd), 'HH:mm, MMM dd') } catch { return '—' }
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
        <div class="flex items-center justify-between mb-4">
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
            <div class="text-3xl mb-3">🤖</div>
            <p class="text-white/30 font-body text-sm">No active contests right now</p>
            <router-link to="/contests" class="text-neon-blue text-xs mt-2 inline-block hover:underline">
              Browse all contests →
            </router-link>
          </div>

          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="c in activeContests" :key="c.id"
              class="relative group glass-card overflow-hidden cursor-pointer
                     hover:border-neon-red/30 transition-all duration-300"
              @click="handleCard(c)">

              <!-- Top status stripe -->
              <div class="h-0.5 w-full"
                   :style="c.status === 'RUNNING'
                     ? 'background: linear-gradient(90deg,#00ff88,#00bfff)'
                     : 'background: linear-gradient(90deg,#ff0033,#00bfff)'">
              </div>

              <div class="p-4">
                <!-- Status row -->
                <div class="flex items-center justify-between mb-3">
                  <StatusBadge :status="c.status" />
                  <span class="text-[10px] font-mono text-white/30">{{ formatDate(c.contestDate) }}</span>
                </div>

                <!-- Contest name -->
                <h3 class="font-display font-bold text-white text-sm leading-tight mb-1
                           line-clamp-2 group-hover:text-neon-red transition-colors">
                  {{ c.name }}
                </h3>

                <!-- Description -->
                <p v-if="c.description"
                   class="text-[11px] text-white/35 font-body line-clamp-2 mb-3 leading-relaxed">
                  {{ c.description }}
                </p>
                <div v-else class="mb-3"></div>

                <!-- Stats row -->
                <div class="flex items-center gap-3 mb-4">
                  <div class="flex items-center gap-1.5">
                    <svg class="w-3 h-3 text-neon-red/60" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                    </svg>
                    <span class="text-[10px] font-mono text-white/40">
                      {{ c.registrationCount || 0 }} registered
                    </span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <svg class="w-3 h-3 text-neon-blue/60" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 3L5 6.99h3V14h2V6.99h3L9 3zm7 14.01V10h-2v7.01h-3L15 21l4-3.99h-3z"/>
                    </svg>
                    <span class="text-[10px] font-mono text-white/40">
                      {{ c.questionCount ?? '—' }} questions
                    </span>
                  </div>
                </div>

                <!-- Timeline -->
                <div v-if="c.status === 'RUNNING'" class="mb-4">
                  <div class="flex items-center justify-between text-[10px] font-mono mb-1">
                    <span class="text-green-400/70">Ends at</span>
                    <span class="text-green-400">{{ contestEnd(c) }}</span>
                  </div>
                  <!-- Progress bar (visual only) -->
                  <div class="h-0.5 bg-dark-800 rounded-full overflow-hidden">
                    <div class="h-full bg-gradient-to-r from-green-500 to-neon-blue rounded-full animate-pulse"
                         style="width: 60%"></div>
                  </div>
                </div>

                <div v-else class="mb-4">
                  <div class="flex items-center justify-between text-[10px] font-mono">
                    <span class="text-white/25">Reg closes</span>
                    <span class="text-neon-blue/60">{{ formatShort(c.registrationEnd) }}</span>
                  </div>
                  <div class="flex items-center justify-between text-[10px] font-mono mt-0.5">
                    <span class="text-white/25">Contest starts</span>
                    <span class="text-white/50">{{ formatShort(c.contestStart) }}</span>
                  </div>
                </div>

                <!-- Action buttons -->
                <div class="flex gap-2">
                  <!-- RUNNING → Join Now button -->
                  <button
                    v-if="c.status === 'RUNNING'"
                    @click="handleJoin(c, $event)"
                    class="flex-1 flex items-center justify-center gap-1.5
                           bg-green-500/20 border border-green-500/40 text-green-400
                           hover:bg-green-500/30 hover:border-green-400
                           font-display text-xs py-2 rounded transition-all">
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    Join Contest
                  </button>

                  <!-- REGISTRATION_OPEN → Register button -->
                  <button
                    v-else-if="c.status === 'REGISTRATION_OPEN'"
                    @click="handleRegister(c, $event)"
                    class="flex-1 flex items-center justify-center gap-1.5
                           bg-neon-blue/10 border border-neon-blue/30 text-neon-blue
                           hover:bg-neon-blue/20 hover:border-neon-blue/60
                           font-display text-xs py-2 rounded transition-all">
                    <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                    </svg>
                    Register
                  </button>

                  <!-- View details link (always) -->
                  <button
                    @click="handleCard(c)"
                    :class="[
                      'font-display text-xs py-2 px-3 rounded border transition-all',
                      c.status === 'RUNNING' || c.status === 'REGISTRATION_OPEN'
                        ? 'border-white/10 text-white/40 hover:text-white hover:border-white/20'
                        : 'flex-1 border-white/10 text-white/50 hover:border-white/20 hover:text-white'
                    ]">
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