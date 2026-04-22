<!-- src/pages/admin/AdminContests.vue -->
<template>
  <div class="min-h-screen pt-20 px-4 pb-12">
    <div class="max-w-7xl mx-auto">

      <div class="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div class="absolute -top-48 -left-48 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[120px]"></div>
        <div class="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]"></div>
      </div>

      <!-- Header -->
      <div class="mb-6 space-y-4">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <div class="w-4 h-px bg-rose-500"></div>
            <span class="text-xs font-display tracking-widest text-rose-300 uppercase">Admin</span>
          </div>
          <h1 class="font-display text-2xl font-black text-white uppercase tracking-wider">Manage Contests</h1>
        </div>

        <!-- filters management -->
        <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div class="min-w-0 flex-1">
            <label for="contest-search" class="sr-only">Search contests</label>
            <div
              class="relative rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 shadow-sm focus-within:border-sky-500/50">
              <svg class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input id="contest-search" v-model="searchQuery" type="search"
                class="w-full rounded-3xl bg-transparent pl-11 pr-4 text-sm text-slate-100 placeholder:text-slate-500 outline-none"
                placeholder="Search contests by name or description..." />
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-3 lg:justify-end">
            <div class="flex flex-wrap gap-3 items-center">
              <div
                class="relative w-full max-w-[18rem] rounded-3xl border border-slate-700 bg-slate-950/80 px-3 py-2 shadow-sm">
                <label for="status-filter" class="sr-only">Filter by status</label>
                <select id="status-filter" v-model="statusFilter"
                  class="w-full bg-slate-950/90 text-sm text-slate-100 outline-none appearance-none accent-sky-400 focus:text-white focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500">
                  <option class="bg-slate-950 text-slate-100" value="ALL">All Statuses</option>
                  <option class="bg-slate-950 text-slate-100" value="UPCOMING">Upcoming</option>
                  <option class="bg-slate-950 text-slate-100" value="REGISTRATION_OPEN">Registration Open</option>
                  <option class="bg-slate-950 text-slate-100" value="RUNNING">Running</option>
                  <option class="bg-slate-950 text-slate-100" value="FINISHED">Finished</option>
                </select>
                <div class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>
              <div
                class="relative w-full max-w-[18rem] rounded-3xl border border-slate-700 bg-slate-950/80 px-3 py-2 shadow-sm">
                <label for="sort-option" class="sr-only">Sort contests</label>
                <select id="sort-option" v-model="sortOption"
                  class="w-full bg-slate-950/90 text-sm text-slate-100 outline-none appearance-none accent-sky-400 focus:text-white focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500">
                  <option class="bg-slate-950 text-slate-100" value="createdDesc">Created: Newest</option>
                  <option class="bg-slate-950 text-slate-100" value="createdAsc">Created: Oldest</option>
                  <option class="bg-slate-950 text-slate-100" value="contestDesc">Contest Date: Latest</option>
                  <option class="bg-slate-950 text-slate-100" value="contestAsc">Contest Date: Earliest</option>
                  <option class="bg-slate-950 text-slate-100" value="registeredDesc">Registered: High to Low</option>
                </select>
                <div class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>
            </div>

            <div class="flex flex-wrap gap-3 items-center justify-end">
              <div class="flex items-center rounded-full bg-slate-900/80 border border-slate-700 p-1 shadow-sm">
                <button @click="viewMode = 'grid'"
                  :class="['px-4 py-2 rounded-full text-sm font-semibold transition', viewMode === 'grid' ? 'bg-sky-500 text-slate-950' : 'text-slate-300 hover:text-white']">
                  ▦ Grid
                </button>
                <button @click="viewMode = 'list'"
                  :class="['px-4 py-2 rounded-full text-sm font-semibold transition', viewMode === 'list' ? 'bg-sky-500 text-slate-950' : 'text-slate-300 hover:text-white']">
                  ☰ List
                </button>
              </div>
              <button @click="openCreate" class="btn-primary text-sm min-w-[10rem] px-4 py-2">+ New Contest</button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="loading" class="flex justify-center py-20">
        <LoadingSpinner label="Loading contests..." />
      </div>

      <div v-else-if="contests.length === 0" class="glass-card p-16 text-center">
        <div class="text-5xl mb-4">🏆</div>
        <p class="text-white/40 font-body mb-4">No contests yet</p>
        <button @click="openCreate" class="btn-primary">Create First Contest</button>
      </div>

      <div v-else-if="displayedContests.length === 0" class="glass-card p-16 text-center">
        <div class="text-5xl mb-4">🔍</div>
        <p class="text-slate-100 font-semibold mb-2">No contests match your search.</p>
        <p class="text-slate-400 text-sm">Try a different keyword, status filter, or sort option.</p>
      </div>

      <!-- GRID VIEW -->
      <div v-else-if="viewMode === 'grid'" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div v-for="c in pagedContests" :key="c.id"
          class="glass-card relative overflow-hidden group hover:border-neon-red/40 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(220,38,38,0.12)] transition-all duration-300">
          <div
            class="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 pointer-events-none">
          </div>
          <div class="h-1 w-full" :style="`background: ${statusColor(c.status)}`"></div>
          <div class="relative p-5">
            <div class="flex items-center justify-between gap-3 mb-4">
              <StatusBadge :status="c.status" />
              <span class="text-sm font-semibold text-sky-300 tracking-wide">{{ formatDate(c.contestDate) }}</span>
            </div>
            <h3
              class="font-display font-black text-white text-lg md:text-xl leading-tight mb-3 line-clamp-2 group-hover:text-rose-300 transition-colors">
              {{ c.name }}
            </h3>
            <div class="flex justify-between items-center gap-3 mb-4">
              <div v-if="c.description" class="text-sm text-slate-400 font-body line-clamp-3">{{ c.description }} </div>
              <button @click="confirmDelete(c)" class="text-red-400 hover:text-red-300 cursor-pointer">Delete</button>
            </div>
            <div class="grid grid-cols-2 gap-3 mb-5">
              <div class="bg-slate-950/70 rounded-3xl p-4 text-center border border-slate-700 shadow-sm">
                <div class="flex items-center justify-center gap-2 mb-2 text-slate-400">
                  <svg class="w-4 h-4 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  <span class="text-[10px] font-display tracking-wider uppercase text-rose-200">Registered</span>
                </div>
                <p class="text-rose-300 font-display font-black text-2xl">{{ c.registrationCount || 0 }}</p>
              </div>
              <div class="bg-slate-950/70 rounded-3xl p-4 text-center border border-slate-700 shadow-sm">
                <div class="flex items-center justify-center gap-2 mb-2 text-slate-400">
                  <svg class="w-4 h-4 text-cyan-300" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 9a3 3 0 1 1 6 0c0 1.657-1.343 3-3 3" />
                    <path d="M12 17h.01" />
                    <path d="M21 20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h9l5 5v11z" />
                  </svg>
                  <span class="text-[10px] font-display tracking-wider uppercase text-cyan-200">Questions</span>
                </div>
                <p class="text-cyan-300 font-display font-black text-2xl">{{ c.questionCount ?? '—' }}</p>
              </div>
            </div>
            <div class="space-y-3 mb-5">
              <div class="flex items-center justify-between text-xs font-mono text-slate-400">
                <span class="font-semibold text-slate-300">Reg Open</span>
                <span class="text-slate-200">{{ formatShort(c.registrationStart) }}</span>
              </div>
              <div class="flex items-center justify-between text-xs font-mono text-slate-400">
                <span class="font-semibold text-slate-300">Contest Start</span>
                <span class="text-slate-200">{{ formatShort(c.contestStart) }}</span>
              </div>
              <div class="flex items-center justify-between text-xs font-mono text-slate-400">
                <span class="font-semibold text-slate-300">Ends</span>
                <span class="text-slate-200">{{ formatShort(c.contestEnd) }}</span>
              </div>
            </div>
            <div class="flex flex-wrap gap-3">
              <router-link :to="`/admin/contests/${c.id}/questions`"
                class="flex-1 inline-flex items-center justify-center gap-2 text-xs md:text-sm font-semibold text-white bg-neon-blue/15 border border-neon-blue/30 px-3 py-3 rounded-2xl hover:bg-neon-blue/25 transition-colors">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Questions
              </router-link>
              <button @click="openEdit(c)"
                class="flex-1 inline-flex items-center justify-center gap-2 text-xs md:text-sm font-semibold text-white/90 bg-white/10 border border-white/15 px-3 py-3 rounded-2xl hover:bg-white/15 hover:text-white transition-colors">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                </svg>
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- LIST VIEW -->
      <div v-else class="glass-card p-6 overflow-x-auto">
        <table class="w-full border-collapse">
          <thead>
            <tr class="border-b border-slate-700">
              <th class="pb-3 text-left text-sm font-display tracking-wider text-slate-300 uppercase">Name</th>
              <th
                class="pb-3 text-center text-sm font-display tracking-wider text-slate-300 uppercase hidden sm:table-cell">
                Status</th>
              <th
                class="pb-3 text-center text-sm font-display tracking-wider text-slate-300 uppercase hidden lg:table-cell">
                Contest Date</th>
              <th
                class="pb-3 text-center text-sm font-display tracking-wider text-slate-300 uppercase hidden md:table-cell">
                Registered</th>
              <th class="pb-3 text-right text-sm font-display tracking-wider text-slate-300 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in pagedContests" :key="c.id"
              class="border-b border-slate-800 bg-slate-950/80 hover:bg-slate-900/90 transition-colors">
              <td class="py-4 pr-4 max-w-xs">
                <p class="font-display text-base text-slate-100 font-semibold truncate">{{ c.name }}</p>
                <p v-if="c.description" class="text-sm text-slate-400 font-body truncate mt-1">{{ c.description }}</p>
              </td>
              <td class="py-4 text-center hidden sm:table-cell">
                <StatusBadge :status="c.status" size="xs" />
              </td>
              <td class="py-4 text-center hidden lg:table-cell text-sm font-mono text-sky-300">{{
                formatDate(c.contestDate) }}</td>
              <td class="py-4 text-center hidden md:table-cell text-sm font-mono text-emerald-300">{{
                c.registrationCount || 0 }}</td>
              <td class="py-4">
                <div class="flex flex-wrap justify-end gap-2">
                  <router-link :to="`/admin/contests/${c.id}/questions`"
                    class="text-xs md:text-sm font-semibold text-white bg-sky-600/15 border border-sky-500/20 px-3 py-2 rounded-2xl hover:bg-sky-600/25 hover:text-white transition-colors">
                    Questions
                  </router-link>
                  <button @click="openEdit(c)"
                    class="text-xs md:text-sm font-semibold text-amber-100 bg-amber-500/10 border border-amber-500/20 px-3 py-2 rounded-2xl hover:bg-amber-500/20 hover:text-white transition-colors">
                    Edit
                  </button>
                  <button @click="confirmDelete(c)"
                    class="text-xs md:text-sm font-semibold text-red-100 bg-red-600/10 border border-red-600/25 px-3 py-2 rounded-2xl hover:bg-red-600/20 transition-colors">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="displayedContests.length > 0"
        class="mt-6 flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-950/80 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div class="text-sm text-slate-400">
          Showing <span class="font-semibold text-white">{{ pagedContests.length }}</span> of <span
            class="font-semibold text-white">{{ displayedContests.length }}</span> contests
        </div>
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <div
            class="relative flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-300">
            <span class="uppercase tracking-[0.2em] text-[10px] text-slate-500">Per page</span>
            <select v-model="itemsPerPage"
              class="bg-slate-950/90 text-slate-100 outline-none appearance-none accent-sky-400 focus:text-white focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 px-4 py-1"
              aria-label="Contests per page">
              <option class="bg-slate-950 text-slate-100" v-for="size in pageSizes" :key="size" :value="size">{{ size }}
              </option>
            </select>
            <div class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>
          <div class="flex flex-wrap items-center justify-end gap-2">
            <button @click="currentPage = Math.max(1, currentPage - 1)" :disabled="currentPage === 1"
              class="h-9 rounded-full px-4 text-sm font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed bg-slate-900/80 text-slate-200 hover:bg-slate-800">
              Prev
            </button>
            <button v-for="page in Array.from({ length: totalPages }, (_, i) => i + 1)" :key="page"
              @click="currentPage = page"
              :class="['h-9 min-w-[2.25rem] rounded-full px-3 text-sm font-semibold transition', page === currentPage ? 'bg-sky-500 text-slate-950' : 'bg-slate-900/80 text-slate-200 hover:bg-slate-800']">
              {{ page }}
            </button>
            <button @click="currentPage = Math.min(totalPages, currentPage + 1)" :disabled="currentPage === totalPages"
              class="h-9 rounded-full px-4 text-sm font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed bg-slate-900/80 text-slate-200 hover:bg-slate-800">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ── CREATE / EDIT MODAL ───────────────────────────────── -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      @click.self="showModal = false">

      <div class="glass-panel neon-border-red p-8 w-full max-w-xl relative my-4 flex flex-col max-h-[90vh]">

        <button @click="showModal = false"
          class="absolute top-4 right-4 text-white/40 hover:text-white text-xl z-10">✕</button>

        <h2 class="section-title mb-6 flex-shrink-0">{{ editingId ? 'Edit Contest' : 'Create Contest' }}</h2>

        <form @submit.prevent="handleSave" class="space-y-6 overflow-y-auto pr-2 custom-scrollbar">
          <div>
            <label class="label-text">Contest Name *</label>
            <input v-model="form.name" type="text" class="input-field" required placeholder="e.g. RoboContest Week-1" />
          </div>
          <div>
            <label class="label-text">Description</label>
            <textarea v-model="form.description" class="input-field resize-none" rows="2"
              placeholder="Brief description..."></textarea>
          </div>

          <div>
            <div class="flex items-center gap-2 mb-3">
              <span class="text-xs font-display tracking-widest text-neon-blue uppercase">Registration Window</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="label-text">Opens On *</label>
                <input v-model="form.registrationStartDate" type="date" class="dt-input" required />
                <input v-model="form.registrationStartTime" type="time" class="dt-input mt-2" required />
              </div>
              <div>
                <label class="label-text">Closes On *</label>
                <input v-model="form.registrationEndDate" type="date" class="dt-input" required />
                <input v-model="form.registrationEndTime" type="time" class="dt-input mt-2" required />
              </div>
            </div>
          </div>

          <div>
            <div class="flex items-center gap-2 mb-3">
              <span class="text-xs font-display tracking-widest text-neon-red uppercase">Contest Window</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="label-text">Starts On *</label>
                <input v-model="form.contestStartDate" type="date" class="dt-input" required />
                <input v-model="form.contestStartTime" type="time" class="dt-input mt-2" required />
              </div>
              <div>
                <label class="label-text">Ends On *</label>
                <input v-model="form.contestEndDate" type="date" class="dt-input" required />
                <input v-model="form.contestEndTime" type="time" class="dt-input mt-2" required />
              </div>
            </div>
          </div>

          <!-- NEW: Send Mail Button (only shows when editing an existing contest) -->
          <div v-if="editingId" class="mx-16 border-t border-slate-700 pt-4 mt-2">
            <button type="button" @click="sendContestAnnouncement" :disabled="sendingEmail"
              class="w-full btn-secondary flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-rose-600/20 to-red-600/20 border border-rose-500/40 hover:from-rose-600/30 hover:to-red-600/30 transition-all duration-300 rounded-2xl">
              <svg v-if="sendingEmail" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <svg v-else class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
              {{ sendingEmail ? 'Sending...' : 'Send Email Announcement to All Users' }}
            </button>
            <p class="text-xs text-slate-500 mt-2 text-center">Send contest announcement email to all registered users
            </p>
          </div>

          <div v-if="formError"
            class="text-neon-red text-xs font-body px-3 py-2 bg-red-700/10 border border-neon-red/30 rounded">
            {{ formError }}
          </div>

          <div class="flex gap-3 pt-2 pb-1">
            <button type="submit" :disabled="saving"
              class="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              <svg v-if="saving" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {{ saving ? 'Saving...' : (editingId ? 'Update Contest' : 'Create Contest') }}
            </button>
            <button type="button" @click="showModal = false" class="btn-ghost">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- DELETE CONFIRM -->
    <div v-if="deleteTarget"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      @click.self="deleteTarget = null">
      <div class="glass-panel neon-border-red p-8 w-full max-w-sm text-center">
        <div class="text-4xl mb-3">⚠️</div>
        <h3 class="font-display text-xl font-bold text-white mb-2">Delete Contest?</h3>
        <p class="text-white/60 font-body text-sm mb-6">
          Permanently delete <strong class="text-white">{{ deleteTarget.name }}</strong>
          and all its questions, registrations, submissions and results.
        </p>
        <div class="flex gap-3 justify-center">
          <button @click="doDelete" :disabled="deleting"
            class="btn-primary flex items-center gap-2 disabled:opacity-50">
            <svg v-if="deleting" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Delete
          </button>
          <button @click="deleteTarget = null" class="btn-ghost">Cancel</button>
        </div>
      </div>
    </div>

    <!-- ADD QUESTIONS PROMPT -->
    <div v-if="newContestId"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div class="glass-panel neon-border-blue p-8 w-full max-w-sm text-center">
        <div class="text-5xl mb-4">✅</div>
        <h3 class="font-display text-xl font-bold text-white mb-2">Contest Created!</h3>
        <p class="text-white/60 font-body text-sm mb-6">Would you like to add questions now?</p>
        <div class="flex gap-3 justify-center">
          <router-link :to="`/admin/contests/${newContestId}/questions`" @click="newContestId = null"
            class="btn-primary">Add Questions</router-link>
          <button @click="newContestId = null" class="btn-ghost">Later</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useContestStore } from '@/stores/contest'
