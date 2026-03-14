import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/api'

export const useContestStore = defineStore('contest', () => {
  const contests = ref([])
  const activeContests = ref([])
  const latestContests = ref([])
  const loading = ref(false)

  async function fetchAllContests() {
    loading.value = true
    try {
      const res = await api.get('/contests')
      contests.value = res.data.data
    } finally {
      loading.value = false
    }
  }

  async function fetchActiveContests() {
    const res = await api.get('/contests/active')
    activeContests.value = res.data.data
    return res.data.data
  }

  async function fetchLatestContests() {
    const res = await api.get('/contests/latest')
    latestContests.value = res.data.data
    return res.data.data
  }

  async function fetchContest(id) {
    const res = await api.get(`/contests/${id}`)
    return res.data.data
  }

  async function registerForContest(id) {
    const res = await api.post(`/contests/${id}/register`)
    return res.data
  }

  async function isRegistered(id) {
    const res = await api.get(`/contests/${id}/is-registered`)
    return res.data.data
  }

  async function getMyContests() {
    const res = await api.get('/contests/my-contests')
    return res.data.data
  }

  async function createContest(payload) {
    const res = await api.post('/contests', payload)
    return res.data.data
  }

  async function updateContest(id, payload) {
    const res = await api.put(`/contests/${id}`, payload)
    return res.data.data
  }

  async function deleteContest(id) {
    await api.delete(`/contests/${id}`)
  }

  async function getLeaderboard(contestId) {
    const res = await api.get(`/leaderboard/contest/${contestId}`)
    return res.data.data
  }

  async function submitAnswers(contestId, answers) {
    const res = await api.post(`/submissions/contest/${contestId}`, { answers })
    return res.data
  }

  async function getContestQuestions(contestId) {
    const res = await api.get(`/contests/${contestId}/questions`)
    return res.data.data
  }

  return {
    contests, activeContests, latestContests, loading,
    fetchAllContests, fetchActiveContests, fetchLatestContests,
    fetchContest, registerForContest, isRegistered, getMyContests,
    createContest, updateContest, deleteContest,
    getLeaderboard, submitAnswers, getContestQuestions
  }
})
