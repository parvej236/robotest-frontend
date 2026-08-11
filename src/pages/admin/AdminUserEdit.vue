<template>
  <div class="space-y-6">
    <!-- Breadcrumbs / Back button -->
    <div>
      <router-link to="/admin/users" class="text-sm font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-2 w-fit">
        <ArrowLeft class="w-4 h-4" /> Back to users list
      </router-link>
    </div>

    <!-- Loading Spinner -->
    <div v-if="loadingUser" class="glass-card p-20 flex justify-center items-center">
      <div class="text-center space-y-3">
        <Loader2 class="w-10 h-10 text-neon-blue animate-spin mx-auto" />
        <p class="text-sm text-slate-400">Fetching account details...</p>
      </div>
    </div>

    <!-- Form card -->
    <div v-else class="glass-card p-6 md:p-8">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        
        <!-- Section 1: Account Credentials -->
        <div>
          <h3 class="text-sm font-semibold text-neon-blue tracking-wider mb-4">1. Account credentials</h3>
          <div class="grid md:grid-cols-2 gap-5">
            <!-- Full Name -->
            <div>
              <label class="block text-sm font-semibold text-slate-350 mb-2">Full Name <span class="text-neon-red">*</span></label>
              <input 
                v-model="form.fullName" 
                type="text" 
                placeholder="Enter full name" 
                class="input-field" 
                :class="{'border-neon-red/50 focus:border-neon-red': valErrors.fullName}"
                required 
              />
              <p v-if="valErrors.fullName" class="text-xs text-neon-red mt-1">{{ valErrors.fullName }}</p>
            </div>

            <!-- Username (read only) -->
            <div>
              <label class="block text-sm font-semibold text-slate-350 mb-2">Username (read-only)</label>
              <input 
                v-model="form.username" 
                type="text" 
                class="input-field font-mono bg-slate-900/40 text-slate-455 border-white/5 cursor-not-allowed" 
                disabled 
              />
            </div>
          </div>
        </div>

        <!-- Section 2: Profile Details -->
        <div class="border-t border-white/5 pt-6">
          <h3 class="text-sm font-semibold text-neon-blue tracking-wider mb-4">2. Profile details</h3>
          <div class="grid md:grid-cols-2 gap-5">
            <!-- Gender -->
            <div>
              <label class="block text-sm font-semibold text-slate-350 mb-2">Gender</label>
              <select v-model="form.gender" class="input-field">
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <!-- University -->
            <div>
              <label class="block text-sm font-semibold text-slate-350 mb-2">University Name</label>
              <input v-model="form.university" type="text" placeholder="e.g. CUET" class="input-field" />
            </div>

            <!-- Registration Number -->
            <div>
              <label class="block text-sm font-semibold text-slate-350 mb-2">Registration Number</label>
              <input v-model="form.registrationNumber" type="text" placeholder="REG-XXXX" class="input-field font-mono" />
            </div>

            <!-- Roll Number -->
            <div>
              <label class="block text-sm font-semibold text-slate-350 mb-2">Roll Number</label>
              <input v-model="form.rollNumber" type="text" placeholder="ROLL-XXXX" class="input-field font-mono" />
            </div>

            <!-- Hobby -->
            <div class="md:col-span-2">
              <label class="block text-sm font-semibold text-slate-350 mb-2">Hobby</label>
              <input v-model="form.hobby" type="text" placeholder="e.g. Robotics, Coding" class="input-field" />
            </div>

            <!-- Bio -->
            <div class="md:col-span-2">
              <label class="block text-sm font-semibold text-slate-350 mb-2">Short Bio</label>
              <textarea v-model="form.bio" placeholder="Write a short summary about the user..." rows="3" class="input-field resize-none"></textarea>
            </div>
          </div>
        </div>

        <!-- Section 3: Permissions & Roles -->
        <div class="border-t border-white/5 pt-6">
          <h3 class="text-sm font-semibold text-neon-blue tracking-wider mb-4">3. Permissions & system status</h3>
          <div class="grid md:grid-cols-2 gap-5">
            <!-- Role -->
            <div>
              <label class="block text-sm font-semibold text-slate-350 mb-2">System Role</label>
              <select v-model="form.role" class="input-field">
                <option value="ROLE_USER">User (Participant)</option>
                <option value="ROLE_ADMIN">Admin (Superuser)</option>
                <option value="ROLE_JUDGE">Judge (Evaluator)</option>
                <option value="ROLE_MANAGER">Manager (Coordinator)</option>
              </select>
            </div>

            <!-- Checkboxes -->
            <div class="flex flex-col gap-3 justify-center">
              <label class="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" v-model="form.enabled" class="rounded border-slate-700 bg-slate-900 text-neon-blue focus:ring-neon-blue" />
                <span class="text-sm font-medium text-slate-300">Account Enabled</span>
              </label>
              <label class="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" v-model="form.emailVerified" class="rounded border-slate-700 bg-slate-900 text-neon-blue focus:ring-neon-blue" />
                <span class="text-sm font-medium text-slate-300">Email Address Verified</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Submit Footer -->
        <div class="border-t border-white/5 pt-6 flex items-center justify-end gap-3.5">
          <router-link to="/admin/users" class="btn-ghost normal-case text-xs py-2.5 px-5">Cancel</router-link>
          <button 
            type="submit" 
            :disabled="submitting" 
            class="btn-primary normal-case py-2.5 px-6 font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Loader2 v-if="submitting" class="w-4 h-4 animate-spin text-white" />
            <Save v-else class="w-4 h-4" />
            {{ submitting ? 'Saving Changes...' : 'Save Changes' }}
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/utils/api'
import { useToast } from '@/composables/useToast'
import { ArrowLeft, Save, Loader2 } from '@lucide/vue'