import StatusBadge from '@/components/common/StatusBadge.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { format } from 'date-fns'

const contestStore = useContestStore()

const contests = ref([])
const loading = ref(true)
const viewMode = ref('grid')
const searchQuery = ref('')
const statusFilter = ref('ALL')
const sortOption = ref('createdDesc')
const currentPage = ref(1)
const itemsPerPage = ref(6)
const pageSizes = [6, 9, 12]
const showModal = ref(false)
const editingId = ref(null)
const saving = ref(false)
const formError = ref('')
const deleteTarget = ref(null)
const deleting = ref(false)
const newContestId = ref(null)
const sendingEmail = ref(false)

const defaultForm = () => ({
  name: '',
  description: '',
  registrationStartDate: '',
  registrationStartTime: '',
  registrationEndDate: '',
  registrationEndTime: '',
  contestStartDate: '',
  contestStartTime: '',
  contestEndDate: '',
  contestEndTime: '',
})
const form = ref(defaultForm())

// ── Preview: dd/mm/yyyy HH:mm format ─────────────────────────
function formatTime12(time) {
  if (!time) return '—'
  try {
    const [hour, minute] = time.split(':').map(Number)
    if (Number.isNaN(hour) || Number.isNaN(minute)) return time
    const period = hour >= 12 ? 'PM' : 'AM'
    const normalizedHour = hour % 12 || 12
    return `${String(normalizedHour).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${period}`
  } catch { return time }
}

