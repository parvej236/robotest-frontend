// src/stores/contest.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/api'

export const useContestStore = defineStore('contest', () => {

  const contests = ref([])
  const activeContests = ref([])
  const latestContests = ref([])
  const loading = ref(false)

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
    console.log("Leaderboard API Response:", res)
    return res.data || []
  }

  async function submitAnswers(contestId, qId, answer, questionStartedAt) {
    try {
      const payload = { answer: String(answer) }
      if (questionStartedAt) {
        payload.questionStartedAt = questionStartedAt
      }
      const res = await api.post(`/submissions/contest/${contestId}/question/${qId}`, payload)
      console.log("API Response:", res)
      // Success response - returns ApiResponse<String>
      return {
        success: res.success,
        message: res.message || 'Correct! Moving to next question.',
        data: res.data
      }
    } catch (error) {
      // Catch error response from backend
      // The backend throws AppException.badRequest() for wrong answers
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred'
      return {
        success: false,
        message: errorMessage,
        error: error
      }
    }
  }

  async function getContestQuestions(contestId) {
    const res = await api.get(`/contests/${contestId}/questions`)
    return res.data || []
  }

  async function hasSubmittedContest(id) {
    const res = await api.get(`/submissions/contest/${id}/exists`)
    return res.data
  }

  async function completeContest(id) {
    const res = await api.post(`/submissions/contest/${id}/complete`)
    return res.data
  }

  async function getMyHistory() {
    try {
      // Changed from /leaderboard/my-history to /results/my-history
      const res = await api.get('/leaderboard/my-history')
      return res.data || []
    } catch (error) {
      console.error("Store Error:", error)
      throw error;
    }
  }

  async function sendContestAnnouncement(contestId) {
    try {
      const response = await api.post(`/contests/${contestId}/send-announcement`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  }

  return {
    contests, activeContests, latestContests, loading,
    fetchAllContests, fetchActiveContests, fetchLatestContests,
    fetchContest, registerForContest, isRegistered, getMyContests,
    createContest, updateContest, deleteContest,
    getLeaderboard, submitAnswers, getContestQuestions, hasSubmittedContest, completeContest, getMyHistory,
    sendContestAnnouncement
  }
})