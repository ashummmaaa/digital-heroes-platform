import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase, isDemoMode } from '../lib/supabase'
import {
  initialCharities,
  initialCharityEvents,
  initialDraws,
  initialPrizePools,
  initialUserScores,
  initialWinnerSubmissions
} from '../lib/initialData'
import { deriveDrawNumbersFromScores, calculateMatchCount } from '../lib/utils'
import { useAuth } from './AuthContext'

const DataContext = createContext()

export const DataProvider = ({ children }) => {
  const { user, profile } = useAuth()

  // State Declarations
  const [scores, setScores] = useState(initialUserScores)
  const [charities, setCharities] = useState(initialCharities)
  const [charityEvents, setCharityEvents] = useState(initialCharityEvents)
  const [selectedCharityId, setSelectedCharityId] = useState('charity-1')
  const [contributionPercentage, setContributionPercentage] = useState(20)
  const [draws, setDraws] = useState(initialDraws)
  const [prizePools, setPrizePools] = useState(initialPrizePools)
  const [winnerSubmissions, setWinnerSubmissions] = useState(initialWinnerSubmissions)
  const [auditLogs, setAuditLogs] = useState([])
  const [notification, setNotification] = useState(null)

  // Auto-dismiss notification toast after 4 seconds
  const showToast = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 4000)
  }

  // Load user-specific scores from Supabase or fallback
  useEffect(() => {
    if (!user) return
    const fetchUserData = async () => {
      try {
        const { data, error } = await supabase
          .from('scores')
          .select('*')
          .eq('user_id', user.id)
          .order('score_date', { ascending: false })

        if (data && data.length > 0) {
          setScores(data)
        }
      } catch (err) {
        console.warn('Error fetching scores from Supabase:', err)
      }
    }
    fetchUserData()
  }, [user])

  // ----------------------------------------------------
  // GOLF SCORE MANAGEMENT (1-45 Stableford, Rolling 5 Limit)
  // ----------------------------------------------------
  const addScore = async (scoreVal, scoreDate) => {
    const val = Number(scoreVal)
    if (val < 1 || val > 45) {
      showToast('Score must be between 1 and 45 Stableford points.', 'error')
      return { success: false, error: 'Invalid range' }
    }

    // Check duplicate date constraint
    const existingDate = scores.find(s => s.score_date === scoreDate)
    if (existingDate) {
      showToast(`A score for date ${scoreDate} already exists. Please edit existing entry instead.`, 'error')
      return { success: false, error: 'Duplicate date' }
    }

    const newScore = {
      id: `score-${Date.now()}`,
      user_id: user?.id || 'demo-subscriber-id',
      score: val,
      score_date: scoreDate,
      created_at: new Date().toISOString()
    }

    // Rolling 5 Scores logic: sort descending, keep top 4 + new score = 5 total
    let updatedScores = [newScore, ...scores]
      .sort((a, b) => new Date(b.score_date) - new Date(a.score_date))
      .slice(0, 5)

    setScores(updatedScores)

    // Try Supabase insert
    try {
      await supabase.from('scores').insert({
        user_id: user?.id || 'demo-subscriber-id',
        score: val,
        score_date: scoreDate
      })
    } catch (err) {
      console.info('Supabase insert score fallback:', err)
    }

    showToast('Golf score added successfully! Your latest 5 scores form your draw numbers.')
    return { success: true }
  }

  const deleteScore = async (scoreId) => {
    setScores(prev => prev.filter(s => s.id !== scoreId))
    try {
      await supabase.from('scores').delete().eq('id', scoreId)
    } catch (err) {
      console.info('Supabase delete score fallback:', err)
    }
    showToast('Score deleted successfully.')
  }

  const editScore = async (scoreId, newVal) => {
    const val = Number(newVal)
    if (val < 1 || val > 45) {
      showToast('Score must be between 1 and 45 points.', 'error')
      return
    }
    setScores(prev => prev.map(s => s.id === scoreId ? { ...s, score: val } : s))
    try {
      await supabase.from('scores').update({ score: val }).eq('id', scoreId)
    } catch (err) {
      console.info('Supabase edit score fallback:', err)
    }
    showToast('Score updated successfully.')
  }

  // Derive current user draw numbers
  const userDrawNumbers = deriveDrawNumbersFromScores(scores, user?.id || 'demo-user')

  // ----------------------------------------------------
  // CHARITY MANAGEMENT & SELECTION
  // ----------------------------------------------------
  const updateCharitySelection = (charityId, percentage) => {
    setSelectedCharityId(charityId)
    setContributionPercentage(Math.max(10, Math.min(100, Number(percentage))))
    showToast('Charity allocation updated successfully!')
  }

  const addCharity = (newCharity) => {
    const charityRecord = {
      id: `charity-${Date.now()}`,
      total_raised: 0.00,
      is_active: true,
      created_at: new Date().toISOString(),
      ...newCharity
    }
    setCharities(prev => [charityRecord, ...prev])
    showToast(`Charity "${newCharity.name}" added successfully.`)
  }

  const editCharity = (charityId, updatedFields) => {
    setCharities(prev => prev.map(c => c.id === charityId ? { ...c, ...updatedFields } : c))
    showToast('Charity details updated.')
  }

  const toggleCharityActive = (charityId) => {
    setCharities(prev => prev.map(c => c.id === charityId ? { ...c, is_active: !c.is_active } : c))
    showToast('Charity status toggled.')
  }

  // ----------------------------------------------------
  // DRAW ENGINE & SIMULATOR
  // ----------------------------------------------------
  const simulateMonthDraw = (drawMonth, drawType = 'random') => {
    // Generate 5 winning numbers in 1-45 range
    let winningNums = []
    if (drawType === 'algorithmic_frequency') {
      // Frequency-weighted generation from player score pools
      const frequencies = scores.map(s => s.score)
      const basePool = frequencies.length > 0 ? frequencies : [14, 22, 34, 38, 41]
      while (winningNums.length < 5) {
        const rand = basePool[Math.floor(Math.random() * basePool.length)]
        if (!winningNums.includes(rand) && rand >= 1 && rand <= 45) {
          winningNums.push(rand)
        } else {
          const fallback = 1 + Math.floor(Math.random() * 45)
          if (!winningNums.includes(fallback)) winningNums.push(fallback)
        }
      }
    } else {
      while (winningNums.length < 5) {
        const rand = 1 + Math.floor(Math.random() * 45)
        if (!winningNums.includes(rand)) winningNums.push(rand)
      }
    }
    winningNums.sort((a, b) => a - b)

    // Calculate subscriber pool metrics (1420 active subscribers * $19.99 * 40% prize allocation)
    const activeSubscribersCount = 1450
    const totalRevenue = activeSubscribersCount * 19.99
    const prizePoolTotal = totalRevenue * 0.40 // 40% to prize pool

    // Find previous tier 5 rollover if any
    const previousDraw = draws.find(d => d.status === 'published')
    const rolloverAmount = previousDraw ? (previousDraw.jackpot_rollover_amount || 0) : 1500.00

    // Match counts calculation against user numbers
    const matches = calculateMatchCount(userDrawNumbers, winningNums)

    const simulatedDraw = {
      id: `draw-${drawMonth}`,
      draw_month: drawMonth,
      draw_type: drawType,
      status: 'simulated',
      winning_numbers: winningNums,
      total_subscribers_count: activeSubscribersCount,
      total_pool_amount: prizePoolTotal,
      jackpot_rollover_amount: rolloverAmount,
      executed_at: new Date().toISOString()
    }

    // Tiers calculation:
    // Tier 5: 40% of pool + rollover
    // Tier 4: 35% of pool
    // Tier 3: 25% of pool
    const tier5Final = (prizePoolTotal * 0.40) + rolloverAmount
    const tier4Final = prizePoolTotal * 0.35
    const tier3Final = prizePoolTotal * 0.25

    const simulatedPools = [
      {
        id: `pool-5-${drawMonth}`,
        draw_id: simulatedDraw.id,
        tier: 5,
        percentage: 40,
        base_amount: prizePoolTotal * 0.40,
        rollover_amount: rolloverAmount,
        final_amount: tier5Final,
        winner_count: matches === 5 ? 1 : 0,
        payout_per_winner: matches === 5 ? tier5Final : 0
      },
      {
        id: `pool-4-${drawMonth}`,
        draw_id: simulatedDraw.id,
        tier: 4,
        percentage: 35,
        base_amount: tier4Final,
        rollover_amount: 0,
        final_amount: tier4Final,
        winner_count: matches === 4 ? 1 : 3,
        payout_per_winner: matches === 4 ? tier4Final : (tier4Final / 3)
      },
      {
        id: `pool-3-${drawMonth}`,
        draw_id: simulatedDraw.id,
        tier: 3,
        percentage: 25,
        base_amount: tier3Final,
        rollover_amount: 0,
        final_amount: tier3Final,
        winner_count: matches === 3 ? 1 : 15,
        payout_per_winner: matches === 3 ? tier3Final : (tier3Final / 15)
      }
    ]

    return { simulatedDraw, simulatedPools, userMatchCount: matches }
  }

  const publishDraw = (drawObj, poolObjs) => {
    const publishedDraw = {
      ...drawObj,
      status: 'published',
      published_at: new Date().toISOString()
    }

    setDraws(prev => [publishedDraw, ...prev.filter(d => d.id !== publishedDraw.id)])
    setPrizePools(prev => [...poolObjs, ...prev])

    // If current user won a tier match (e.g. >= 3 matches), create winner submission
    const userMatches = calculateMatchCount(userDrawNumbers, publishedDraw.winning_numbers)
    if (userMatches >= 3) {
      const tierPool = poolObjs.find(p => p.tier === userMatches)
      if (tierPool) {
        const newSubmission = {
          id: `win-sub-${Date.now()}`,
          draw_id: publishedDraw.id,
          user_id: user?.id || 'demo-subscriber-id',
          user_name: profile?.full_name || 'Alex Morgan',
          user_email: profile?.email || 'alex.morgan@example.com',
          tier: userMatches,
          prize_amount: tierPool.payout_per_winner || 500,
          proof_url: null,
          status: 'pending_verification',
          rejection_reason: null,
          created_at: new Date().toISOString()
        }
        setWinnerSubmissions(prev => [newSubmission, ...prev])
      }
    }

    // Add Audit Log
    const newLog = {
      id: `audit-${Date.now()}`,
      actor_id: profile?.id || 'admin',
      action: 'PUBLISH_DRAW',
      entity_type: 'DRAWS',
      entity_id: publishedDraw.id,
      metadata: { winning_numbers: publishedDraw.winning_numbers, month: publishedDraw.draw_month },
      created_at: new Date().toISOString()
    }
    setAuditLogs(prev => [newLog, ...prev])

    showToast(`Draw for ${publishedDraw.draw_month} published successfully!`)
  }

  // ----------------------------------------------------
  // WINNER VERIFICATION & PAYOUT MANAGEMENT
  // ----------------------------------------------------
  const uploadWinnerProof = (submissionId, fileUrl) => {
    setWinnerSubmissions(prev => prev.map(sub => {
      if (sub.id === submissionId) {
        return {
          ...sub,
          proof_url: fileUrl,
          status: 'pending_verification'
        }
      }
      return sub
    }))
    showToast('Scorecard proof uploaded! Our team will review your verification shortly.')
  }

  const reviewWinnerProof = (submissionId, isApproved, rejectionReason = '') => {
    setWinnerSubmissions(prev => prev.map(sub => {
      if (sub.id === submissionId) {
        return {
          ...sub,
          status: isApproved ? 'approved' : 'rejected',
          rejection_reason: isApproved ? null : rejectionReason,
          reviewed_by: profile?.id || 'admin',
          reviewed_at: new Date().toISOString()
        }
      }
      return sub
    }))

    const actionText = isApproved ? 'approved' : 'rejected'
    showToast(`Winner submission has been ${actionText}.`)
  }

  const markPayoutCompleted = (submissionId) => {
    setWinnerSubmissions(prev => prev.map(sub => {
      if (sub.id === submissionId) {
        return { ...sub, status: 'paid' }
      }
      return sub
    }))
    showToast('Payout recorded and status set to Paid.')
  }

  return (
    <DataContext.Provider
      value={{
        scores,
        addScore,
        deleteScore,
        editScore,
        userDrawNumbers,
        charities,
        charityEvents,
        addCharity,
        editCharity,
        toggleCharityActive,
        selectedCharityId,
        contributionPercentage,
        updateCharitySelection,
        draws,
        prizePools,
        simulateMonthDraw,
        publishDraw,
        winnerSubmissions,
        uploadWinnerProof,
        reviewWinnerProof,
        markPayoutCompleted,
        auditLogs,
        notification,
        showToast
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => useContext(DataContext)