function previewFmt(date, time) {
  if (!date || !time) return '—'
  try {
    const [y, m, d] = date.split('-')
    return `${d}/${m}/${y} ${formatTime12(time)}`
  } catch { return '—' }
}

// ── CRITICAL FIX: build ISO WITHOUT timezone conversion ───────
//
// WRONG (old):  new Date(`${date}T${time}:00`).toISOString()
//   → Converts local time to UTC then sends UTC.
//   → Jackson receives "04:00Z", strips Z, stores "04:00" (wrong!)
//   → Bangladesh (UTC+6) user enters 10:00, saved as 04:00
//
// CORRECT (new): just concatenate date + time as a plain string
//   → "2026-03-20T10:00:00" — no timezone info
//   → Jackson's LocalDateTime reads exactly "10:00" — saved correctly
//
function toLocalDateTime(date, time) {
  if (!date || !time) return null
  return `${date}T${time}:00`   // "2026-03-20T10:00:00" — no Z, no offset
}

// ── Split: backend returns "2026-03-20T10:00:00" (no Z) ───────
// Do NOT use new Date() here — it would apply timezone and shift the time
function splitDatetime(iso) {
  if (!iso) return { date: '', time: '' }
  try {
    // iso from backend = "2026-03-20T10:00:00" or "2026-03-20T10:00:00.000000"
    const parts = iso.split('T')
    const date = parts[0]                        // "2026-03-20"
    const time = (parts[1] || '').slice(0, 5)   // "10:00"
    return { date, time }
  } catch { return { date: '', time: '' } }
}

