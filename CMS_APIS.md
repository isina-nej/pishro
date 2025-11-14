# CMS Landing Pages APIs

## 1. Home Landing

### GET `/api/admin/home-landing`
**Input:** `?page=1&limit=20&published=true|false`
**Output:** Paginated list of HomeLanding

### POST `/api/admin/home-landing`
**Input:**
```json
{
  "heroTitle": "string",
  "heroSubtitle": "string?",
  "heroDescription": "string?",
  "heroVideoUrl": "string?",
  "heroCta1Text": "string?",
  "heroCta1Link": "string?",
  "overlayTexts": "string[]",
  "statsData": "Json",
  "whyUsTitle": "string?",
  "whyUsDescription": "string?",
  "whyUsItems": "Json",
  "newsClubTitle": "string?",
  "newsClubDescription": "string?",
  "metaTitle": "string?",
  "metaDescription": "string?",
  "metaKeywords": "string[]",
  "published": "boolean",
  "order": "number"
}
```
**Output:** Created HomeLanding

### GET `/api/admin/home-landing/:id`
**Input:** `id` (path param)
**Output:** Single HomeLanding

### PATCH `/api/admin/home-landing/:id`
**Input:** `id` (path param) + Partial HomeLanding fields
**Output:** Updated HomeLanding

### DELETE `/api/admin/home-landing/:id`
**Input:** `id` (path param)
**Output:** 204 No Content

---

## 2. Mobile Scroller Steps

### GET `/api/admin/mobile-scroller-steps`
**Input:** `?page=1&limit=20&published=true|false`
**Output:** Paginated list of MobileScrollerStep

### POST `/api/admin/mobile-scroller-steps`
**Input:**
```json
{
  "stepNumber": "number",
  "title": "string",
  "description": "string",
  "imageUrl": "string?",
  "gradient": "string?",
  "cards": "Json",
  "order": "number",
  "published": "boolean"
}
```
**Output:** Created MobileScrollerStep

### GET `/api/admin/mobile-scroller-steps/:id`
**Input:** `id` (path param)
**Output:** Single MobileScrollerStep

### PATCH `/api/admin/mobile-scroller-steps/:id`
**Input:** `id` (path param) + Partial MobileScrollerStep fields
**Output:** Updated MobileScrollerStep

### DELETE `/api/admin/mobile-scroller-steps/:id`
**Input:** `id` (path param)
**Output:** 204 No Content

---

## 3. About Page

### GET `/api/admin/about-page`
**Input:** `?page=1&limit=20&published=true|false`
**Output:** Paginated list of AboutPage (includes resumeItems, teamMembers, certificates)

### POST `/api/admin/about-page`
**Input:**
```json
{
  "heroTitle": "string",
  "heroSubtitle": "string?",
  "heroDescription": "string?",
  "heroBadgeText": "string?",
  "heroStats": "Json",
  "resumeTitle": "string?",
  "resumeSubtitle": "string?",
  "teamTitle": "string?",
  "teamSubtitle": "string?",
  "certificatesTitle": "string?",
  "certificatesSubtitle": "string?",
  "newsTitle": "string?",
  "newsSubtitle": "string?",
  "ctaTitle": "string?",
  "ctaDescription": "string?",
  "ctaButtonText": "string?",
  "ctaButtonLink": "string?",
  "metaTitle": "string?",
  "metaDescription": "string?",
  "metaKeywords": "string[]",
  "published": "boolean"
}
```
**Output:** Created AboutPage

### GET `/api/admin/about-page/:id`
**Input:** `id` (path param)
**Output:** Single AboutPage (includes resumeItems, teamMembers, certificates)

### PATCH `/api/admin/about-page/:id`
**Input:** `id` (path param) + Partial AboutPage fields
**Output:** Updated AboutPage

### DELETE `/api/admin/about-page/:id`
**Input:** `id` (path param)
**Output:** 204 No Content

---

## 4. Resume Items

### GET `/api/admin/resume-items`
**Input:** `?page=1&limit=20&aboutPageId=xxx&published=true|false`
**Output:** Paginated list of ResumeItem

### POST `/api/admin/resume-items`
**Input:**
```json
{
  "aboutPageId": "string",
  "icon": "string?",
  "title": "string",
  "description": "string",
  "color": "string?",
  "bgColor": "string?",
  "order": "number",
  "published": "boolean"
}
```
**Output:** Created ResumeItem

### GET `/api/admin/resume-items/:id`
**Input:** `id` (path param)
**Output:** Single ResumeItem

### PATCH `/api/admin/resume-items/:id`
**Input:** `id` (path param) + Partial ResumeItem fields
**Output:** Updated ResumeItem

### DELETE `/api/admin/resume-items/:id`
**Input:** `id` (path param)
**Output:** 204 No Content

---

## 5. Team Members

### GET `/api/admin/team-members`
**Input:** `?page=1&limit=20&aboutPageId=xxx&published=true|false`
**Output:** Paginated list of TeamMember

### POST `/api/admin/team-members`
**Input:**
```json
{
  "aboutPageId": "string",
  "name": "string",
  "role": "string",
  "image": "string?",
  "education": "string?",
  "description": "string?",
  "specialties": "string[]",
  "linkedinUrl": "string?",
  "emailUrl": "string?",
  "twitterUrl": "string?",
  "order": "number",
  "published": "boolean"
}
```
**Output:** Created TeamMember

