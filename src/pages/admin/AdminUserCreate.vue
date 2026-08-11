<template>
  <div class="space-y-6">
    <!-- Breadcrumbs / Back button -->
    <div>
      <router-link to="/admin/users" class="text-sm font-semibold text-slate-400 hover:text-white transition-colors inline-flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5">
        <ArrowLeft class="w-4 h-4" /> Back to users list
      </router-link>
    </div>

    <!-- Form layout -->
    <form @submit.prevent="handleSubmit" class="space-y-6">
      
      <!-- Section 1: Account Credentials -->
      <div class="glass-card p-6 md:p-8 grid md:grid-cols-3 gap-6">
        <div class="md:col-span-1 space-y-2">
          <div class="flex items-center gap-2 text-neon-blue">
            <Lock class="w-5 h-5" />
            <h3 class="text-base font-bold tracking-wide">Account credentials</h3>
          </div>
          <p class="text-xs text-slate-400 leading-relaxed">Essential security and identification details. Usernames and email addresses must be unique in the system.</p>
        </div>

        <div class="md:col-span-2 grid sm:grid-cols-2 gap-5">
          <!-- Full Name -->
          <div class="relative group">
            <label class="block text-xs font-semibold text-slate-400 mb-1.5 group-focus-within:text-neon-blue transition-colors">Full Name <span class="text-neon-red">*</span></label>
            <div class="relative flex items-center">
              <User class="absolute left-3.5 w-4 h-4 text-slate-500 group-focus-within:text-neon-blue transition-colors pointer-events-none" />
              <input 
                v-model="form.fullName" 
                type="text" 
                placeholder="John Doe" 
                class="input-field pl-10.5 w-full" 
                :class="{'border-neon-red/50 focus:border-neon-red': valErrors.fullName}"
                required 
              />
            </div>
            <p v-if="valErrors.fullName" class="text-xs text-neon-red mt-1">{{ valErrors.fullName }}</p>
          </div>

          <!-- Username -->
          <div class="relative group">
            <label class="block text-xs font-semibold text-slate-400 mb-1.5 group-focus-within:text-neon-blue transition-colors">Username <span class="text-neon-red">*</span></label>
            <div class="relative flex items-center">
              <AtSign class="absolute left-3.5 w-4 h-4 text-slate-500 group-focus-within:text-neon-blue transition-colors pointer-events-none" />
              <input 
                v-model="form.username" 
                type="text" 
                placeholder="johndoe" 
                class="input-field pl-10.5 w-full font-mono" 
                :class="{'border-neon-red/50 focus:border-neon-red': valErrors.username}"
                required 
              />
            </div>
            <p v-if="valErrors.username" class="text-xs text-neon-red mt-1">{{ valErrors.username }}</p>
          </div>

          <!-- Email -->
          <div class="relative group">
            <label class="block text-xs font-semibold text-slate-400 mb-1.5 group-focus-within:text-neon-blue transition-colors">Email Address <span class="text-neon-red">*</span></label>
            <div class="relative flex items-center">
              <Mail class="absolute left-3.5 w-4 h-4 text-slate-500 group-focus-within:text-neon-blue transition-colors pointer-events-none" />
              <input 
                v-model="form.email" 
                type="email" 
                placeholder="john@example.com" 
                class="input-field pl-10.5 w-full font-mono" 
                :class="{'border-neon-red/50 focus:border-neon-red': valErrors.email}"
                required 
              />
            </div>
            <p v-if="valErrors.email" class="text-xs text-neon-red mt-1">{{ valErrors.email }}</p>
          </div>

          <!-- Password -->
          <div class="relative group">
            <label class="block text-xs font-semibold text-slate-400 mb-1.5 group-focus-within:text-neon-blue transition-colors">Password <span class="text-neon-red">*</span></label>
            <div class="relative flex items-center">
              <Lock class="absolute left-3.5 w-4 h-4 text-slate-500 group-focus-within:text-neon-blue transition-colors pointer-events-none" />
              <input 
                v-model="form.password" 
                type="password" 
                placeholder="••••••••" 
                class="input-field pl-10.5 w-full font-mono" 
                :class="{'border-neon-red/50 focus:border-neon-red': valErrors.password}"
                required 
                minlength="6"
              />
            </div>
            <p v-if="valErrors.password" class="text-xs text-neon-red mt-1">{{ valErrors.password }}</p>
          </div>
        </div>
      </div>

      <!-- Section 2: Profile Details -->
      <div class="glass-card p-6 md:p-8 grid md:grid-cols-3 gap-6">
        <div class="md:col-span-1 space-y-2">
          <div class="flex items-center gap-2 text-neon-blue">
            <User class="w-5 h-5" />
            <h3 class="text-base font-bold tracking-wide">Profile details</h3>
          </div>
          <p class="text-xs text-slate-400 leading-relaxed">Additional details about the user's educational affiliation, bio, and background info.</p>
        </div>

        <div class="md:col-span-2 grid sm:grid-cols-2 gap-5">
          <!-- Gender -->
          <div class="relative group">
            <label class="block text-xs font-semibold text-slate-400 mb-1.5 group-focus-within:text-neon-blue transition-colors">Gender</label>
            <div class="relative flex items-center">
              <Tag class="absolute left-3.5 w-4 h-4 text-slate-500 group-focus-within:text-neon-blue pointer-events-none" />
              <select v-model="form.gender" class="input-field pl-10.5 pr-8 w-full appearance-none cursor-pointer">
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <div class="pointer-events-none absolute right-3 text-slate-500">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>
          </div>

          <!-- University -->
          <div class="relative group">
            <label class="block text-xs font-semibold text-slate-400 mb-1.5 group-focus-within:text-neon-blue transition-colors">University Name</label>
            <div class="relative flex items-center">
              <BookOpen class="absolute left-3.5 w-4 h-4 text-slate-500 group-focus-within:text-neon-blue pointer-events-none" />
              <input v-model="form.university" type="text" placeholder="CUET" class="input-field pl-10.5 w-full" />
            </div>
          </div>

          <!-- Registration Number -->
          <div class="relative group">
            <label class="block text-xs font-semibold text-slate-400 mb-1.5 group-focus-within:text-neon-blue transition-colors">Registration Number</label>
            <div class="relative flex items-center">
              <Hash class="absolute left-3.5 w-4 h-4 text-slate-500 group-focus-within:text-neon-blue pointer-events-none" />
              <input v-model="form.registrationNumber" type="text" placeholder="REG-2018331" class="input-field pl-10.5 w-full font-mono" />
            </div>
          </div>

          <!-- Roll Number -->
          <div class="relative group">
            <label class="block text-xs font-semibold text-slate-400 mb-1.5 group-focus-within:text-neon-blue transition-colors">Roll Number</label>
            <div class="relative flex items-center">
              <Hash class="absolute left-3.5 w-4 h-4 text-slate-500 group-focus-within:text-neon-blue pointer-events-none" />
              <input v-model="form.rollNumber" type="text" placeholder="1804100" class="input-field pl-10.5 w-full font-mono" />
            </div>
          </div>

          <!-- Bio -->
          <div class="sm:col-span-2 relative group">
            <label class="block text-xs font-semibold text-slate-400 mb-1.5 group-focus-within:text-neon-blue transition-colors">Short Bio</label>
            <div class="relative flex items-start">
              <FileText class="absolute left-3.5 top-3 w-4 h-4 text-slate-500 group-focus-within:text-neon-blue pointer-events-none" />
              <textarea v-model="form.bio" placeholder="Write a short summary about the user..." rows="3" class="input-field pl-10.5 w-full resize-none"></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 3: Permissions & Roles -->
      <div class="glass-card p-6 md:p-8 grid md:grid-cols-3 gap-6">
        <div class="md:col-span-1 space-y-2">
          <div class="flex items-center gap-2 text-neon-blue">
            <Shield class="w-5 h-5" />
            <h3 class="text-base font-bold tracking-wide">Permissions & system status</h3>
          </div>
          <p class="text-xs text-slate-400 leading-relaxed">Define system roles and controls to manage feature permissions and access levels.</p>
        </div>

        <div class="md:col-span-2 grid sm:grid-cols-2 gap-5">
          <!-- Role -->
          <div class="relative group justify-center flex flex-col">
            <label class="block text-xs font-semibold text-slate-400 mb-1.5 group-focus-within:text-neon-blue transition-colors">System Role</label>
            <div class="relative flex items-center">
              <Shield class="absolute left-3.5 w-4 h-4 text-slate-500 group-focus-within:text-neon-blue pointer-events-none" />
              <select v-model="form.role" class="input-field pl-10.5 pr-8 w-full appearance-none cursor-pointer">
                <option value="ROLE_USER">User (Participant)</option>
                <option value="ROLE_ADMIN">Admin (Superuser)</option>
                <option value="ROLE_JUDGE">Judge (Evaluator)</option>
                <option value="ROLE_MANAGER">Manager (Coordinator)</option>
              </select>
              <div class="pointer-events-none absolute right-3 text-slate-500">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Switches -->
          <div class="flex flex-col gap-3 justify-center">
            <!-- Account Enabled -->
            <label class="relative flex items-center gap-3 cursor-pointer group p-3.5 rounded-xl border border-white/5 bg-slate-950/40 hover:bg-slate-900/60 transition-all select-none">
              <input type="checkbox" v-model="form.enabled" class="peer sr-only" />
              <div class="w-9 h-5 bg-slate-800 rounded-full peer peer-checked:bg-neon-blue/80 relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4 peer-checked:after:bg-white"></div>
              <div>
                <p class="text-sm font-semibold text-slate-350 peer-checked:text-white">Account Enabled</p>
                <p class="text-[11px] text-slate-500">Allow this user to sign in and participate.</p>
              </div>
            </label>

            <!-- Email Verified -->
            <label class="relative flex items-center gap-3 cursor-pointer group p-3.5 rounded-xl border border-white/5 bg-slate-950/40 hover:bg-slate-900/60 transition-all select-none">
              <input type="checkbox" v-model="form.emailVerified" class="peer sr-only" />
              <div class="w-9 h-5 bg-slate-800 rounded-full peer peer-checked:bg-neon-blue/80 relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4 peer-checked:after:bg-white"></div>
              <div>
                <p class="text-sm font-semibold text-slate-350 peer-checked:text-white">Email Verified</p>
                <p class="text-[11px] text-slate-500">Bypass the email verification requirements.</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      <!-- Action Footer -->
      <div class="flex items-center justify-end gap-3.5">
        <router-link to="/admin/users" class="btn-ghost normal-case text-xs py-2.5 px-5">Cancel</router-link>
        <button 
          type="submit" 
          :disabled="submitting" 
          class="btn-primary normal-case py-2.5 px-6 font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Loader2 v-if="submitting" class="w-4 h-4 animate-spin text-white" />
          <UserPlus v-else class="w-4 h-4" />
          {{ submitting ? 'Creating...' : 'Create Account' }}
        </button>
      </div>

    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/utils/api'
