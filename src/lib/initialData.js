// Initial Seed Data for Digital Heroes (Used for demo mode & database seeding)

export const initialCharities = [
  {
    id: 'charity-1',
    name: 'Golf for Good Foundation',
    description: 'Empowering underprivileged youth through golf education, mentorship, and life skill development programs across local communities.',
    category: 'Youth & Education',
    image_url: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=800&q=80',
    is_featured: true,
    is_active: true,
    total_raised: 42850.00,
    created_at: '2026-01-15T00:00:00Z'
  },
  {
    id: 'charity-2',
    name: 'Green Fairways Ocean Rescue',
    description: 'Funding coastal cleanup operations, plastic waste reduction in marine habitats, and marine wildlife conservation.',
    category: 'Environment',
    image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    is_featured: true,
    is_active: true,
    total_raised: 38400.00,
    created_at: '2026-02-01T00:00:00Z'
  },
  {
    id: 'charity-3',
    name: 'Veteran Par-Golf Rehabilitation',
    description: 'Providing adaptive golf training, physical therapy, and mental wellness support for military veterans recovering from injuries.',
    category: 'Veterans & Health',
    image_url: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&w=800&q=80',
    is_featured: true,
    is_active: true,
    total_raised: 56120.00,
    created_at: '2026-01-20T00:00:00Z'
  },
  {
    id: 'charity-4',
    name: 'Clean Water Play Initiative',
    description: 'Building sustainable water filtration facilities in drought-affected rural regions to guarantee clean drinking water.',
    category: 'Global Relief',
    image_url: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80',
    is_featured: false,
    is_active: true,
    total_raised: 29300.00,
    created_at: '2026-03-10T00:00:00Z'
  }
]

export const initialCharityEvents = [
  {
    id: 'event-1',
    charity_id: 'charity-1',
    title: 'Annual Youth Golf Invitational',
    description: 'Join 120 young golfers competing in a charity tournament to raise mentorship funds.',
    event_date: '2026-10-15T09:00:00Z',
    image_url: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'event-2',
    charity_id: 'charity-3',
    title: 'Adaptive Golf Challenge & Fundraiser Gala',
    description: 'A day of adaptive golf instruction followed by an evening charity dinner honoring veteran athletes.',
    event_date: '2026-11-04T17:00:00Z',
    image_url: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&w=800&q=80'
  }
]

export const initialDraws = [
  {
    id: 'draw-2026-09',
    draw_month: '2026-09',
    draw_type: 'algorithmic_frequency',
    status: 'published',
    winning_numbers: [14, 22, 34, 38, 41],
    total_subscribers_count: 1420,
    total_pool_amount: 11360.00,
    jackpot_rollover_amount: 2500.00,
    executed_at: '2026-09-01T12:00:00Z',
    published_at: '2026-09-01T12:05:00Z'
  },
  {
    id: 'draw-2026-08',
    draw_month: '2026-08',
    draw_type: 'random',
    status: 'published',
    winning_numbers: [8, 19, 27, 36, 40],
    total_subscribers_count: 1350,
    total_pool_amount: 10800.00,
    jackpot_rollover_amount: 0.00,
    executed_at: '2026-08-01T12:00:00Z',
    published_at: '2026-08-01T12:05:00Z'
  }
]

export const initialPrizePools = [
  {
    id: 'pool-1',
    draw_id: 'draw-2026-09',
    tier: 5,
    percentage: 40.00,
    base_amount: 4544.00,
    rollover_amount: 2500.00,
    final_amount: 7044.00,
    winner_count: 1,
    payout_per_winner: 7044.00
  },
  {
    id: 'pool-2',
    draw_id: 'draw-2026-09',
    tier: 4,
    percentage: 35.00,
    base_amount: 3976.00,
    rollover_amount: 0.00,
    final_amount: 3976.00,
    winner_count: 4,
    payout_per_winner: 994.00
  },
  {
    id: 'pool-3',
    draw_id: 'draw-2026-09',
    tier: 3,
    percentage: 25.00,
    base_amount: 2840.00,
    rollover_amount: 0.00,
    final_amount: 2840.00,
    winner_count: 18,
    payout_per_winner: 157.77
  }
]

export const initialUserScores = [
  { id: 'score-1', user_id: 'demo-subscriber-id', score: 38, score_date: '2026-09-12', created_at: '2026-09-12T10:00:00Z' },
  { id: 'score-2', user_id: 'demo-subscriber-id', score: 34, score_date: '2026-09-08', created_at: '2026-09-08T14:30:00Z' },
  { id: 'score-3', user_id: 'demo-subscriber-id', score: 41, score_date: '2026-09-02', created_at: '2026-09-02T16:15:00Z' },
  { id: 'score-4', user_id: 'demo-subscriber-id', score: 36, score_date: '2026-08-28', created_at: '2026-08-28T09:20:00Z' },
  { id: 'score-5', user_id: 'demo-subscriber-id', score: 39, score_date: '2026-08-20', created_at: '2026-08-20T11:45:00Z' }
]

export const initialWinnerSubmissions = [
  {
    id: 'win-sub-1',
    draw_id: 'draw-2026-09',
    user_id: 'demo-subscriber-id',
    user_name: 'Alex Morgan',
    user_email: 'alex.morgan@example.com',
    tier: 4,
    prize_amount: 994.00,
    proof_url: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&w=800&q=80',
    status: 'pending_verification',
    rejection_reason: null,
    created_at: '2026-09-02T10:00:00Z'
  },
  {
    id: 'win-sub-2',
    draw_id: 'draw-2026-08',
    user_id: 'user-789',
    user_name: 'David Miller',
    user_email: 'david.miller@example.com',
    tier: 5,
    prize_amount: 6800.00,
    proof_url: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&w=800&q=80',
    status: 'paid',
    rejection_reason: null,
    created_at: '2026-08-03T14:20:00Z'
  }
]