### GET `/api/admin/team-members/:id`
**Input:** `id` (path param)
**Output:** Single TeamMember

### PATCH `/api/admin/team-members/:id`
**Input:** `id` (path param) + Partial TeamMember fields
**Output:** Updated TeamMember

### DELETE `/api/admin/team-members/:id`
**Input:** `id` (path param)
**Output:** 204 No Content

---

## 6. Certificates

### GET `/api/admin/certificates`
**Input:** `?page=1&limit=20&aboutPageId=xxx&published=true|false`
**Output:** Paginated list of Certificate

### POST `/api/admin/certificates`
**Input:**
```json
{
  "aboutPageId": "string",
  "title": "string",
  "description": "string?",
  "image": "string",
  "order": "number",
  "published": "boolean"
}
```
**Output:** Created Certificate

### GET `/api/admin/certificates/:id`
**Input:** `id` (path param)
**Output:** Single Certificate

### PATCH `/api/admin/certificates/:id`
**Input:** `id` (path param) + Partial Certificate fields
**Output:** Updated Certificate

### DELETE `/api/admin/certificates/:id`
**Input:** `id` (path param)
**Output:** 204 No Content

---

## 7. Investment Consulting

### GET `/api/admin/investment-consulting`
**Input:** `?page=1&limit=20&published=true|false`
**Output:** Paginated list of InvestmentConsulting

### POST `/api/admin/investment-consulting`
**Input:**
```json
{
  "title": "string",
  "description": "string",
  "image": "string?",
  "phoneNumber": "string?",
  "telegramId": "string?",
  "telegramLink": "string?",
  "coursesLink": "string?",
  "inPersonTitle": "string?",
  "inPersonDescription": "string?",
  "onlineTitle": "string?",
  "onlineDescription": "string?",
  "coursesTitle": "string?",
  "coursesDescription": "string?",
  "metaTitle": "string?",
  "metaDescription": "string?",
  "metaKeywords": "string[]",
  "published": "boolean"
}
```
**Output:** Created InvestmentConsulting

### GET `/api/admin/investment-consulting/:id`
**Input:** `id` (path param)
**Output:** Single InvestmentConsulting

### PATCH `/api/admin/investment-consulting/:id`
**Input:** `id` (path param) + Partial InvestmentConsulting fields
**Output:** Updated InvestmentConsulting

### DELETE `/api/admin/investment-consulting/:id`
**Input:** `id` (path param)
**Output:** 204 No Content

---

## 8. Investment Plans

### GET `/api/admin/investment-plans`
**Input:** `?page=1&limit=20&published=true|false`
**Output:** Paginated list of InvestmentPlans (includes plans, tags)

### POST `/api/admin/investment-plans`
**Input:**
```json
{
  "title": "string",
  "description": "string",
  "image": "string?",
  "minAmount": "number",
  "maxAmount": "number",
  "amountStep": "number",
  "metaTitle": "string?",
  "metaDescription": "string?",
  "metaKeywords": "string[]",
  "published": "boolean"
}
```
**Output:** Created InvestmentPlans

### GET `/api/admin/investment-plans/:id`
**Input:** `id` (path param)
**Output:** Single InvestmentPlans (includes plans, tags)

### PATCH `/api/admin/investment-plans/:id`
**Input:** `id` (path param) + Partial InvestmentPlans fields
**Output:** Updated InvestmentPlans

### DELETE `/api/admin/investment-plans/:id`
**Input:** `id` (path param)
**Output:** 204 No Content

---

## 9. Investment Plan Items

### GET `/api/admin/investment-plan-items`
**Input:** `?page=1&limit=20&investmentPlansId=xxx&published=true|false`
**Output:** Paginated list of InvestmentPlan

### POST `/api/admin/investment-plan-items`
**Input:**
```json
{
  "investmentPlansId": "string",
  "label": "string",
  "icon": "string?",
  "description": "string?",
  "order": "number",
  "published": "boolean"
}
```
**Output:** Created InvestmentPlan

### GET `/api/admin/investment-plan-items/:id`
**Input:** `id` (path param)
**Output:** Single InvestmentPlan

### PATCH `/api/admin/investment-plan-items/:id`
**Input:** `id` (path param) + Partial InvestmentPlan fields
**Output:** Updated InvestmentPlan

### DELETE `/api/admin/investment-plan-items/:id`
**Input:** `id` (path param)
**Output:** 204 No Content

---

## 10. Investment Tags

### GET `/api/admin/investment-tags`
**Input:** `?page=1&limit=20&investmentPlansId=xxx&published=true|false`
**Output:** Paginated list of InvestmentTag

### POST `/api/admin/investment-tags`
**Input:**
```json
{
  "investmentPlansId": "string",
  "title": "string",
  "color": "string?",
  "icon": "string?",
  "order": "number",
  "published": "boolean"
}
```
**Output:** Created InvestmentTag

### GET `/api/admin/investment-tags/:id`
**Input:** `id` (path param)
**Output:** Single InvestmentTag

### PATCH `/api/admin/investment-tags/:id`
**Input:** `id` (path param) + Partial InvestmentTag fields
**Output:** Updated InvestmentTag

### DELETE `/api/admin/investment-tags/:id`
**Input:** `id` (path param)
**Output:** 204 No Content
