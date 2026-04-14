

## Plan: Add UTM Templates and QR Codes Seed Data

### What
Insert seed data for UTM templates and QR codes so all dashboard tabs display content.

### Data to Insert

**6 UTM Templates** (linked to existing workspace):
- Social Media Campaign (facebook / social / summer2024)
- Email Newsletter (mailchimp / email / weekly-digest)  
- Google Ads (google / cpc / brand-search)
- Partner Referral (partner-site / referral / q1-partners)
- LinkedIn Content (linkedin / social / thought-leadership)
- Event Marketing (qr-code / offline / conference-2024)

**6 QR Codes** (linked to existing links):
- Summer Sale QR → summer24 link
- Product Launch QR → launch link
- Google Ads QR → gads1 link
- LinkedIn QR → li-thought link
- Event Booth QR → event-qr link
- Twitter Bio QR → tw-bio link

### Implementation
Use the database insert tool to add all records in two SQL statements. No code changes needed — the dashboard components already query these tables.

### Files Modified
None — data-only changes via SQL inserts.

