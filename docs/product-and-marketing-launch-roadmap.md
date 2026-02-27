# SheetCRM - Product & Marketing Launch Roadmap

**Last Updated**: February 26, 2026
**Status**: Ready for Launch
**Timeline**: Months 1-6

---

## Executive Summary

This roadmap outlines the product development and marketing strategy for SheetCRM from launch through the first 6 months of operation. The product is ~80% complete and ready for soft launch. Success is measured by user acquisition (500+ users), community engagement, and validated product-market fit.

**Key Milestone**: Launch by end of Week 2 (March 11, 2026)

---

## Phase 1: Launch Preparation (Week 1-2 | Feb 26 - Mar 11)

### Objective
Finalize the product and prepare all launch materials and marketing infrastructure.

### Status: In Progress

### Key Activities

#### Product (Engineering)
- [ ] Final QA and comprehensive testing
  - [ ] Test all CRUD operations (Contacts, Companies, Notes, Reminders)
  - [ ] Test OAuth flow end-to-end
  - [ ] Test Google Sheets sync bidirectional
  - [ ] Test dark mode toggle and persistence
  - [ ] Test mobile responsiveness (iOS Safari, Android Chrome)
  - [ ] Test error scenarios and recovery
  - [ ] Load testing (100+ concurrent users)
  - [ ] Performance testing (Lighthouse score > 85)

- [ ] Fix critical bugs found in testing
  - [ ] Document all issues
  - [ ] Prioritize by severity
  - [ ] Deploy fixes to staging
  - [ ] Re-test before production deploy

- [ ] Configure production environment
  - [ ] Set up production Google OAuth credentials
  - [ ] Configure Cloudflare Workers production domain
  - [ ] Set up environment variables (secrets)
  - [ ] Configure analytics (PostHog key)
  - [ ] Set up error tracking (optional: Sentry)
  - [ ] Set up uptime monitoring

- [ ] Prepare deployment checklist
  - [ ] Database schema final version
  - [ ] API version finalization
  - [ ] Backup and rollback procedures
  - [ ] Documentation for deployment

#### Marketing Assets (Content)

- [ ] Create landing page (teaser)
  - [ ] Single-page HTML with product teaser
  - [ ] Email signup form (Substack or ConvertKit)
  - [ ] Social media preview (OG tags, Twitter Card)
  - [ ] Call-to-action button
  - [ ] Deployed and live

- [ ] Write launch announcement blog post
  - [ ] Title: "Introducing SheetCRM: Free CRM on Google Sheets"
  - [ ] Content: Story, problem, solution, how to get started
  - [ ] Length: 1,500-2,000 words
  - [ ] SEO optimized
  - [ ] Vietnamese + English versions
  - [ ] Published on website blog

- [ ] Create product walkthrough video (1-2 minutes)
  - [ ] Demo login flow
  - [ ] Show contact creation
  - [ ] Show notes and reminders
  - [ ] Show Google Sheets sync
  - [ ] Finish with call-to-action
  - [ ] Uploaded to YouTube (unlisted initially)

- [ ] Prepare product screenshots (8-10 high-quality)
  - [ ] Dashboard overview
  - [ ] Contacts list
  - [ ] Contact detail view
  - [ ] Company view
  - [ ] Notes/activities timeline
  - [ ] Reminders
  - [ ] Dark mode version
  - [ ] Mobile version

- [ ] Create comparison document
  - [ ] Comparison table: SheetCRM vs Airtable vs Notion vs HubSpot
  - [ ] Feature comparison
  - [ ] Pricing comparison
  - [ ] Use-case fit

#### Marketing Infrastructure

- [ ] Set up email newsletter
  - [ ] Choose platform (Substack, ConvertKit, or Beehiiv)
  - [ ] Create welcome email template
  - [ ] Create email sequence (3 emails)
  - [ ] Add landing page signup form
  - [ ] Configure SMTP (if needed)

- [ ] Set up social media accounts
  - [ ] Create Facebook Business Page
  - [ ] Create Twitter/X account (optional)
  - [ ] Create LinkedIn company page (optional)
  - [ ] Create Discord server (for community)
  - [ ] Configure branding (logos, colors, bios)

- [ ] Set up analytics
  - [ ] Google Analytics 4 on website
  - [ ] PostHog configuration in app
  - [ ] Create dashboard for tracking KPIs
  - [ ] Set up alerts (error rate, traffic spike)

