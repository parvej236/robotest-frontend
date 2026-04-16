// src/stores/contest.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/api'

export const useContestStore = defineStore('contest', () => {

  const contests       = ref([])
  const activeContests = ref([])
  const latestContests = ref([])
  const loading        = ref(false)

  function getCreatedTimestamp(contest) {
    return new Date(contest?.createdAt || contest?.created_date || contest?.contestDate || '').getTime() || 0
  }

  function sortContestsByNewest(items) {
    return [...items].sort((a, b) => getCreatedTimestamp(b) - getCreatedTimestamp(a))
  }

  // ── Public Fetch All ──────────────────────────────────────
  async function fetchAllContests() {
    loading.value = true
    try {
      // Pass 'false' to allow guests
      const res = await api.get('/contests', false)
      contests.value = sortContestsByNewest(res.data || [])
    } finally {
      loading.value = false
    }
  }

  // ── Public Fetch Active ───────────────────────────────────
  async function fetchActiveContests() {
    const res = await api.get('/contests/active', false)
    activeContests.value = res.data || []
    return activeContests.value
  }

  // ── Public Fetch Latest ───────────────────────────────────
  async function fetchLatestContests() {
    const res = await api.get('/contests/latest', false)
    latestContests.value = res.data || []
    return latestContests.value
  }

  // ── Public Fetch Single ───────────────────────────────────
  async function fetchContest(id) {
    const res = await api.get(`/contests/${id}`, false)
    return res.data 
  }

  // ── Authenticated Actions ─────────────────────────────────
  async function registerForContest(id) {
    return await api.post(`/contests/${id}/register`, null)
  }

  async function isRegistered(id) {
    const res = await api.get(`/contests/${id}/is-registered`)
    return res.data 
  }

  async function getMyContests() {
    const res = await api.get('/contests/my-contests')
    return res.data || []
  }

  // ── Admin Actions ─────────────────────────────────────────
  async function createContest(payload) {
    const res = await api.post('/contests', payload)
    return res.data
  }

  async function updateContest(id, payload) {
    const res = await api.put(`/contests/${id}`, payload)
    return res.data
  }

  async function deleteContest(id) {
    await api.delete(`/contests/${id}`)
  }

  // ── Stats & Submissions ───────────────────────────────────
  async function getLeaderboard(contestId) {
    // Usually leaderboards are public, but I kept default auth here
    // Change to 'false' if you want anyone to see the leaderboard
    const res = await api.get(`/leaderboard/contest/${contestId}`, false)
    return res.data || []
  }

  async function getMyResult(contestId) {
    const res = await api.get(`/leaderboard/contest/${contestId}/my-result`)
    return res.data
  }

  async function submitAnswers(contestId, answers) {
    const res = await api.post(`/submissions/contest/${contestId}`, { answers })
    return res
  }

  async function getContestQuestions(contestId) {
    const res = await api.get(`/contests/${contestId}/questions`)
    return res.data || []
  }

  return {
    contests, activeContests, latestContests, loading,
    fetchAllContests, fetchActiveContests, fetchLatestContests,
    fetchContest, registerForContest, isRegistered, getMyContests,
    createContest, updateContest, deleteContest,
    getLeaderboard, getMyResult, submitAnswers, getContestQuestions
  }
})