// ── Display: dd/mm/yyyy ───────────────────────────────────────
function formatDate(iso) {
  if (!iso) return 'TBD'
  try {
    const d = iso.split('T')[0]          // "2026-03-20"
    const [y, m, day] = d.split('-')
    return `${day}/${m}/${y}`            // "20/03/2026"
  } catch { return iso }
}

function getSortTimestamp(contest) {
  const created = contest.createdAt || contest.created_date || contest.contestDate || ''
  return new Date(created).getTime() || 0
}

function getContestSortValue(contest, field) {
  if (field === 'registered') {
    return Number(contest.registrationCount || 0)
  }
  if (field === 'contestDate') {
    return new Date(contest.contestDate || contest.contestStart || '').getTime() || 0
  }
  return getSortTimestamp(contest)
}

const filteredContests = computed(() => {
  let items = contests.value || []
  if (statusFilter.value !== 'ALL') {
    items = items.filter(c => c.status === statusFilter.value)
  }
  const query = searchQuery.value.trim().toLowerCase()
  if (query) {
    items = items.filter(c =>
      (c.name || '').toLowerCase().includes(query) ||
      (c.description || '').toLowerCase().includes(query)
    )
  }
  return items
})

const displayedContests = computed(() => {
  const items = [...filteredContests.value]
  return items.sort((a, b) => {
    if (sortOption.value === 'createdDesc') {
      return getSortTimestamp(b) - getSortTimestamp(a)
    }
    if (sortOption.value === 'createdAsc') {
      return getSortTimestamp(a) - getSortTimestamp(b)
    }
    if (sortOption.value === 'contestDesc') {
      return getContestSortValue(b, 'contestDate') - getContestSortValue(a, 'contestDate')
    }
    if (sortOption.value === 'contestAsc') {
      return getContestSortValue(a, 'contestDate') - getContestSortValue(b, 'contestDate')
    }
    if (sortOption.value === 'registeredDesc') {
      return getContestSortValue(b, 'registered') - getContestSortValue(a, 'registered')
    }
    return getSortTimestamp(b) - getSortTimestamp(a)
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(displayedContests.value.length / itemsPerPage.value)))
const pagedContests = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return displayedContests.value.slice(start, start + itemsPerPage.value)
})

