# utm.one Salary Tools Documentation

## Overview

utm.one's salary tools provide comprehensive, AI-powered compensation intelligence for marketing and sales operations professionals. All tools use real market data from our **2026 Global Salary Benchmark Report**.

## Available Tools

### 1. AI Salary Negotiation Coach
**Purpose**: Generate personalized negotiation scripts and strategies based on market data.

**Features**:
- AI-generated opening statements
- Data-driven counter-offer language
- Responses to common pushback
- Professional closing statements
- Leverage point analysis

**Best Used For**: Preparing for salary negotiations, annual reviews, or job offer discussions.

---

### 2. Market Value Calculator
**Purpose**: Calculate your exact market percentile and project future earnings.

**Features**:
- Real-time percentile calculation
- 5-year and 10-year salary projections
- Skills premium calculator
- Shareable value cards

**Best Used For**: Understanding if you're underpaid, preparing for raises, or evaluating job offers.

---

### 3. Career Path Optimizer
**Purpose**: Plan your next career move with salary impact analysis.

**Features**:
- Next role recommendations (vertical, lateral, diagonal)
- Path comparison (specialization analysis)
- Interactive career timeline
- Fast-track vs. steady growth scenarios

**Best Used For**: Long-term career planning, deciding between roles, or understanding career trajectories.

---

### 4. Job Offer Analyzer
**Purpose**: Comprehensively evaluate job offers with AI-powered pros/cons analysis.

**Features**:
- Market benchmark comparison
- Total compensation calculator (4-year projection)
- Cost of living adjustment
- AI pros/cons generator
- Negotiation leverage scoring

**Best Used For**: Evaluating competing offers, identifying red flags, or determining negotiation targets.

---

### 5. Team Budget Optimizer
**Purpose**: Optimize team composition within budget constraints.

**Features**:
- AI team composition recommendations
- Seniority trade-off calculator
- Geographic arbitrage analysis
- Contractor vs. full-time comparison
- Team structure visualizer

**Best Used For**: Hiring planning, budget allocation, or team restructuring decisions.

---

### 6. AI vs. Human ROI Calculator
**Purpose**: Assess automation risk and calculate AI tool ROI.

**Features**:
- Role replacement risk scoring
- AI skills premium calculator
- Tool investment break-even analysis
- Future-proofing recommendations

**Best Used For**: Career planning in the AI era, upskilling decisions, or team automation analysis.

---

### 7. Compensation Transparency Generator
**Purpose**: Create compliant salary bands and transparency materials.

**Features**:
- Salary band generator
- Job posting range writer (state-compliant)
- Pay equity analyzer (CSV upload)
- "We Pay Fair" badge creator

**Best Used For**: HR/People Ops teams implementing salary transparency, or companies building compensation frameworks.

---

### 8. LinkedIn Reality Check
**Purpose**: Analyze job postings for red flags and reasonableness.

**Features**:
- Job post analyzer (paste text)
- Reality check score (0-100)
- Red flag identification
- Screenshot-worthy insights for sharing

**Best Used For**: Job hunting, avoiding unrealistic positions, or viral social media content.

---

## 2026 Salary Benchmark Report

### Interactive Sections

1. **Geolocation Detection** - Automatically detects user's location using IP-based geolocation (ipapi.co) via edge function
2. **Interactive Salary Calculator** - Real-time percentile ranking with personalized insights
3. **Role Comparison Matrix** - Compare salaries across 30+ roles with filters
4. **Geographic Heatmap** - Visual salary data for 100+ cities globally
5. **Gender Pay Gap Dashboard** - Comprehensive pay equity analysis
6. **Industry Comparison** - Salary variations across 8 industries
7. **Experience Level Progression** - Career timeline with salary milestones
8. **State Deep Dive** - State-level exploration for USA and India
9. **Cost of Living Adjuster** - Purchasing power comparisons
10. **Remote Work Analyzer** - Remote vs on-site salary differentials
11. **Equity Calculator** - Stock options and equity valuation

### Data Sources

All salary data is sourced from:
- **2026 Global Marketing & Sales Operations Salary Benchmark Report**
- 20,000+ survey respondents
- 500K+ data points from SHRM
- 2M+ records from Glassdoor, Payscale, Levels.fyi
- 50K+ job postings analyzed
- 15+ countries covered (USA, Canada, UK, Germany, France, Netherlands, India, Singapore, Australia, UAE, and others)
- State-level data for USA (all 50 states) and India (15+ major cities)

### Geographic Coverage

**United States**: State-level breakdown for all 50 states plus 100+ cities
**India**: 15+ major cities including Bangalore, Mumbai, Delhi NCR, Hyderabad, Pune, Chennai, Kolkata, Ahmedabad
**International**: UK, Germany, France, Netherlands, Singapore, Australia, Canada, UAE

## Methodology

**Percentile Calculations**:
- P25 (25th percentile): Entry-level or below-market
- P50 (50th percentile): Market median
- P75 (75th percentile): Above-market
- P90 (90th percentile): Top performers

**Location Adjustments**:
- Cost of living indices for 100+ cities globally
- Remote vs. on-site differentials
- International market multipliers
- State-level granularity for USA and India

**AI-Powered Features**:
- All AI tools use Lovable AI (gemini-2.5-flash)
- Prompts engineered for marketing/sales context
- Responses personalized to user inputs

## Technical Implementation

### Geolocation Detection
- **Edge Function**: `detect-location` uses ipapi.co API for IP-based geolocation
- **Fallback**: Defaults to San Francisco, CA if detection fails
- **Storage**: Location stored in localStorage to prevent repeated prompts
- **Privacy**: No PII stored, only country/state/city detection

### Interactive Components
All interactive sections are React components with:
- Real-time calculations
- LocalStorage persistence
- Mobile-responsive design
- Framer Motion animations
- Export functionality (CSV, PNG)

## Privacy & Security

- **No data storage**: Tool inputs are not saved to our database
- **Anonymous usage**: Tools work without authentication
- **Secure AI processing**: All AI requests use encrypted connections
- **No PII required**: Tools never ask for personally identifiable information
- **Geolocation**: IP-based detection only, no GPS or user-entered data

## Mobile Optimization

All tools are fully responsive and optimized for:
- Mobile browsers (iOS Safari, Android Chrome)
- Tablet devices (iPad, Android tablets)
- Touch-friendly interfaces
- Adaptive charts and visualizations

## API Access

Enterprise customers can access salary data programmatically via our API:
- `/api/v1/salary-data` - Market benchmarks by role/location
- `/api/v1/salary-calculator` - Percentile calculations
- Authentication via API key
- Rate limits: 1000 requests/day (Pro), 10,000/day (Enterprise)

Contact sales@utm.one for API access.

## Support

Questions or issues with salary tools?
- Email: support@utm.one
- Documentation: https://utm.one/docs
- Report accuracy issues: data@utm.one

---

**Last Updated**: January 2026  
**Version**: 2.0.0
