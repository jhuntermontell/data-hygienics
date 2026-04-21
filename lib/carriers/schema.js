// ============================================================================
// Carrier translation layer - shared type definitions
// ============================================================================
//
// JSDoc typedefs. The codebase is JavaScript (per CLAUDE.md), so these types
// exist only for editor tooling, IDE help text, and future readers - they are
// not enforced at runtime. The structural discipline they impose is what
// keeps the carrier data files, the mapping resolvers, and the readiness
// engine talking to each other in the same shapes.
//
// EVERY module in lib/carriers/* should import the type it produces or
// consumes via a JSDoc `@type` or `@param` annotation so that drifting from
// the canonical shape lights up in an editor.
// ============================================================================

/**
 * Metadata about a carrier whose questions we support.
 *
 * @typedef {Object} CarrierProfile
 * @property {('coalition'|'cowbell'|'travelers'|'beazley')} id
 *   Internal stable ID. Used as the carrier selector in the UI and as the
 *   dispatch key in engine.js.
 * @property {string} name
 *   Display name shown to the user (e.g., "Coalition").
 * @property {string} formName
 *   Official application name (e.g., "Coalition Cyber Policy Application").
 * @property {string} formVersion
 *   Form code + edition/version (e.g., "CYUSP-00NA-1022-01").
 * @property {string} lastVerified
 *   ISO date (YYYY-MM-DD). When we last re-verified these questions against
 *   the carrier's published application. Rendered on the UI and embedded in
 *   the proof pack so brokers can see whether the data is stale.
 * @property {string} accentColor
 *   Hex color used for per-carrier accent styling in the dashboard.
 * @property {string[]} sourceCitations
 *   Public URLs to the forms we extracted questions from. Rendered in the
 *   methodology / sources section for audit purposes.
 */

/**
 * One paraphrased carrier application question. All wording in `questionText`
 * MUST be rephrased in our own voice rather than copied verbatim from the
 * carrier's application form to avoid copyright issues. Preserve meaning.
 *
 * @typedef {Object} CarrierQuestion
 * @property {string} id
 *   Stable unique ID in the format `${carrierId}_${controlCategory}_${n}`.
 *   Used as the dispatch key into COALITION_MAPPINGS et al.
 * @property {('coalition'|'cowbell'|'travelers'|'beazley')} carrierId
 * @property {ControlCategory} controlCategory
 * @property {string} questionText
 *   Paraphrased carrier question. Never verbatim from the source form.
 * @property {('yes_no'|'yes_no_na'|'multiple_choice'|'free_text'|'multi_select'|'conditional')} responseType
 * @property {string[]} [responseOptions]
 *   For multiple_choice or multi_select only. Describes the set of legal
 *   answers the carrier accepts on the form.
 * @property {string} evidenceExpected
 *   Plain-English description of what the carrier wants as proof. Rendered
 *   in the evidence checklist below each control.
 * @property {('critical'|'high'|'medium'|'low')} denialRiskLevel
 *   How impactful a missing control is likely to be on binding. Used by the
 *   engine to compute denial risk flags and weight the readiness score.
 * @property {string} formSource
 *   Which specific form/section this question comes from. Embedded in the
 *   proof pack so brokers can cite the source.
 * @property {string} [notes]
 *   Free-text nuance about how underwriters typically evaluate this question.
 */

/**
 * The 12 canonical control categories used across all carriers. Keyed on
 * this enum so the engine and UI can group questions by category.
 *
 * @typedef {('mfa'|'edr'|'backups'|'incident_response'|'patching'|'logging_monitoring'|'security_awareness'|'privileged_access'|'email_security'|'encryption'|'vendor_risk'|'network_segmentation')} ControlCategory
 */

/**
 * One evidence artifact an underwriter may request. Evidence is
 * carrier-agnostic - the same "MFA enforcement screenshot" artifact satisfies
 * Coalition, Cowbell, Travelers, and Beazley MFA questions with per-carrier
 * requirement levels noted in `carrierRequirements`.
 *
 * @typedef {Object} EvidenceItem
 * @property {string} id
 *   Stable unique ID like `evidence_mfa_enforcement_screenshot`.
 * @property {ControlCategory} controlCategory
 * @property {string} artifactName
 *   Short human-readable name like "MFA enforcement policy screenshot".
 * @property {string} format
 *   What format the artifact should be in: "PNG/JPG screenshot", "CSV export",
 *   "PDF policy document", "Signed attestation letter".
 * @property {string} whereToFind
 *   Plain-English instructions for where to generate/export this artifact.
 *   Should include at least Microsoft 365 and Google Workspace paths where
 *   applicable. Rendered verbatim in the evidence checklist.
 * @property {{coalition: ('required'|'recommended'|'unspecified'), cowbell: ('required'|'recommended'|'unspecified'), travelers: ('required'|'recommended'|'unspecified'), beazley: ('required'|'recommended'|'unspecified')}} carrierRequirements
 *   Per-carrier requirement level. "unspecified" means the carrier's
 *   published materials do not explicitly require this artifact format, but
 *   market practice commonly requests it.
 * @property {string} detailUnderwritersLookFor
 *   What underwriters typically scrutinize on this artifact - the extra
 *   context that lets a small business owner actually prepare it well.
 */