watch([displayedContests, itemsPerPage], () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value
  }
})

watch([searchQuery, statusFilter, sortOption], () => {
  currentPage.value = 1
})

function formatShort(iso) {
  if (!iso) return '—'
  try {
    const [datePart, timePart] = iso.split('T')
    const [y, m, d] = datePart.split('-')
    const time = formatTime12((timePart || '').slice(0, 5))   // "10:00" → "10:00 AM"
    return `${d}/${m} ${time}`                                // "20/03 10:00 AM"
  } catch { return iso }
}

function statusColor(s) {
  return { UPCOMING: '#444', REGISTRATION_OPEN: '#00bfff', RUNNING: '#00ff88', FINISHED: '#333' }[s] || '#444'
}

// ── Load ──────────────────────────────────────────────────────
async function loadContests() {
  await contestStore.fetchAllContests()
  contests.value = contestStore.contests
}

onMounted(async () => {
  try { await loadContests() } finally { loading.value = false }
})

function openCreate() {
  form.value = defaultForm(); editingId.value = null; formError.value = ''; showModal.value = true
}

function openEdit(c) {
  editingId.value = c.id
  formError.value = ''
  const rs = splitDatetime(c.registrationStart)
  const re = splitDatetime(c.registrationEnd)
  const cs = splitDatetime(c.contestStart)
  const ce = splitDatetime(c.contestEnd)
  form.value = {
    name: c.name,
    description: c.description || '',
    registrationStartDate: rs.date,
    registrationStartTime: rs.time,
    registrationEndDate: re.date,
    registrationEndTime: re.time,
    contestStartDate: cs.date,
    contestStartTime: cs.time,
    contestEndDate: ce.date,
    contestEndTime: ce.time,
  }
  showModal.value = true
}

