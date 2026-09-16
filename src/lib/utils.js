// Utility functions for Digital Heroes

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount || 0)
}

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date)
}

export const formatMonth = (monthString) => {
  if (!monthString) return 'N/A'
  const [year, month] = monthString.split('-')
  const date = new Date(parseInt(year), parseInt(month) - 1, 1)
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric'
  }).format(date)
}

// Stableford Score Validator (1 to 45 points)
export const validateStablefordScore = (score) => {
  const num = Number(score)
  if (isNaN(num)) return 'Score must be a valid number'
  if (!Number.isInteger(num)) return 'Score must be a whole number'
  if (num < 1 || num > 45) return 'Score must be between 1 and 45 Stableford points'
  return null
}

// Generate 5 Draw Numbers from user scores (or deterministic fallback)
export const deriveDrawNumbersFromScores = (scores = [], userId = 'demo-user') => {
  const scoreNumbers = scores.map(s => Number(s.score)).filter(s => s >= 1 && s <= 45)
  
  // If user has 5 scores, return them directly
  if (scoreNumbers.length >= 5) {
    return scoreNumbers.slice(0, 5)
  }

  // Fill remaining slots deterministically
  const filled = [...scoreNumbers]
  let seed = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  
  while (filled.length < 5) {
    seed = (seed * 9301 + 49297) % 233280
    const val = 1 + Math.floor((seed / 233280) * 45)
    if (!filled.includes(val)) {
      filled.push(val)
    }
  }
  
  return filled.sort((a, b) => a - b)
}

// Count matches between user numbers and winning numbers
export const calculateMatchCount = (userNumbers = [], winningNumbers = []) => {
  if (!userNumbers || !winningNumbers) return 0
  const winSet = new Set(winningNumbers)
  return userNumbers.filter(num => winSet.has(num)).length
}
