import { FullOpportunityReport } from '../types';

export const DEMO_CHRISTIAN_PRAYER_REPORT: FullOpportunityReport = {
  id: 'rep_demo_christian_prayer',
  researchTopic: 'Christian prayer',
  createdAt: '2026-09-22T09:00:00.000Z',
  summary: 'Market validation for "Christian prayer" indicates deep evergreen demand. While generic broad prayer books are crowded with legacy titles, specialized micro-niches—specifically Bedtime Prayers for Anxiety, 5-Minute Morning Prayers for Working Moms, and Large Print Editions for Seniors—demonstrate significant differentiation potential and strong commercial intent.',
  sections: {
    researchTopic: 'Christian Prayer',
    marketOverview: 'The Christian Prayer publishing space on Amazon KDP is one of the most consistent evergreen categories. Rather than fluctuating with short-lived trends, prayer books enjoy continuous year-round purchase volume alongside substantial seasonal gifting peaks during Christmas, Easter, and Mother’s Day. Independent authors who position their books around precise emotional states or tight daily routines regularly outperform generic devotionals.',
    keywordOpportunitiesSummary: 'Primary keywords such as "christian prayer" and "daily prayers" have high search presence and competitive density. The highest opportunity ratio is found in 4-6 word compound long-tail keywords that combine an audience modifier (women, mothers, seniors) with a situational prompt (anxiety, sleep, 5-minute, grief).',
    nicheOpportunitiesSummary: 'Sub-niche clustering uncovered four distinct candidate segments: (1) Evening/Bedtime Anxiety & Sleep, (2) 5-Minute Micro-Devotionals for Working Mothers, (3) Large-Print High-Contrast Prayer Books for Seniors, and (4) Minimalist Guided Prayer & Gratitude Journals for Young Adults.',
    competitorLandscape: 'Leading competitors are primarily traditional trade publishers with 365-day thick volumes (300+ pages) or independent creators with guided prompt journals. Trade books often lack modern, aesthetic covers and focused emotional positioning, creating an opening for agile KDP authors.',
    pricingLandscape: 'Paperback editions in this niche typically retail between $7.99 and $13.99. Products with specialized interior formatting (such as lined journaling space, scripture callouts, or 18pt large print) comfortably sustain retail prices at $11.99 - $14.99 without hurting conversion rates.',
    bsrSignals: 'Established niche leaders sustain Best Seller Ranks (BSR) between 10,000 and 45,000, signaling steady daily sales velocity. Sub-niche titles targeting specific life transitions frequently hold steady between BSR 30,000 and 95,000.',
    marketGapsSummary: 'Key unmet market needs: (1) Reader guilt over failing to finish lengthy 365-day books—leading to strong appetite for 21-day or 30-day sprint formats; (2) Lack of direct prayers for corporate burnout and modern remote workplace stress; (3) Dated aesthetic cover designs in senior large-print books.',
    potentialAudienceSegments: [
      'Anxious women struggling with racing thoughts before sleep',
      'Busy working mothers with fewer than 5 minutes for morning devotions',
      'Older adults (65+) and caregivers requiring high-legibility large print',
      'Young professionals navigating early career pressure and burnout'
    ],
    suggestedAngles: [
      'Bedtime Calm: Short 2-minute prayers paired with calming Psalms',
      'The 5-Minute Working Mom: Daily prayers for chaotic mornings',
      '18-Point Dignified Large Print: Large format prayers for seniors',
      '30-Day Spiritual Sprint: Achievable prompt journal with completion tracker'
    ],
    competitionAssessment: 'Broad topic competition is high. However, sub-niche competition for focused, beautifully typeset prompt-driven books remains moderate to low. Differentiation through interior design quality and cover minimalism is readily achievable.',
    researchRisks: [
      'High print costs if page count exceeds 200 pages without premium retail pricing',
      'Amazon Ads CPCs can be high for generic one-word keywords like "prayer"; target exact long-tail phrases instead',
      'Avoid outdated clip-art cover aesthetics which convey low quality to modern buyers'
    ],
    whatToValidateNext: [
      'Search exact long-tail phrases on Amazon to inspect the first page of sponsored vs organic listings',
      'Evaluate Look Inside previews of the top 5 ranking books to note interior layout deficiencies',
      'Calculate KDP printing costs for 110-page vs 150-page trims to model royalty margins',
      'Gather feedback on 2-3 cover typography mockups from Christian reader interest groups'
    ],
    finalResearchSummary: 'Christian prayer presents compelling viability for KDP authors when approached with narrow niche discipline. We recommend focusing on "Bedtime Prayers for Anxious Women" or "5-Minute Prayers for Working Mothers" using a 100-140 page format with dedicated journaling lines.'
  },
  keywords: {
    highRelevance: [
      { id: 'k1', keyword: 'christian prayer', relevance: 'High', competitionSignal: 'High', commercialIntent: 'High', keywordType: 'core', demandSignal: 'Strong' },
      { id: 'k2', keyword: 'christian prayer book', relevance: 'High', competitionSignal: 'High', commercialIntent: 'High', keywordType: 'core', demandSignal: 'Strong' },
      { id: 'k3', keyword: 'daily christian prayers', relevance: 'High', competitionSignal: 'Moderate', commercialIntent: 'High', keywordType: 'core', demandSignal: 'Strong' },
      { id: 'k4', keyword: 'christian devotional prayer', relevance: 'High', competitionSignal: 'Moderate', commercialIntent: 'High', keywordType: 'core', demandSignal: 'Moderate' },
      { id: 'k5', keyword: 'morning christian prayers', relevance: 'High', competitionSignal: 'Moderate', commercialIntent: 'Medium', keywordType: 'core', demandSignal: 'Strong' }
    ],
    longTail: [
      { id: 'klt1', keyword: 'christian prayers for anxiety and peace', relevance: 'High', competitionSignal: 'Moderate', commercialIntent: 'High', keywordType: 'long-tail', demandSignal: 'Strong' },
      { id: 'klt2', keyword: 'christian morning prayers for busy women', relevance: 'High', competitionSignal: 'Low', commercialIntent: 'High', keywordType: 'long-tail', demandSignal: 'Strong' },
      { id: 'klt3', keyword: 'christian bedtime prayers for sleep', relevance: 'High', competitionSignal: 'Low', commercialIntent: 'High', keywordType: 'long-tail', demandSignal: 'Strong' },
      { id: 'klt4', keyword: 'short daily prayers for healing and strength', relevance: 'Medium', competitionSignal: 'Moderate', commercialIntent: 'Medium', keywordType: 'long-tail', demandSignal: 'Moderate' },
      { id: 'klt5', keyword: 'guided christian prayer journal with scriptures', relevance: 'High', competitionSignal: 'Moderate', commercialIntent: 'High', keywordType: 'format', demandSignal: 'Strong' }
    ],
    audienceSpecific: [
      { id: 'kas1', keyword: 'christian prayers for women', relevance: 'High', competitionSignal: 'High', commercialIntent: 'High', keywordType: 'audience', demandSignal: 'Strong' },
      { id: 'kas2', keyword: 'christian prayers for mothers', relevance: 'High', competitionSignal: 'Moderate', commercialIntent: 'High', keywordType: 'audience', demandSignal: 'Strong' },
      { id: 'kas3', keyword: 'christian prayers for young adults', relevance: 'Medium', competitionSignal: 'Low', commercialIntent: 'Medium', keywordType: 'audience', demandSignal: 'Emerging' },
      { id: 'kas4', keyword: 'christian prayers for seniors large print', relevance: 'High', competitionSignal: 'Low', commercialIntent: 'High', keywordType: 'format', demandSignal: 'Moderate' },
      { id: 'kas5', keyword: 'christian prayers for couples devotional', relevance: 'Medium', competitionSignal: 'Moderate', commercialIntent: 'High', keywordType: 'audience', demandSignal: 'Moderate' }
    ],
    clusters: [
      {
        theme: 'Core Routine & Timing',
        description: 'Queries revolving around recurring daily cadence',
        keywords: ['daily christian prayers', 'morning christian prayers', 'bedtime christian prayers', 'evening prayer book', '5 minute daily prayers']
      },
      {
        theme: 'Emotional States & Pain Points',
        description: 'Searches driven by specific emotional vulnerability or acute needs',
        keywords: ['christian prayers for anxiety', 'prayers for peace of mind', 'prayers for grief and loss', 'prayers for strength in hard times']
      },
      {
        theme: 'Format & Tactile Experience',
        description: 'Queries looking for writing interaction and specialized typesetting',
        keywords: ['guided prayer journal with prompts', 'large print prayer book', 'scripture prayer workbook', 'lined prayer notebook']
      },
      {
        theme: 'Demographic Cohorts',
        description: 'Specific audiences wanting relevant life-stage examples',
        keywords: ['prayers for busy moms', 'prayers for teenage girls', 'prayers for men devotional', 'prayers for married couples']
      }
    ]
  },
  niches: [
    {
      id: 'n1',
      nicheName: 'Bedtime Prayers for Anxiety & Restful Sleep',
      broadCategory: 'Religion & Spirituality / Self-Help',
      relatedKeywords: ['christian sleep prayers', 'bedtime prayers for anxiety', 'night prayers for peace', 'calming evening devotional'],
      competitionSignal: 'Moderate',
      demandSignal: 'Strong',
      competitorCountEstimated: 'Moderate (approx. 20-35 focused titles)',
      priceRange: '$8.99 - $12.99',
      bsrRange: 'Estimated 18,000 - 65,000 in Religion & Spirituality',
      marketMaturity: 'Emerging',
      opportunityInterpretation: 'A high-intent niche driven by readers who struggle with bedtime insomnia and racing thoughts. High retention and word-of-mouth potential when structured with short 2-minute prayers.',
      suggestedAngles: [
        '100 Nightly Prayers to Lay Your Worries at the Feet of God',
        'Midnight Peace: Short Scriptures and Calming Prayers for Sleepless Nights',
        'The Bedtime Breath: Guided Evening Prayer Journal for Anxious Women'
      ]
    },
    {
      id: 'n2',
      nicheName: '5-Minute Morning Prayers for Working Mothers',
      broadCategory: 'Christian Living / Parenting',
      relatedKeywords: ['5 minute prayers for moms', 'working mom devotional', 'quick morning prayers', 'daily strength for mothers'],
      competitionSignal: 'Low',
      demandSignal: 'Strong',
      competitorCountEstimated: 'Low (few books explicitly address dual working/parenting friction)',
      priceRange: '$7.99 - $11.99',
      bsrRange: 'Estimated 25,000 - 80,000',
      marketMaturity: 'Emerging',
      opportunityInterpretation: 'Working mothers experience guilt over lacking extended Bible study time. Micro-devotionals honoring their constrained schedules generate enthusiastic loyalty.',
      suggestedAngles: [
        'Before the Commute: 5-Minute Morning Prayers for Working Moms',
        'Grace in the Chaos: 60-Second Blessings for Hectic Mornings',
        'Coffee & Scripture: Quick Daily Uplift for Busy Mothers'
      ]
    },
    {
      id: 'n3',
      nicheName: 'Large Print Daily Prayers for Seniors',
      broadCategory: 'Religion & Spirituality / Senior Health',
      relatedKeywords: ['large print prayers for seniors', 'easy to read christian prayers', 'big print devotional', 'elderly prayer book'],
      competitionSignal: 'Low',
      demandSignal: 'Moderate',
      competitorCountEstimated: 'Moderate, but mostly dated typography with 1990s covers',
      priceRange: '$9.99 - $14.99',
      bsrRange: 'Estimated 35,000 - 120,000',
      marketMaturity: 'Established',
      opportunityInterpretation: 'Seniors and adult children purchasing gifts represent high purchase intent. Modern, dignified minimalist covers stand out immediately against dated legacy reprints.',
      suggestedAngles: [
        'Comfort & Light: Large Print Morning & Evening Prayers for Seniors',
        'Clear Print Daily Blessings: 18-Point Font Christian Devotions',
        'The Senior Prayer Companion: Uplifting Scriptures in Easy-to-Read Print'
      ]
    }
  ],
  competitors: [
    {
      id: 'c1',
      asin: 'B08XYZ101A',
      title: 'Daily Prayers for Women of Grace',
      subtitle: '365 Days of Spiritual Hope and Morning Encouragement',
      author: 'Living Waters Press',
      price: '$11.99',
      format: 'Paperback',
      pages: 384,
      publicationDate: 'November 2024',
      categories: ['Books > Religion & Spirituality > Worship & Devotion'],
      bsr: 'Estimated Top 28,000 in Books',
      availableFormats: ['Paperback', 'Kindle'],
      positioningAnalysis: {
        targetAudience: 'Christian adult women wanting an all-year structured devotional routine',
        exactTopic: 'General annual morning prayer and scripture reading',
        formatType: '365-day one-page-per-day devotional book',
        pageLengthAssessment: '384 pages yields high perceived thickness but raises KDP print cost',
        pricingAssessment: 'Priced at $11.99, allowing solid publisher margin',
        subtitleStrategy: 'Benefit-laden ("Spiritual Hope and Morning Encouragement")',
        detectedKeywordThemes: ['daily prayers for women', '365 prayers', 'morning encouragement', 'women of grace'],
        marketAngle: 'Complete calendar-year bedside companion volume'
      }
    },
    {
      id: 'c2',
      asin: 'B09ABC202B',
      title: 'Pocket Prayers for Overcoming Anxiety',
      subtitle: 'Short Declarations and Scriptures for Immediate Peace',
      author: 'Anchor Point Publishing',
      price: '$7.99',
      format: 'Paperback',
      pages: 96,
      publicationDate: 'February 2025',
      categories: ['Books > Self-Help > Stress Management', 'Religion & Spirituality'],
      bsr: 'Estimated Top 52,000 in Books',
      availableFormats: ['Paperback', 'Kindle'],
      positioningAnalysis: {
        targetAudience: 'Individuals suffering from acute worry, panic, and racing thoughts',
        exactTopic: 'Anxiety relief declarations and comforting bible verses',
        formatType: 'Compact pocket-sized handbook (5 x 8 inches)',
        pageLengthAssessment: '96 pages enables fast reading and inexpensive print cost',
        pricingAssessment: 'Impulse purchase tier ($7.99)',
        subtitleStrategy: 'Urgency-focused ("Immediate Peace")',
        detectedKeywordThemes: ['prayers for anxiety', 'immediate peace', 'short prayers', 'overcoming worry'],
        marketAngle: 'Emergency spiritual toolkit for high-stress moments'
      }
    },
    {
      id: 'c3',
      asin: 'B07DEF303C',
      title: 'The 5-Minute Prayer Journal for Busy Women',
      subtitle: 'A Guided Daily Practice of Gratitude, Reflection, and Faith',
      author: 'Modern Faith Studio',
      price: '$9.95',
      format: 'Paperback',
      pages: 132,
      publicationDate: 'July 2023',
      categories: ['Books > Self-Help > Journal Writing'],
      bsr: 'Estimated Top 41,000 in Books',
      availableFormats: ['Paperback'],
      positioningAnalysis: {
        targetAudience: 'Time-pressured women desiring quick daily spiritual habit',
        exactTopic: 'Short morning & evening prompt-based reflection',
        formatType: 'Lined guided journal with checkboxes and prompt spaces',
        pageLengthAssessment: '132 pages fits a 10-week accountability cycle',
        pricingAssessment: 'Sweet-spot impulse price at $9.95',
        subtitleStrategy: 'Actionable habit commitment ("5-Minute", "Guided Daily Practice")',
        detectedKeywordThemes: ['5 minute prayer', 'prayer journal for women', 'guided daily practice'],
        marketAngle: 'Micro-journaling habit combining faith with secular productivity design'
      }
    }
  ],
  marketGaps: [
    {
      id: 'mg1',
      commonTheme: 'Competitors overwhelmingly produce thick 365-day books that readers abandon by mid-February.',
      underservedAngle: 'Short, focused 21-Day or 30-Day sprint devotionals with clear completion checkpoints.',
      targetAudience: 'Beginners and busy readers feeling guilty over unfinished books',
      rationale: '30-day books boast higher completion rates, superior reader satisfaction, and high repeat purchase for sequels.',
      exampleConcept: 'The 30-Day Peace Sprint: 3-Minute Nightly Prayers to Calm an Anxious Mind'
    },
    {
      id: 'mg2',
      commonTheme: 'Generic prayer books address vague life situations without practical modern context.',
      underservedAngle: 'Workplace and corporate prayers directly confronting remote-work burnout, email anxiety, and career decisions.',
      targetAudience: 'Corporate professionals, remote workers, and freelancers',
      rationale: 'Modern workplace stress is a major search trend, yet spiritual publishers rarely address slack-message dread directly.',
      exampleConcept: 'Desk Prayers: Micro-Reflections and Quick Strength for Stressful Workdays'
    },
    {
      id: 'mg3',
      commonTheme: 'Senior large-print prayer books look like 1990s photocopies with dated floral clip art.',
      underservedAngle: 'Clean, elegant large-print books featuring dignified typography and premium minimalist covers.',
      targetAudience: 'Seniors aged 65+, caregivers, and gift-purchasing adult children',
      rationale: 'Modern seniors and their gift-giving adult children prefer tasteful, bookstore-quality aesthetic layouts.',
      exampleConcept: 'Large Print Evening Blessings: Big Font Psalms & Prayers for Restful Sleep'
    }
  ],
  opportunities: [
    {
      id: 'opp_demo_1',
      title: 'Christian Bedtime Prayers for Anxious Women',
      narrowingHierarchy: [
        'Christian Books',
        'Christian Prayer & Devotionals',
        'Prayers for Women',
        'Prayers for Anxiety',
        'Christian Bedtime Prayers for Anxious Women'
      ],
      narrowingExplanation: 'We narrowed "Christian prayer" from a massive 50,000+ title space down to an acute nightly moment (lights out, racing thoughts) paired with an active buyer demographic (women seeking calming faith rituals).',
      relatedKeywords: [
        'bedtime prayers for women',
        'christian sleep prayers',
        'night prayers for anxiety',
        'evening devotional for women',
        'peaceful sleep bible verses'
      ],
      competitionSignal: 'Moderate',
      demandSignal: 'Strong',
      marketMaturity: 'Emerging',
      competitorCountInfo: 'Moderate density; most existing titles are morning-oriented rather than specialized for bedtime anxiety',
      priceRangeInfo: '$8.99 - $12.99 Paperback',
      bsrSignalInfo: 'Strong BSR clusters among top 30k in Christian Devotionals',
      opportunityExplanation: 'Readers at night are actively searching for rapid emotional grounding. A book offering 2-minute prayers followed by peaceful Scripture promises fills a specific bedtime habit loop.',
      whyInvestigate: {
        specificity: 'High: Solves a precise moment in the reader’s day (nighttime anxiety and insomnia)',
        audience: 'Clear demographic: Adult women experiencing stress from work or family',
        problem: 'Acute pain point: Inability to turn off the mind before sleep',
        competitorSituation: 'Most competitors focus on morning quiet time; evening anxiety is less saturated',
        keywordOpportunities: 'Combines multiple high-intent long-tail keywords with lower Amazon ad CPCs'
      },
      suggestedBookAngles: [
        '100 Nightly Prayers to Lay Your Worries at the Feet of God',
        'Midnight Peace: Short Scriptures and Prayers When Sleep Won’t Come',
        'The Anxious Woman’s Bedtime Companion: 3-Minute Evening Prayers for Rest'
      ],
      scorecard: {
        keywordRelevance: 'High',
        competitionSignal: 'Moderate',
        nicheSpecificity: 'High',
        marketMaturity: 'Emerging',
        dataConfidence: 'High',
        differentiationPotential: 'High'
      }
    },
    {
      id: 'opp_demo_2',
      title: '5-Minute Morning Prayers for Working Mothers',
      narrowingHierarchy: [
        'Christian Books',
        'Family & Parenting',
        'Christian Mothers',
        'Busy Working Moms',
        '5-Minute Morning Prayers for Working Mothers'
      ],
      narrowingExplanation: 'By combining a clear time constraint ("5-Minute") with an acute demographic modifier ("Working Mothers"), we bypass competition from dense 400-page theological texts.',
      relatedKeywords: [
        '5 minute prayers for moms',
        'working mom devotional',
        'quick morning prayers',
        'daily strength for mothers',
        'scripture prayers for busy moms'
      ],
      competitionSignal: 'Low',
      demandSignal: 'Strong',
      marketMaturity: 'Emerging',
      competitorCountInfo: 'Limited direct competitors specifically speaking to the dual pressures of career and motherhood',
      priceRangeInfo: '$7.99 - $11.99 Paperback',
      bsrSignalInfo: 'Consistent seasonal and gift-giving spikes (Mother’s Day, Back-to-School)',
      opportunityExplanation: 'Working mothers report guilt over having little free study time. A product that honors their schedule with punchy, uplifting daily prayers will spark organic word-of-mouth recommendations.',
      whyInvestigate: {
        specificity: 'Very High: Tailored exclusively to the morning rush of a working parent',
        audience: 'Highly motivated, giftable demographic with high purchasing power',
        problem: 'Overwhelm, morning fatigue, and guilt before the workday starts',
        competitorSituation: 'General motherhood devotionals exist, but fast 5-minute practical guides are underserved',
        keywordOpportunities: 'High commercial intent on Amazon search for giftable editions'
      },
      suggestedBookAngles: [
        'Before the Lunchboxes: 5-Minute Morning Strength for Working Moms',
        'The 60-Second Mom Prayer: Quick Blessings for Hectic Mornings',
        'Grace in the Carpool Lane: Short Daily Prayers for Busy Mothers'
      ],
      scorecard: {
        keywordRelevance: 'High',
        competitionSignal: 'Low',
        nicheSpecificity: 'High',
        marketMaturity: 'Emerging',
        dataConfidence: 'High',
        differentiationPotential: 'High'
      }
    },
    {
      id: 'opp_demo_3',
      title: 'Large Print Daily Prayers for Seniors with Bible Verses',
      narrowingHierarchy: [
        'Christian Books',
        'Seniors & Aging',
        'Large Print Books',
        'Devotionals for Seniors',
        'Large Print Daily Prayers with Bible Verses'
      ],
      narrowingExplanation: 'Applies a physical format requirement (Large Print 18pt+) to a dependable demographic (seniors and gift-buying adult children).',
      relatedKeywords: [
        'large print prayers for seniors',
        'big letter devotional',
        'easy to read prayers elderly',
        'daily blessings large print',
        'comforting scripture for seniors'
      ],
      competitionSignal: 'Low',
      demandSignal: 'Moderate',
      marketMaturity: 'Established',
      competitorCountInfo: 'Many existing large print books have poor interior formatting or outdated cover art',
      priceRangeInfo: '$9.99 - $14.99 Paperback',
      bsrSignalInfo: 'Steady evergreen sales year-round with strong Christmas gift demand',
      opportunityExplanation: 'The aging demographic creates sustained demand for large-print KDP books. Superior typographic design and modern, dignified covers can easily stand out from 1990s-style competitors.',
      whyInvestigate: {
        specificity: 'High: Format-driven differentiation that directly solves a physical accessibility barrier',
        audience: 'Seniors aged 65+, as well as adult children and caregivers seeking thoughtful gifts',
        problem: 'Eye strain from standard 9-10pt book fonts',
        competitorSituation: 'Lacks modern indie publishers; dominated by old legacy reprints',
        keywordOpportunities: '"Large print" modifier commands higher retail pricing ($11.99+) with low price resistance'
      },
      suggestedBookAngles: [
        'Comfort & Joy: Large Print Morning & Evening Prayers for Seniors',
        'Peace in the Evening: Big Font Psalms and Prayers for the Golden Years',
        'The 18-Point Prayer Book: Clear, Dignified Daily Devotions for Older Adults'
      ],
      scorecard: {
        keywordRelevance: 'High',
        competitionSignal: 'Low',
        nicheSpecificity: 'High',
        marketMaturity: 'Established',
        dataConfidence: 'Medium',
        differentiationPotential: 'High'
      }
    }
  ]
};