- [ ] Prepare GitHub documentation
  - [ ] Update README with marketing info
  - [ ] Create CONTRIBUTING.md (invite community)
  - [ ] Create CODE_OF_CONDUCT.md
  - [ ] Create ROADMAP.md (public)
  - [ ] Create GitHub Discussions forum
  - [ ] Tag with relevant topics (#crm, #google-sheets, #vietnam, #free-software)

#### Pre-Launch Announcements

- [ ] Write GitHub release notes (draft)
- [ ] Prepare announcement for target communities (drafts)
  - [ ] "Show HN" post (HackerNews)
  - [ ] Viblo announcement
  - [ ] Dev.to cross-post
  - [ ] ProductHunt (if applicable)

### Deliverables
1. Production-ready application deployed
2. Marketing landing page live
3. Email infrastructure ready (100+ welcome sequence prepared)
4. Social media accounts created
5. All marketing assets (blog post, video, screenshots)
6. GitHub documentation complete

### Success Criteria
- [ ] Zero critical bugs in staging environment
- [ ] All QA test cases passing
- [ ] Landing page live and optimized
- [ ] Email sequence tested and ready
- [ ] Social accounts created and branded
- [ ] Blog post ready for publish
- [ ] Video published on YouTube

---

## Phase 2: Soft Launch (Week 3-4 | Mar 12-25)

### Objective
Launch to early adopters, gather feedback, fix issues, establish initial community.

### Key Activities

#### Launch Day (Day 1)
- [ ] Deploy to production
  - [ ] Final verification of all systems
  - [ ] Database backup created
  - [ ] Rollback procedure tested
  - [ ] Announce in all channels simultaneously

- [ ] Announce across all channels
  - [ ] Publish GitHub release
  - [ ] Post on HackerNews ("Show HN")
  - [ ] Post on ProductHunt
  - [ ] Share on Twitter/LinkedIn
  - [ ] Send launch email
  - [ ] Post in Viblo with Vietnamese context
  - [ ] Post in Dev.to

- [ ] Monitor actively
  - [ ] Watch for error spikes
  - [ ] Monitor API response times
  - [ ] Check user feedback in real-time
  - [ ] Be available for support
  - [ ] Document issues for quick fixes

#### Week 3
- [ ] Engage with early users
  - [ ] Respond to all comments, messages, GitHub issues
  - [ ] Collect feedback via surveys (Google Form)
  - [ ] Interview 5-10 early users (30-min calls)
  - [ ] Record testimonials

- [ ] Fix critical issues
  - [ ] Daily standup on bug status
  - [ ] Deploy fixes as needed
  - [ ] Communicate fixes to users

- [ ] Create onboarding content
  - [ ] Publish "Getting Started" guide
  - [ ] Create 5-minute video walkthrough
  - [ ] Create FAQ document
  - [ ] Publish troubleshooting guide

- [ ] Engage in communities
  - [ ] Post in target Facebook groups
  - [ ] Join relevant Slack/Discord communities
  - [ ] Answer questions about CRM
  - [ ] Mention SheetCRM where relevant (non-spammy)

#### Week 4
- [ ] Analyze early user data
  - [ ] Track signups and growth rate
  - [ ] Analyze feature adoption
  - [ ] Calculate retention metrics (D1, D7)
  - [ ] Identify most common user journeys

- [ ] Feature quick-wins
  - [ ] Identify easiest improvements
  - [ ] Deploy 2-3 improvements (UI polish, missing labels, etc.)
  - [ ] Communicate improvements to users

- [ ] Publish user success story
  - [ ] Interview early user with positive feedback
  - [ ] Write case study (500-1000 words)
  - [ ] Share across channels

- [ ] Plan next phase
  - [ ] Review Week 3-4 data
  - [ ] Adjust roadmap based on feedback
  - [ ] Plan content for Month 2

### Deliverables
1. Product live in production with real users
2. 50-100 signups
3. 30-50 GitHub stars
4. Onboarding content published
5. User feedback collected and analyzed
6. First success story published

### Success Criteria
- [ ] 50+ signups in first 2 weeks
- [ ] 30+ GitHub stars
- [ ] No critical production bugs
- [ ] 40%+ Day-1 retention
- [ ] 5+ user interviews completed
- [ ] Positive sentiment in community feedback

### Metrics Tracked
| Metric | Target | Actual |
| --- | --- | --- |
| Signups (Week 3-4) | 50+ | _ |
| GitHub stars | 30+ | _ |
| Website traffic | 2,000+ visits | _ |
| Email subscribers | 50+ | _ |
| Day-1 retention | 40%+ | _ |
| Day-7 retention | 25%+ | _ |
| App uptime | 99.9%+ | _ |

---

## Phase 3: Growth & Engagement (Month 2-3 | Mar 26 - May 25)

### Objective
Scale user acquisition through content marketing, community engagement, and partnerships.

### Key Activities - Month 2 (Mar 26 - Apr 25)

#### Content Marketing
- [ ] Publish 4-5 blog posts (SEO-focused)
  - [ ] Post 1: "Cách quản lý khách hàng bằng Google Sheets" (How to manage customers with Sheets)
  - [ ] Post 2: "So sánh Airtable vs SheetCRM" (Comparison: Airtable vs SheetCRM)
  - [ ] Post 3: "CRM miễn phí cho freelancer" (Free CRM for freelancers)
  - [ ] Post 4: "Tăng repeat sales bằng CRM" (Increase repeat sales with CRM)
  - [ ] Post 5: "Cách setup SheetCRM trong 5 phút" (Setup SheetCRM in 5 minutes)

- [ ] Cross-publish on platforms
  - [ ] Publish same content on Viblo
  - [ ] Cross-post to Dev.to
  - [ ] Repurpose for LinkedIn articles

- [ ] Create video content
  - [ ] Product walkthrough (5 minutes)
  - [ ] Feature tutorial: Reminders (2 minutes)
  - [ ] Customer success story (3 minutes)

#### Community Engagement
- [ ] Host monthly Q&A session
  - [ ] Facebook group live Q&A (or AMA comment thread)
  - [ ] Advertise in advance
  - [ ] Record and share highlights

- [ ] Active participation in target communities
  - [ ] Answer questions in Freelancer Việt group
  - [ ] Share tips in e-commerce groups
  - [ ] Engage in Startup Việt Nam community
  - [ ] Contribution guidelines for GitHub

- [ ] Build email list
  - [ ] Create lead magnet (free CRM template)
  - [ ] Promote in blog posts
  - [ ] Target: 200+ subscribers by end of month

#### Partnerships
- [ ] Identify and reach out to micro-influencers (3-5)
  - [ ] Target creators in freelance/business/e-commerce space
  - [ ] Personalized outreach with value proposition
  - [ ] Offer: Feature guest post, product review, collaboration

- [ ] Partner with complementary tools (1-2)
  - [ ] Email/scheduling tools, accounting tools
  - [ ] Cross-promotion opportunities
  - [ ] Affiliate/referral setup (if applicable)

#### Community Building
- [ ] Launch Discord or Telegram community
  - [ ] Create channels: #announcements, #feedback, #help, #showcases
  - [ ] Invite early users
  - [ ] Target: 50+ members

#### Product Improvements
- [ ] Implement top 2-3 user-requested features
  - [ ] Prioritize by user demand and effort
  - [ ] Deploy with communication/fanfare

### Key Activities - Month 3 (Apr 26 - May 25)

#### Content Marketing
- [ ] Publish 4-5 more blog posts
  - [ ] Case studies (2)
  - [ ] Advanced guides (2)
  - [ ] Industry insights (1)

- [ ] Create comprehensive guide/ebook
  - [ ] Title: "Complete guide to CRM for Vietnamese SMEs"
  - [ ] Length: 5,000+ words
  - [ ] Free download to build email list

#### Video Content
- [ ] Publish 3-4 short video tutorials
  - [ ] Feature highlights
  - [ ] Troubleshooting tips
  - [ ] User interviews

#### Community Expansion
- [ ] Expand to international market (English)
  - [ ] Translate key content
  - [ ] Post on English communities (Reddit r/CRM, HackerNews, Indie Hackers)
  - [ ] Create English Discord channels

- [ ] Host first community event (optional)
  - [ ] Online workshop about CRM best practices
  - [ ] Invite early users to share their setup
  - [ ] Virtual networking

- [ ] Referral program launch
  - [ ] Design referral incentive (free features? swag?)
  - [ ] Promote to existing users
  - [ ] Track referral conversions

#### Partnerships & PR
- [ ] 3-5 more partnership outreaches
- [ ] Guest post on 2+ tech publications
- [ ] Feature requests to Viblo, Dev.to (editor picks)

#### Product Improvements
- [ ] Implement 2-3 more user-requested features
- [ ] Publish detailed roadmap for transparency
- [ ] Solicit community input on next priorities

### Deliverables
- 300-500 total signups
- 80-100 GitHub stars
- 200+ email subscribers
- 3-5 published blog posts
- 5+ video tutorials
- Community (Discord/Telegram) with 50+ members
- 2+ guest posts on external sites
- 2-3 new features implemented

### Success Criteria
- [ ] Reach 300+ signups by mid-Phase 3
- [ ] 80+ GitHub stars
- [ ] 200+ email list subscribers
- [ ] 2,000+ monthly blog visits
- [ ] 30%+ email open rate
- [ ] 25%+ Day-30 retention
- [ ] 3+ featured articles on publications
- [ ] 50%+ increase in organic traffic

### Metrics Tracked
| Metric | Month 2 Target | Month 3 Target |
| --- | --- | --- |
| Signups (monthly) | +150 | +150-200 |
| Total signups | 200 | 350-400 |
| GitHub stars | 50-60 | 80-100 |
| Email subscribers | 100 | 200+ |
| Blog visits | 1,000+ | 2,000+ |
| Active users | 80+ | 150+ |
| Community members | 30+ | 80+ |
| Organic traffic % | 40% | 60%+ |

---

## Phase 4: Scale & Sustainability (Month 4-6 | May 26 - Aug 26)

### Objective
Consolidate growth, establish sustainable engagement, validate product-market fit, and plan Phase 2.

### Key Activities

#### Product Development
- [ ] Implement top 5 user-requested features
  - [ ] Prioritize by user impact and complexity
  - [ ] Publish progress updates
  - [ ] Share credit with contributors

- [ ] Internationalization (i18n)
  - [ ] Support English language (UI + content)
  - [ ] Prepare for other languages (Vietnamese, English infrastructure)

- [ ] Monetization exploration (optional)
  - [ ] Survey users on paid tier interest
  - [ ] Design free vs. premium features
  - [ ] Plan pricing strategy (if pursuing)

#### Content & Marketing
- [ ] Scale content production
  - [ ] 2-3 blog posts per week (team or automation)
  - [ ] 1 video per week
  - [ ] Consistent social media presence

- [ ] Community expansion
  - [ ] Expand to 3+ international communities
  - [ ] Build partnerships in new markets

- [ ] Thought leadership
  - [ ] Publish ebook or comprehensive guide
  - [ ] Speaking opportunities at meetups/conferences
  - [ ] Podcast appearances (if applicable)

#### Community & Partners
- [ ] Build integration partners
  - [ ] Identify 5 complementary tools
  - [ ] Design integration opportunities
  - [ ] Partner with 2-3 (API, webhooks, etc.)

- [ ] Sponsor community events
  - [ ] Vietnamese tech meetups
  - [ ] Startup conferences
  - [ ] Online communities

- [ ] Community moderators/ambassadors
  - [ ] Identify active users who could help moderate
  - [ ] Empower them to support new users
  - [ ] Recognize contributions

#### Product-Market Fit Validation
- [ ] Conduct user satisfaction surveys
  - [ ] NPS survey (target: 50+)
  - [ ] Feature request analysis
  - [ ] Churn analysis

- [ ] Analyze data for insights
  - [ ] User cohort analysis (by source, signup date)
  - [ ] Feature usage patterns
  - [ ] Growth bottlenecks

- [ ] Plan Phase 2
  - [ ] Based on validated learnings
  - [ ] Community input + usage data
  - [ ] Technical debt vs. new features
  - [ ] Roadmap for next 6-12 months

#### Business Planning (Optional)
- [ ] Explore monetization options
  - [ ] Freemium model (current free + paid features)
  - [ ] Enterprise tier
  - [ ] Service offerings

- [ ] Funding/partnerships
  - [ ] Apply to accelerators (if pursuing capital)
  - [ ] Explore strategic partnerships
  - [ ] Open-source grant opportunities

### Deliverables
- 1,000+ total signups
- 150+ GitHub stars
- 400+ email subscribers
- 500+ active monthly users
- 5+ implemented features from roadmap
- Validated product-market fit metrics
- Detailed Phase 2 roadmap
- Community of 200+ active members

### Success Criteria
- [ ] Reach 1,000 total signups
- [ ] 150+ GitHub stars
- [ ] 400+ email subscribers
- [ ] 50%+ Day-30 retention rate
- [ ] 50+ NPS score
- [ ] Sustainable organic growth (no paid ads needed)
- [ ] Active community (10+ posts per week)
- [ ] 5+ new features shipped
- [ ] Phase 2 roadmap approved by community

### Metrics Tracked
| Metric | Month 4 | Month 5 | Month 6 |
| --- | --- | --- | --- |
| Total signups | 500-600 | 700-800 | 1,000+ |
| GitHub stars | 100-120 | 130-140 | 150+ |
| Email subscribers | 250+ | 300+ | 400+ |
| Monthly active users | 250+ | 350+ | 500+ |
| Day-30 retention | 45%+ | 50%+ | 50%+ |
| Organic traffic % | 70%+ | 75%+ | 80%+ |
| NPS score | 45+ | 50+ | 50+ |
| Community members | 150+ | 200+ | 250+ |

---

## Resource Allocation

### Phase 1: Launch Prep
- **Time**: 40-50 hours total
- **Team**: You (founder) — 100% focus
- **External Help**: Optional (designer for landing page, video editor)

### Phase 2: Soft Launch
- **Time**: 15-20 hours/week
- **Team**: You (founder/CEO) + optional community manager (5-10 hrs/week)
- **Focus**: User support, bug fixes, community engagement

### Phase 3: Growth
- **Time**: 10-15 hours/week
- **Team**: You (strategy/partnerships) + content creator (freelance, 5-10 hrs/week)
- **Focus**: Content marketing, partnerships, feature development

### Phase 4: Scale
- **Time**: 8-12 hours/week
- **Team**: You (strategy/product) + content team (2 people) + community manager (part-time)
- **Focus**: Product strategy, business planning, community management

### Budget
- **Phase 1**: $0 (free tools)
- **Phase 2**: $0-200/month (optional: domain, email service, video editor)
- **Phase 3**: $200-500/month (freelance writers, video editors)
- **Phase 4**: $500-1,000/month (community manager, scaling content)

---

## Risk & Mitigation

| Risk | Probability | Impact | Mitigation | Owner |
| --- | --- | --- | --- | --- |
| Low initial traction | Medium | High | Start with tight niche, ask for referrals, improve onboarding | Product |
| Product bugs discovered | High | Medium | Rapid iteration, transparent bug reporting, daily fixes Week 3-4 | Engineering |
| Market doesn't want free CRM | Low | High | Validate with 10+ user interviews, survey existing customers | Marketing |
| Competitor launches similar | Medium | Low | Build community loyalty, focus on support, faster iteration | Product |
| Founder burnout | Medium | Medium | Set boundaries (limited support), delegate, take breaks | Ops |
| Community goes silent | Medium | Low | Weekly content, Q&A sessions, user testimonials, highlight user wins | Community |
| GitHub stars plateau | Medium | Low | Expand to international markets, improve documentation, viral moments | Marketing |

---

## Success Definition & Metrics Summary

### Launch Success (Week 3-4)
- ✅ 50+ signups
- ✅ 30+ GitHub stars
- ✅ No critical production bugs
- ✅ Positive community feedback
- ✅ First 3 user interviews completed

### Phase 2 Success (End of Month 1)
- ✅ 300+ signups
- ✅ 80+ GitHub stars
- ✅ 50+ email subscribers
- ✅ 3+ published guides
- ✅ 40%+ Day-1 retention

### Phase 3 Success (End of Month 3)
- ✅ 500+ signups
- ✅ 100+ GitHub stars
- ✅ 200+ email subscribers
- ✅ 5+ featured articles
- ✅ Active community (50+ members)

### Phase 4 Success (End of Month 6)
- ✅ 1,000+ signups
- ✅ 150+ GitHub stars
- ✅ 400+ email subscribers
- ✅ 500+ monthly active users
- ✅ Product-market fit validated (50+ NPS)
- ✅ Sustainable organic growth

---

## Monitoring & Adjustment

### Weekly Review (Phase 1-2)
- [ ] Check signup rate and growth trend
- [ ] Review user feedback and GitHub issues
- [ ] Monitor app uptime and error rates
- [ ] Check social media engagement

### Bi-weekly Review (Phase 2-3)
- [ ] Growth metrics dashboard
- [ ] Content performance (blog, video, social)
- [ ] Community engagement metrics
- [ ] User retention analysis

### Monthly Review (All Phases)
- [ ] Full KPI dashboard review
- [ ] Cohort analysis (users by source)
- [ ] Feature usage analysis
- [ ] Roadmap adjustment based on data
- [ ] Celebration of wins and learning from losses

---

## Next Steps (Immediate)

1. **This Week**:
   - [ ] Finalize remaining QA issues
   - [ ] Deploy landing page
   - [ ] Set up email infrastructure
   - [ ] Create social media accounts

2. **Next Week**:
   - [ ] Finish all marketing assets
   - [ ] Final production deployment prep
   - [ ] Write launch announcement

3. **Launch Week** (Mar 12):
   - [ ] Deploy to production
   - [ ] Execute Phase 2 launch plan
   - [ ] Monitor actively
   - [ ] Engage with early users