const router = useRouter()
const route = useRoute()
const toast = useToast()

const userId = route.params.id
const loadingUser = ref(true)
const submitting = ref(false)
const valErrors = ref({})

const form = ref({
  fullName: '',
  username: '',
  gender: '',
  university: '',
  registrationNumber: '',
  rollNumber: '',
  hobby: '',
  bio: '',
  role: 'ROLE_USER',
  enabled: true,
  emailVerified: true
})

async function fetchUser() {
  loadingUser.value = true
  try {
    const res = await api.get(`/users`)
    const user = res.data.find(u => String(u.id) === String(userId))
    if (!user) {
      toast.error('User not found')
      router.push('/admin/users')
      return
    }
    
    form.value = {
      fullName: user.fullName || '',
      username: user.username || '',
      gender: user.gender || '',
      university: user.university || '',
      registrationNumber: user.registrationNumber || '',
      rollNumber: user.rollNumber || '',
      hobby: user.hobby || '',
      bio: user.bio || '',
      role: user.roles?.includes('ROLE_ADMIN') ? 'ROLE_ADMIN' : 'ROLE_USER',
      enabled: user.enabled,
      emailVerified: user.emailVerified
    }
  } catch (e) {
    toast.error('Failed to load user details')
    router.push('/admin/users')
  } finally {
    loadingUser.value = false
  }
}

onMounted(() => {
  fetchUser()
})

// ── Validation ───────────────────────────────────────────────
function validate() {
  const errs = {}
  if (!form.value.fullName.trim()) errs.fullName = 'Full name is required'
  valErrors.value = errs
  return Object.keys(errs).length === 0
}

async function handleSubmit() {
  if (!validate()) {
    toast.error('Please fix validation errors.')
    return
  }

  submitting.value = true
  try {
    await api.put(`/users/${userId}`, {
      fullName: form.value.fullName.trim() || null,
      gender: form.value.gender || null,
      registrationNumber: form.value.registrationNumber.trim() || null,
      rollNumber: form.value.rollNumber.trim() || null,
      university: form.value.university.trim() || null,
      hobby: form.value.hobby.trim() || null,
      bio: form.value.bio.trim() || null,
      roles: [form.value.role],
      enabled: form.value.enabled,
      emailVerified: form.value.emailVerified
    })
    toast.success('User details updated successfully!')
    router.push('/admin/users')
  } catch (e) {
    const errorMsg = e.response?.data?.message || e.message || 'Failed to update user'
    toast.error(errorMsg)
  } finally {
    submitting.value = false
  }
}
</script>