import { useToast } from '@/composables/useToast'
import { ArrowLeft, UserPlus, Loader2, Lock, User, AtSign, Mail, Tag, BookOpen, Hash, FileText, Shield } from '@lucide/vue'

const router = useRouter()
const toast = useToast()

const form = ref({
  fullName: '',
  username: '',
  email: '',
  password: '',
  gender: '',
  university: '',
  registrationNumber: '',
  rollNumber: '',
  bio: '',
  role: 'ROLE_USER',
  enabled: true,
  emailVerified: true
})

const valErrors = ref({})
const submitting = ref(false)

function validate() {
  const errs = {}
  if (!form.value.fullName.trim()) errs.fullName = 'Full name is required'
  
  const username = form.value.username.trim()
  if (!username) {
    errs.username = 'Username is required'
  } else if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    errs.username = 'Username must be alphanumeric, containing only dashes or underscores'
  }

  const email = form.value.email.trim()
  if (!email) {
    errs.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errs.email = 'Invalid email address format'
  }

  const password = form.value.password
  if (!password) {
    errs.password = 'Password is required'
  } else if (password.length < 6) {
    errs.password = 'Password must be at least 6 characters'
  }

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
    await api.post('/users', {
      fullName: form.value.fullName.trim(),
      username: form.value.username.trim(),
      email: form.value.email.trim(),
      password: form.value.password,
      gender: form.value.gender || null,
      university: form.value.university.trim() || null,
      registrationNumber: form.value.registrationNumber.trim() || null,
      rollNumber: form.value.rollNumber.trim() || null,
      bio: form.value.bio.trim() || null,
      roles: [form.value.role],
      enabled: form.value.enabled,
      emailVerified: form.value.emailVerified
    })
    toast.success('User account created successfully!')
    router.push('/admin/users')
  } catch (e) {
    const errorMsg = e.response?.data?.message || e.message || 'Failed to create user'
    toast.error(errorMsg)
  } finally {
    submitting.value = false
  }
}
</script>
