// src/stores/contest.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/api'

export const useContestStore = defineStore('contest', () => {

  const contests       = ref([])
  const activeContests = ref([])
  const latestContests = ref([])
  const loading        = ref(false)

  // ── Fetch all ─────────────────────────────────────────────
  async function fetchAllContests() {
    loading.value = true
    try {
      const res = await api.get('/contests')
      // api.get returns ApiResponse: { success, message, data: ContestDto[] }
      contests.value = res.data || []
    } finally {
      loading.value = false
    }
  }

  // ── Fetch active (REGISTRATION_OPEN + RUNNING) ────────────
  async function fetchActiveContests() {
    const res = await api.get('/contests/active')
    activeContests.value = res.data || []
    return activeContests.value
  }

  // ── Fetch latest 10 (navbar dropdown) ─────────────────────
  async function fetchLatestContests() {
    const res = await api.get('/contests/latest')
    latestContests.value = res.data || []
    return latestContests.value
  }

  // ── Fetch single contest ───────────────────────────────────
  async function fetchContest(id) {
    const res = await api.get(`/contests/${id}`)
    return res.data   // ContestDto
  }

  // ── Register for contest ───────────────────────────────────
  async function registerForContest(id) {
    const res = await api.post(`/contests/${id}/register`, null)
    return res
  }

  // ── Check registration status ──────────────────────────────
  async function isRegistered(id) {
    const res = await api.get(`/contests/${id}/is-registered`)
    return res.data   // boolean
  }

  // ── Get my joined contests ─────────────────────────────────
  async function getMyContests() {
    const res = await api.get('/contests/my-contests')
    return res.data || []   // ContestDto[]
  }

  // ── Admin: create contest ─────────────────────────────────
  // IMPORTANT: must return the created ContestDto so AdminContests
  // can read created.id to show the "Add Questions?" prompt
  async function createContest(payload) {
    const res = await api.post('/contests', payload)
    return res.data   // ContestDto { id, name, status, ... }
  }

  // ── Admin: update contest ─────────────────────────────────
  async function updateContest(id, payload) {
    const res = await api.put(`/contests/${id}`, payload)
    return res.data   // ContestDto
  }

  // ── Admin: delete contest ─────────────────────────────────
  async function deleteContest(id) {
    await api.delete(`/contests/${id}`)
  }

  // ── Get leaderboard for a contest ─────────────────────────
  async function getLeaderboard(contestId) {
    const res = await api.get(`/leaderboard/contest/${contestId}`)
    return res.data || []   // LeaderboardEntryDto[]
  }

  // ── Get my result for a contest ───────────────────────────
  async function getMyResult(contestId) {
    const res = await api.get(`/leaderboard/contest/${contestId}/my-result`)
    return res.data   // Result or null
  }

  // ── Submit answers ────────────────────────────────────────
  async function submitAnswers(contestId, answers) {
    // answers = Map<questionId, answerString>
    const res = await api.post(`/submissions/contest/${contestId}`, { answers })
    return res
  }

  // ── Get contest questions (during contest) ────────────────
  async function getContestQuestions(contestId) {
    const res = await api.get(`/contests/${contestId}/questions`)
    return res.data || []   // QuestionDto[]
  }

  return {
    // state
    contests, activeContests, latestContests, loading,
    // actions
    fetchAllContests, fetchActiveContests, fetchLatestContests,
    fetchContest, registerForContest, isRegistered, getMyContests,
    createContest, updateContest, deleteContest,
    getLeaderboard, getMyResult, submitAnswers, getContestQuestions
  }
})