async function handleSave() {
  saving.value = true
  formError.value = ''

  const regStart = toLocalDateTime(form.value.registrationStartDate, form.value.registrationStartTime)
  const regEnd = toLocalDateTime(form.value.registrationEndDate, form.value.registrationEndTime)
  const conStart = toLocalDateTime(form.value.contestStartDate, form.value.contestStartTime)
  const conEnd = toLocalDateTime(form.value.contestEndDate, form.value.contestEndTime)

  // Client-side validation (compare string directly — same format, lexicographic = chronological)
  if (regEnd <= regStart) {
    formError.value = 'Registration close must be after registration open'
    saving.value = false; return
  }
  if (conEnd <= conStart) {
    formError.value = 'Contest end must be after contest start'
    saving.value = false; return
  }

  const payload = {
    name: form.value.name,
    description: form.value.description || null,
    contestDate: conStart,   // display date = contest start
    registrationStart: regStart,
    registrationEnd: regEnd,
    contestStart: conStart,
    contestEnd: conEnd,
  }

  try {
    if (editingId.value) {
      await contestStore.updateContest(editingId.value, payload)
      showModal.value = false
    } else {
      const created = await contestStore.createContest(payload)
      showModal.value = false
      newContestId.value = created?.id ?? null
    }
    await loadContests()
  } catch (e) {
    formError.value = e.message || 'Failed to save contest'
  } finally {
    saving.value = false
  }
}

