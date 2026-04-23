# ABA Formal Opinion 512: Generative Artificial Intelligence Tools (2024)

**Issued:** July 29, 2024  
**Issuing Body:** ABA Standing Committee on Ethics and Professional Responsibility  
**Source:** https://www.americanbar.org/content/dam/aba/administrative/professional_responsibility/ethics-opinions/aba-formal-opinion-512.pdf  
**PDF Mirror:** https://www.lawnext.com/wp-content/uploads/2024/07/aba-formal-opinion-512.pdf  

---

## Overview

ABA Formal Opinion 512 is the ABA's first formal ethics opinion addressing lawyers' use of generative artificial intelligence (GAI) tools. Issued July 29, 2024, it addresses the ethical obligations of lawyers when using GAI tools in legal practice. The opinion acknowledges GAI's rapid evolution and notes that updated guidance will likely be needed as the technology develops.

The opinion identifies six primary ethical obligations implicated by GAI use:
1. Competence (Rule 1.1)
2. Confidentiality (Rule 1.6)
3. Communication with clients (Rule 1.4)
4. Candor toward the tribunal (Rules 3.1, 3.3)
5. Supervisory responsibilities (Rules 5.1, 5.3)
6. Reasonable fees (Rule 1.5)

---

## Rule 1.1 — Competence

**Requirement:** Lawyers must provide competent representation and understand "the benefits and risks associated" with technologies used in practice.

**Key Holdings:**
- Lawyers need not become GAI experts but "must have a reasonable understanding of the capabilities and limitations" of any tool they use.
- Competency can be achieved through self-study, association with competent colleagues, or consulting subject matter experts.
- Uncritical reliance on GAI-generated content constitutes a malpractice risk.
- Independent verification requirements are fact-specific and task-dependent: document review requires more verification than idea generation.
- GAI tools cannot solely substitute for competent legal work.
- Comment 8 to Rule 1.1 requires lawyers to keep current with changes in law and practice "including the benefits and risks associated with relevant technology."
- Currently, GAI competence is not yet required for competent representation, but this is likely to change.

**Audit Implications:**
- Does the legaltech tool disclaim its limitations clearly?
- Is the underlying model identified to end users?
- Are outputs framed as requiring attorney verification, not as final legal conclusions?

---

## Rule 1.6 — Confidentiality of Information

**Primary Duty:** Protect all information relating to client representation without informed consent, except where disclosure is impliedly authorized or permitted by exception.

**Self-Learning GAI Tools — Critical Concern:**
Self-learning tools learn from input data, "raising the risk that information relating to one client's representation may be disclosed improperly" to future users or through the model's outputs.

**Informed Consent Requirements:**
- Client informed consent is required before inputting client information into self-learning tools.
- Boilerplate waivers in engagement letters are **insufficient**.
- Non-self-learning tools used for idea generation without client data input do not require consent.

**What Informed Consent Must Include:**
1. Best judgment on why the tool is being used
2. Extent and specific information about risks
3. Particulars about what client information will be disclosed
4. Explanation of how others might use information against client interests
5. Clear explanation of benefits to representation
6. Explanation of risk that later users will access client information

**Due Diligence Requirements:**
Lawyers should:
- Read and understand terms of use, privacy policies, and contractual terms of any GAI tool
- Consult colleagues or external experts who have analyzed these terms
- Consult IT professionals or cybersecurity experts for risk evaluation

**Audit Implications:**
- Is client data sent to third-party AI APIs (OpenAI, Anthropic, Google)?
- Is there a Data Processing Agreement (DPA) or Business Associate Agreement (BAA)?
- Does the tool's privacy policy permit training on user inputs?
- Is client consent obtained before processing matter-specific data?
- Is there a data retention/deletion mechanism?

---

## Rule 1.4 — Communication with Clients

**Key Requirements:**
- Lawyers must "reasonably consult with the client about the means by which the client's objectives are to be accomplished."
- Lawyers must explain matters "to the extent reasonably necessary to permit a client to make an informed decision regarding the representation."
- Comment 5 requires fulfilling "reasonable client expectations for information consistent with the duty to act in the client's best interests."