/**
 * Full readiness output for one carrier against one assessment. This is the
 * structure rendered by the dashboard and serialized into the proof pack.
 *
 * @typedef {Object} CarrierReadinessResult
 * @property {string} carrierId
 * @property {('ready'|'gaps_exist'|'likely_denial')} overallReadiness
 * @property {number} readinessScore
 *   0-100. Start at 100, subtract penalties based on denial-risk weighting
 *   of each failing control. See engine.js for the exact math.
 * @property {ControlResult[]} controlResults
 *   One entry per carrier question. Indexed by controlCategory for UI
 *   grouping.
 * @property {DenialRiskFlag[]} denialRiskFlags
 *   Unmissable warnings rendered at the top of the dashboard. Only flags
 *   for `critical` or `high` failures show here - lower severities are
 *   surfaced inside the per-control accordion instead.
 * @property {EvidenceChecklistItem[]} evidenceChecklist
 *   Deduplicated list of evidence artifacts across all controls for this
 *   carrier, sorted by priority (artifacts for critical controls first).
 * @property {string} generatedAt
 *   ISO datetime when the result was computed. Embedded in the proof pack.
 */

/**
 * One assessment-to-carrier-question result. Every carrier question produces
 * exactly one ControlResult, even when the assessment had nothing to say
 * about it (in which case status is "not_assessed").
 *
 * @typedef {Object} ControlResult
 * @property {string} carrierQuestionId
 *   References CarrierQuestion.id so the UI can cross-reference.
 * @property {ControlCategory} controlCategory
 * @property {string} carrierQuestionText
 *   The paraphrased carrier question (copied from CarrierQuestion so the
 *   UI can render without a second lookup).
 * @property {string} userAnswerText
 *   The translated answer, phrased as the carrier would expect to see it
 *   (e.g., "Yes - MFA is enforced for email access").
 * @property {('pass'|'partial'|'fail'|'not_assessed')} status
 *   Pass: assessment clearly satisfies the carrier question.
 *   Partial: assessment satisfies the question for SOME scope but not all
 *            (e.g., MFA is enabled on some systems but not email).
 *   Fail: assessment clearly does NOT satisfy the question.
 *   Not assessed: the current assessment has no question that maps to this
 *                 carrier question. User must provide additional input.
 * @property {('critical'|'high'|'medium'|'low')} denialRiskLevel
 *   Inherited from the carrier question. Used for ordering and color coding.
 * @property {string[]} evidenceNeeded
 *   EvidenceItem.id values the user should collect for this control. The
 *   engine aggregates all per-control `evidenceNeeded` into the top-level
 *   `evidenceChecklist` for the dashboard.
 * @property {string} recommendation
 *   Plain-English action the user should take if the control is failing or
 *   partial. For passing controls this is a confirmation message.
 * @property {string} [notesForBroker]
 *   Optional extra context a broker would find useful when submitting this
 *   to the carrier. Embedded in the proof pack only.
 */

/**
 * High-severity warning surfaced prominently at the top of the dashboard.
 *
 * @typedef {Object} DenialRiskFlag
 * @property {ControlCategory} controlCategory
 * @property {('critical'|'high')} severity
 * @property {string} message
 *   The main user-facing warning, phrased plainly. Example: "Missing MFA on
 *   email is the number-one reason carriers deny SMB applications."
 * @property {string} carrierSpecific
 *   Which carrier(s) this specifically applies to. "All four carriers" for
 *   universal controls; otherwise a comma-separated carrier name list.
 * @property {string} [remediation]
 *   Optional short call-to-action describing the fix.
 */

/**
 * One row in the evidence checklist rendered below the readiness dashboard.
 * Persisted (for Phase 1) in localStorage so the user's checked state
 * survives page reloads.
 *
 * @typedef {Object} EvidenceChecklistItem
 * @property {string} evidenceItemId
 *   References EvidenceItem.id.
 * @property {ControlCategory} controlCategory
 * @property {string} artifactName
 * @property {string} format
 * @property {string} whereToFind
 * @property {('critical'|'high'|'medium'|'low')} priority
 *   Derived from the highest denial-risk level of any control this evidence
 *   supports.
 * @property {boolean} [collected]
 *   Whether the user has marked this item as collected. Populated from
 *   localStorage at render time; never stored in the raw engine output.
 */

/**
 * Context object passed to every mapping resolver. Bundles the assessment
 * data with a set of convenience helpers so resolver functions don't have
 * to re-scan sections for every lookup.
 *
 * @typedef {Object} ResolverContext
 * @property {Record<string, string|string[]>} answers
 *   Raw `responses` table data keyed by `question_key`.
 * @property {Array<{id: string, title: string, questions: Array<Object>}>} sections
 *   The industry's question sections as returned by getQuestionsForIndustry.
 * @property {string} industry
 *   The user's industry string from the assessment row.
 * @property {(slug: string) => (Object|null)} findBySlug
 *   Returns the first question in `sections` whose `tooltip.controlSlug`
 *   equals `slug`, or null if none. This is the cross-industry lookup that
 *   lets a Coalition resolver find "the MFA question for THIS user" without
 *   knowing whether they're on general, healthcare, legal, etc.
 * @property {(slug: string) => (string|string[]|undefined)} answerForSlug
 *   Shortcut: findBySlug(slug) → answers[question.key]. Returns undefined if
 *   either the question or the answer is missing.
 */