function confirmDelete(c) { deleteTarget.value = c }

async function doDelete() {
  deleting.value = true
  try {
    await contestStore.deleteContest(deleteTarget.value.id)
    deleteTarget.value = null
    await loadContests()
  } catch (e) { console.error(e) }
  finally { deleting.value = false }
}

async function sendContestAnnouncement() {
  if (!editingId.value) return
  
  sendingEmail.value = true
  try {
    await contestStore.sendContestAnnouncement(editingId.value)
  } catch (error) {
    console.error('Failed to send emails:', error)
    alert('Failed to send emails: ' + (error.message || 'Unknown error'))
  } finally {
    sendingEmail.value = false
  }
}
</script>

<style scoped>
.dt-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  font-family: monospace;
  color: rgba(255, 255, 255, 0.85);
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  color-scheme: dark;
}

.dt-input:focus {
  border-color: rgba(255, 0, 51, 0.5);
  box-shadow: 0 0 0 1px rgba(255, 0, 51, 0.15);
}

.dt-input::-webkit-calendar-picker-indicator {
  filter: invert(0.6);
  cursor: pointer;
  opacity: 0.7;
}

.dt-input::-webkit-calendar-picker-indicator:hover {
  opacity: 1;
}

/* Optional: Clean scrollbar for modern UI */
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>