**When Disclosure of GAI Use is Required:**
- Always disclose if the client asks.
- When inputting client information into GAI tools (informed consent required in advance).
- When GAI use affects fee basis or reasonableness.
- Other fact-specific circumstances requiring professional judgment.

**Best Practices:**
- Include GAI disclosure and any client instructions in engagement agreements.
- Determine disclosure necessity based on specific circumstances of each matter.

**Audit Implications:**
- Are AI-generated outputs clearly labeled as such in user-facing interfaces?
- Is there disclosure language in the tool's terms of service or UI?
- Can attorneys communicate GAI use to clients through the platform?

---

## Rules 3.1 and 3.3 — Meritorious Claims and Candor Toward the Tribunal

**Key Concern:**
The opinion addresses documented incidents of lawyers citing "nonexistent opinions, inaccurate analysis of authority, and use of misleading arguments" when using GAI.

**Judicial Response:**
Courts are responding by:
- Requiring disclosure of AI use in filings
- Sanctioning lawyers for misstatements and improper analysis generated by GAI
- Imposing certification requirements on AI-assisted work product

**Audit Implications:**
- Does the tool provide legal citations? If so, are they verified against authoritative sources?
- Does the tool disclaim that citations require independent verification?
- Is there a RAG system grounding outputs in verified legal databases, or are citations generated from model weights alone?

---

## Rules 5.1 and 5.3 — Supervisory Responsibilities

**Managerial Obligations:**
Supervisory lawyers must make "reasonable efforts to ensure that the firm's lawyers and nonlawyers comply with their professional obligations when using GAI tools."

**Implementation Requirements for Firms:**
- Establish clear policies on permissible GAI use
- Training on tool usage
- Training on ethical issues
- Training on confidentiality protection best practices
- Training on secure data handling and privacy concerns
- Reference checks and vendor credentials for third-party tools
- Conflicts check systems to screen for client adversity
- Ensure vendor contracts provide legal remedies for violations

**Audit Implications:**
- Is there a human-in-the-loop requirement for AI outputs that reach clients?
- Does the tool support audit trails for attorney supervision?
- Is there a review/approval workflow before AI-generated content is delivered to clients?
- Does the tool facilitate conflicts screening?

---

## Rule 1.5 — Reasonable Fees

**Hourly Billing:**
When using GAI, lawyers may only bill for actual time worked. 

**Key Prohibitions:**
- Lawyers "may not charge clients for time necessitated by their own inexperience."
- Lawyers may not charge clients for time spent learning a technology to be used for client matters generally.
- A fee charged for which little or no work was performed is an unreasonable fee.

**Exception:**
If a client specifically requests use of a particular AI tool for their matter, the lawyer may charge for learning to use that specific tool.

**On Tool Costs:**
Lawyers must analyze whether each GAI tool functions as overhead or as a billable client cost. Surcharges on actual tool costs are generally impermissible.

**Audit Implications:**
- Does the tool provide time-tracking or billing integration with AI usage metrics?
- Is there transparency in what AI operations were performed on a matter?

---

## Summary of Audit Checklist Derived from Opinion 512

| Obligation | Rule | Audit Check |
|-----------|------|-------------|
| Understand AI limitations | 1.1 | Tool disclaims limitations; model identified |
| Verify AI outputs | 1.1 | Independent verification mechanism exists |
| No training on client data | 1.6 | Privacy policy reviewed; opt-out of training available |
| Informed consent for data input | 1.6 | Consent workflow exists; boilerplate insufficient |
| Data security measures | 1.6 | Encryption, access controls, DPA in place |
| Disclose AI use to clients | 1.4 | AI-generated content labeled; disclosure in engagement terms |
| Verified legal citations | 3.3 | RAG or verification layer prevents hallucinated citations |
| Human supervision workflow | 5.3 | Review layer before client-facing AI outputs |
| Conflicts screening | 5.3 | Conflicts check before matter data processing |
| Reasonable fees | 1.5 | No billing for AI-generated time savings passed to client |
