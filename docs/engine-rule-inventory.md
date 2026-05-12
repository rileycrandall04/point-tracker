# MWA Point Tracker: Compensation Engine Rule Inventory

**Document Purpose:** Exhaustive mapping of every rule, constant, and magic number affecting point calculations. Organized by mental category with file:line citations for code navigation.

**File Size Context:** ~26,363 lines total. Single-file (~26K-line) monolithic architecture.

**Key Callout:** Many constants are "hidden" — baked into expressions rather than defined as named constants. These are flagged as "HIDDEN" and must be hoisted into `ENGINE_CONFIG` during refactoring.

---

## 1. COMPENSATION ARCHETYPES (Base Shift Categories)

Define the fundamental shift types, their AR rates, pager windows, and eligibility rules.

### 1.1 Shift Type Definitions (DEFAULT_SHIFT_RULES)

**File:** `index.html:7873-7923`  
**Status:** Currently in a global constant; per-site overridable via `shiftRulesOverride`.

| Shift Type | Label | AR Rate Mode | Pager Window (min) | Unrestricted Call | Overridable | Notes |
|---|---|---|---|---|---|---|
| `OR` | OR / General | `general` (20/hr) | None | None | Yes | 80-pt minimum weekday non-holiday (pre-call) |
| `OR_float` | General OR - Float | `general` (20/hr) | None | None | Yes | +30 pt float bonus |
| `OB_restricted` | UVH OB | `ob` (13/hr) | None | None | Yes | Doubles non-OR case points; no pager |
| `cardiac_liver` | Cardiac / Liver | `general` (20/hr) | WD: 1020-1860, WE: 420-1860 (14 hrs WD / 24 hrs WE) | None | Yes | **Auto +45 pt subspecialty bonus** |
| `mole` | Mole | `general` (20/hr) | WD: 1020-1860, WE: 420-1860 | WD: after 1140, WE: all | Yes | No evening minimum |
| `1st_call` | 1st Call | `general` (20/hr) | WD: 1020-1860, WE: 420-1860 | WD: after 1020, WE: all | Yes | Pager + unrestricted call |
| `2nd_call` | 2nd Call | `general` (20/hr) | WD: 1020-1860, WE: 420-1860 | WD: after 1020, WE: all | Yes | Pager + unrestricted call |
| `3rd_call` | 3rd Call | `general` (20/hr) | WD: 1020-1860, WE: 420-1860 | WD: after 1020, WE: all | Yes | Pager + unrestricted call |
| `4th_call` | 4th Call | `general` (20/hr) | WD: 1020-1860, WE: 420-1860 | WD: after 1020, WE: all | Yes | Pager + unrestricted call |
| `endo` | Endo | `general` (20/hr) | WD: 1020-1860, WE: 420-1860 | WD: after 1020, WE: none | Yes | Limited weekend unrestricted |
| `SF1` | SF 1 | `sf1` (13 WD day / 20 else) | WD: 1020-1860, WE: 420-1860 | WD: after 1020, WE: all | Yes | Fractional doubling 07:00-17:00 WD non-holiday (from 2026-04-27) |
| `SF2` | SF 2 | `general` (20/hr) | WD: 1020-1860, WE: 420-1860 | WD: after 1020, WE: all | Yes | Doubles non-OR case points |
| `ACS` | ACS | `general` (20/hr) | None | None | Yes | UVH-specific |
| `NORA` | NORA | `general` (20/hr) | None | None | Yes | No pager / unrestricted call |
| `pre_call` | Pre-Call | `general` (20/hr) | None | None | Yes | OR-rate morning overlay only |
| `CRNA_supervision` | CRNA Supervision | `general` (20/hr) | None | None | Yes | Base AR (20) + 7 pts/hr, minute-by-minute |
| `unrestricted_call_entry` | Unrestricted Call | `general` (20/hr) | None | None | Yes | Manual hours entry (3.5 pts/hr); no AR or case points |
| `forced_off` | UVH Forced Off | `general` (20/hr) | None | None | Yes | Fixed 56 pts (no calculation) |
| `vacation` | Vacation / Off | `general` (20/hr) | None | None | Yes | 0 points |

**Key Constants (Time Windows in minutes-from-midnight):**
- Pager windows stored as `{ weekday: { start, end }, weekend: { start, end } }` with times in minutes
- Example: `1020 = 17:00`, `1860 = 07:00 next day`, `420 = 07:00`
- Unrestricted call may be `'all'` (all hours) or `{ afterMin: nnnn }` (after a specific time)

**Hidden Constants in Pager Window Lookups:**
- File `index.html:8660`: `getPagerPayWindow()` checks for "Post" assignments (returns null)
- "Post SF1", "Post Call", "Post Mole" etc. receive **zero pager pay** (logic line 8662-8664)

---

### 1.2 AR Rate Modes & Calculation

**File:** `index.html:9284-9305` (getARRate function)

Base AR rates:
| Mode | Description | Base Rate | Usage |
|---|---|---|---|
| `general` | Standard OR/default | **20 pts/hr** | Most shifts |
| `ob` | OB style | **13 pts/hr** | UVH OB, SF1 (partial), inheriting sites |
| `sf1` | Spanish Fork OB split | **13 pts/hr (WD 07:00-17:00 non-holiday)**; **20 pts/hr** else | SF1 shifts |
| `none` | No AR rate | 0 | Custom flat-pay shifts |

**Time-of-day multipliers on base rate:**
- **Weekday 07:00-17:00 (daytime, `420-1020`):** No multiplier (×1.0)
- **Weekday 17:00-23:00 (evening, `1020-1380`):** ×1.10
- **Weekday 23:00-07:00 (night, `1380-420+1440`):** ×1.25
- **Weekend/Holiday daytime:** ×1.10
- **Weekend/Holiday night:** ×1.25

**File Reference:** Lines 9285, 9297-9303 contain the multiplier logic.

**Status:** Hardcoded HIDDEN constants in conditions. Must be extracted to ENGINE_CONFIG.

---

### 1.3 Pager Pay Rate

**Value:** **3.5 pts/hr** (unrestricted call equivalent)  
**File:** `index.html:8815`, `9359`, `9567`, etc.  
**Status:** HIDDEN constant — appears as inline `3.5` in many pager calculation expressions.  
**Addressable?** No — defined inline in 10+ calculation functions.

---

## 2. TIME MODIFIERS (Case Multipliers)

Applied to the **time component** of case points (not base units, not add-ons).

### 2.1 Physical Status & High-Risk Peds

**Function:** `getTimeMultiplier()` (index.html:9747-9759)

| Modifier | Weekday Day (07:00-17:00) | Weekday Eve (17:00-23:00) | Weekend Day | Else | Notes |
|---|---|---|---|---|---|
| P3 (default) | 1.0× | 1.0× | 1.0× | 1.0× | No multiplier |
| **P4** | **1.33×** | 1.0× | 1.0× | 1.0× | Cardiac risk |
| **P5** | **1.83×** | **1.5×** | **1.5×** | 1.0× | Critical risk; day multiplier is 1.83 (not 1.5) |
| **High-Risk Peds** | **1.33× (min)** | 1.0× | 1.0× | 1.0× | Minimum 1.33 on weekday day if P3 |

**File:** Lines 9752-9758  
**Status:** HIDDEN — numeric values baked into if/else conditions.

**Logic:**
- P4 on weekday day: override to 1.33
- P5 on weekday day: override to 1.83
- P5 on weekday eve or weekend day: override to 1.5
- High-risk peds: if weekday day AND current multiplier < 1.33, set to 1.33

---

## 3. PATIENT/CASE MODIFIERS

Applied to time points within a case.

### 3.1 Standard Case Points Formula

**File:** `index.html:9816-9925` (calcCasePoints function)

```
Total = Base + Time + Medical + Acute Pain + Emergency + Add-Ons
```

**Components:**
1. **Base Points:** `0.5 × baseUnits` (HIDDEN constant `0.5` at line 9894)
   - On shared case: `0.5 × baseUnits × (sharedStartupPct / 100)`
   - Default shared % is **50%** (line 9806, 9896)

2. **Time Points:** `caseHours × timeMultiplier × 6 pts/hr`
   - Time multiplier from section 2.1 (getTimeMultiplier)
   - **HIDDEN constant: 6 pts/hr** (line 9918, used as multiplier)

3. **Medical Proc Points:** `0.20 × medicalUnits` (if `isMedicalProc` flag set)
   - **HIDDEN: 0.20** at line 9919

4. **Acute Pain Points:** `0.375 × acutePainUnits` (if `isAcutePain` flag set)
   - **HIDDEN: 0.375** at line 9920

5. **Emergency Bonus:** **+1 point** if `isEmergency` (HIDDEN at line 9921)

6. **Add-On Points:** Nerve blocks, lines, etc. (see section 4)

7. **Production Multiplier:** Non-OR cases multiplied by 2.0 (OB shifts) or 1.0 (OR cases)
   - See section 11 for full doubling logic

---

## 4. ADD-ON POINTS

Discrete bonuses for procedures performed during a case.

### 4.1 Nerve Blocks & Regional Anesthesia

**File:** `index.html:9762-9775` (calcAddOnPoints)

| Add-On | Points | Code | Hidden? |
|---|---|---|---|
| Brachial Plexus Nerve Block | **3.0 pts** | `nerveBlock === 'brachial_plexus'` | Yes (9764) |
| Other Nerve Block | **2.6 pts** | `nerveBlock === 'other'` | Yes (9765) |
| IT Morphine (duplicate) | **3.0 pts** | `nerveBlock === 'it_morphine'` | Yes (9766) |
| IT Morphine (flag) | **3.0 pts** | `hasITMorphine` | Yes (9772) |

### 4.2 Monitoring & Vascular Access

| Add-On | Points | Condition |
|---|---|---|
| Central Line | **0.8 pts** | `hasCentralLine` |
| Arterial Line | **0.6 pts** | `hasArterialLine` |
| PAC (Pulmonary Artery Catheter) | **2.0 pts** | `hasPAC` |

### 4.3 Echocardiography

| Add-On | Points | Condition |
|---|---|---|
| TEE Add-On | **0.4 pts** | `hasTEEAddOn` |
| TEE Exam (standalone) | **22 pts** | `hasTEEExam` |

### 4.4 Epidural/Regional

| Add-On | Points | Condition |
|---|---|---|
| Thoracic Epidural | **3.75 pts** | `hasThoracicEpidural` |

**All values HIDDEN in calcAddOnPoints() at lines 9764-9773.**

---

## 5. FIXED-POINT PROCEDURES

Cases with hardcoded point values (no time/unit-based calculation).

**File:** `index.html:9819-9840` (case type branches in calcCasePoints)

| Procedure | Points | Case Type | Notes |
|---|---|---|---|
| ICU/ER Lines Call-In Bonus | **30 pts** | `icu_er_lines` | Fixed; no time/units |
| Epidural Blood Patch | **5 pts** | `epidural_blood_patch` | Fixed |
| Emergency Intubation | **4 pts** | `emergency_intubation` | Fixed |
| Epidural Rounding (01996) | **3 pts per round** | `01996` | Multiplied by round count |
| Pain Rounding (99231) | **2 pts base** + bonus | `99231` | See 5.1 below |
| TEE Exam | **22 pts** | `tee` | Fixed |
| CRNA Supervision Block | **2.63 pts** | `supervision_block` | Fixed (line 9840) |

### 5.1 Pain Rounding (99231) Special Logic

**File:** `index.html:9824-9837`

- Base: **2 pts**
- **After 2026-04-01:** If NOT clocked in, add 10-minute AR bonus
  - 10-min AR = `(arRate × 10 / 60)` where arRate is standard for the shift type & time
  - Default arRate if no shift: **20 pts/hr** (HIDDEN at line 9833)

---

## 6. LABOR EPIDURAL

Tiered billing based on duration since placement.

**File:** `index.html:9854-9889` (standard epidural), `9792-9800` (handoff), `9779-9784` (tier logic)

### 6.1 Standard Labor Epidural

**Startup:** `2.5 pts` (= 5 base units × 50%) — HIDDEN at line 9884

**Tier Schedule (by elapsed hours):**
| Tier | Duration | Rate | Cumulative Hours |
|---|---|---|---|
| Startup | — | **2.5 pts** (fixed) | 0 |
| Tier 1 | 0–1 hr | **6 pts/hr** | 0–1 |
| Tier 2 | 1–2 hr | **3 pts/hr** | 1–2 |
| Tier 3 | 2+ hr | **1.5 pts/hr** | 2–24 (max 24 hrs total) |

**All values HIDDEN in laborEpiduralTierPoints() at lines 9781-9783.**

**Example:** 3-hour epidural = 2.5 + (1 × 6) + (1 × 3) + (1 × 1.5) = **13 pts**

**Calculation:** `calcCasePoints()` at line 9883-9887

**Production Multiplier:** Standard labor epidurals are NOT doubled on OB shifts (unlike non-OR cases). Handoff epidurals ARE doubled if applicable (line 9878).

### 6.2 Handoff Labor Epidural (isSharedLabor)

**File:** `index.html:9871-9879`

When a case is marked `isSharedLabor` with `laborInitialStart` time:
- Calculate total elapsed time since **original placement**
- **Covering physician** gets tiers from `laborInitialStart` to their `endTime`
- **Other party** gets tiers from 0 to `laborInitialStart` (via `calcOtherPartyPoints()` at line 9798)
- Both multiplied by production multiplier (full ×2 if OB shift)

---

## 7. MINIMUMS

Guaranteed minimum point floors applied under specific conditions.

### 7.1 Pre-Call OR Minimum

**Condition:** Shifts with `preCallStart`/`preCallEnd` on weekday non-holidays (not mole/SF1/SF2)

**Value:** **80 pts** (= 4 hours × 20 pts/hr OR rate)

**File:** `index.html:9466-9468`, `9687-9689`

**Status:** HIDDEN constants (`20 * 4`)

**Application:** Takes the max of actual pre-call AR and 80 pts.

### 7.2 Evening Minimum (Post-Call/OB Shifts)

**Condition:** Weekday non-holiday, evening portion (after pre-call), excluding mole/SF1/SF2

**Values:**
- **OB-style shifts (mode='ob'):** **52 pts** (= 4 hours × 13 pts/hr)
- **General shifts:** **80 pts** (= 4 hours × 20 pts/hr)

**File:** `index.html:9471-9474`, `9522-9525`, `9692-9695`, `9738-9741`

**Status:** HIDDEN `13 * 4` and `20 * 4`

**Logic:** Takes max of actual evening AR and the applicable minimum.

### 7.3 Daily Minimum (No Pre-Call Split)

**Condition:** Clocked-in shift on weekday non-holiday, no pre-call range, excluding mole/SF1/SF2

**Values:** Same as evening minimum (52 or 80 pts).

**File:** `index.html:9521-9526`

---

## 8. PAGER / UNRESTRICTED CALL

Stand-by compensation when not clocked in.

### 8.1 Pager Pay

**Rate:** **3.5 pts/hr** (HIDDEN; see section 1.3)

**Window:** Per-shift-type pager window (see 1.1 Shift Type Definitions)

**Calculation:** `(pagerWindow.end - pagerWindow.start) / 60 × 3.5` (file 8815)

**Per-Shift Override:** `shift.unrestrictedCallHours` — if set, pays `hours × 3.5` instead of rule window.

**Gaps in Timeline:** If shift spans midnight or gaps exist in time entries, pager pay covers full designated window regardless.

---

### 8.2 Unrestricted Call Eligibility

**Function:** `isUnrestrictedCallEligible()` (index.html:8648-8655)

**Concept:** Minutes eligible for 3.5 pts/hr pay when clocked in (e.g., after 17:00 on certain shift types).

**Rules:**
- Must be within the shift's `unrestrictedCall.weekday` or `.weekend` window
- Window may be `'all'` (all hours), `{ afterMin: nnnn }` (after a time), or null (not eligible)

**File:** Line 8651-8654

**Status:** Logic hardcoded; times not extracted.

---

### 8.3 Unrestricted Call Entry Shifts

**Shift Type:** `unrestricted_call_entry`

**Concept:** Sites like "Other" where users manually enter unrestricted call hours.

**Pay:** `hours × 3.5 pts/hr` (no AR points, no case points)

**Flag:** `rule.unrestrictedCallEntry: true`, `rule.noProductivity: true`

**File:** `index.html:7920`

---

## 9. OB RULES

Obstetric-specific compensation logic.

### 9.1 OB Shift Detection

**Function:** `shiftIsOBStyle()` (index.html:8680-8684)

Returns **true** if:
- Shift type is `OB_restricted` (UVH OB), **OR**
- Resolved shift rule has `arRate.mode === 'ob'`

**Purpose:** Determines eligibility for production doubling and 13-pt/hr base AR rate.

### 9.2 OB Doubling (Non-OR Cases)

**Function:** `shiftDoublesProduction()` (index.html:8692-8697)

Returns **true** if shift is OB-style **AND** case is not marked `isORCase`.

**Multiplier:**
- **OB_restricted, SF2:** Full ×2 doubling
- **SF1 (after 2026-04-27):** Fractional ×1.0 to ×2.0 based on case time overlap with 07:00-17:00 weekday non-holiday window
- **SF1 (before 2026-04-27):** No doubling (×1.0)
- **Per-site OB-inheriting shifts:** Check rule `productionMultiplier` field

**File:** Lines 8792-8809 (`caseProductionMultiplier`)

### 9.3 SF1 Fractional Doubling

**Cutover Date:** `2026-04-27` (HIDDEN constant at line 8750)

**Window:** 07:00–17:00 weekday non-holiday only

**Calculation:** Pro-rate based on case start/end time:
- If entire case within window: ×2.0
- If partly within: ×(1 + fractionInWindow) e.g., ×1.5
- If outside window: ×1.0

**Implementation:** `_sf1DoubledMinutes()` counts overlapping minutes, `caseProductionMultiplier()` computes ratio (line 8804-8806)

**Pre-Cutover (Before 2026-04-27):** SF1 returns ×1.0 (no doubling for historical consistency, line 8797)

---

### 9.4 OB-Specific Bonuses

**Cardiac/Liver Subspecialty:** 
- Shift type `cardiac_liver` automatically includes **+45 pts** (section 10.3)
- OR per-site cardiac/liver shift with rule flag `cardiacBonus: true` or `liverBonus: true`

**Labor Epidural Doubling:** 
- On UVH OB (`OB_restricted`): labor epidural points are ×2
- On SF1/SF2: labor epidural points are ×1 (no doubling)
- File line 9888, 9878

---

## 10. FLOAT / LUMP-SUM BONUSES

Fixed bonuses and flat-pay rules.

### 10.1 Float Bonus

**Shifts:** `OR_float` and per-site inheritors

**Value:** **+30 pts** (HIDDEN in DEFAULT_SHIFT_RULES at line 7875)

**Applicability:** `floatBonus` field in resolved shift rule (line 8200, 10201)

**Trigger:** Automatic if shift rule has `floatBonus: number` field set.

---

### 10.2 Forced Off / Vacation

**Forced Off:**
- Shift type `forced_off` OR `shift.forcedOff` flag
- Fixed: **56 pts** (HIDDEN at line 9343, 9551)

**Vacation:**
- Shift type `vacation`
- Fixed: **0 pts**

---

### 10.3 Cardiac/Liver Subspecialty Bonus

**Condition:** Shift type `cardiac_liver` OR per-site with `cardiacBonus: true` / `liverBonus: true`

**Base Bonus:** **+45 pts** (HIDDEN at line 10143)

**TEE Overlay:** Plus **22 pts per TEE count** (line 10144)

**Total Subspecialty:** `45 + (teeCount × 22)`

**Pager Window for cardiac_liver:**
- Weekday: 1020–1860 (14 hours = 49 pts pager at 3.5/hr)
- Weekend: 420–1860 (24 hours = 84 pts pager at 3.5/hr)
- **Total Base (pager + subspecialty):** 94 pts weekday, 129 pts weekend

**File:** `index.html:10139-10145`

---

### 10.4 CRNA Supervision Overlay

**Condition:** Shift type `CRNA_supervision` OR overlay on OR/SF1/SF2

**Rate:** Base AR rate (20 or 13 pts/hr depending on mode) **+ 7 pts/hr** (HIDDEN at line 10110)

**Minute-by-Minute:** Calculated for each clocked minute (line 10108-10111)

**File:** `index.html:10086-10114`

---

### 10.5 Flat Payment Rule (No Productivity)

**Function:** `getFlatPaymentRule()` (index.html:8632-8643)

**Concept:** Shifts with `noProductivity: true` and `flatPoints > 0` (and NOT `unrestrictedCallEntry`) receive fixed points instead of calculated AR + cases.

**File:** 8642 checks: `rule.noProductivity && rule.flatPoints > 0 && !rule.unrestrictedCallEntry`

**Usage:** E.g., some fixed-duty shifts that don't track time entries.

---

## 11. BLENDING / PRODUCTION

Month-to-month compensation smoothing and per-point value.

### 11.1 Stabilization Weights

**Concept:** Current month's paycheck is a 5-month rolling average.

**Weights:** `[0.10, 0.40, 0.25, 0.15, 0.10]` (HIDDEN array at line 15994, 16598, 17697, 17745, 18502, 19060)

**Interpretation:** For month M:
- **M-2:** 10%
- **M-1:** 40%
- **M (current):** 25%
- **M+1 (projected):** 15%
- **M+2 (projected):** 10%

**File Locations:**
- `calcPaycheckForMonth()` at 15994
- `projectCurrentMonthPoints()` at 17697
- `getPaycheckForCurrentMonth()` at 18502
- Paycheck breakdown at 19060

**Status:** HIDDEN — array literal repeated in 5+ functions (no constant definition).

---

### 11.2 Point Value ($/point)

**Function:** `getPointValueForMonth(workKey)` (referenced at line 16003, 16006)

**Storage:** `settings.pointValues[workKey]` — user/site-specific, entered manually

**Default:** If not set, assumed 0 or derived from pooled compensation report

**Application:** `calcProduction = blended × pointValue`

---

### 11.3 Production Multiplier (Per-Shift)

**Field:** `rule.productionMultiplier` (numeric, optional)

**Effect:** Non-OR case points multiplied by this value (in addition to OB doubling)

**Example:** `productionMultiplier: 1.5` on a custom shift type

**File:** `index.html:8862-8863` (rule description), 8862 (application)

---

### 11.4 Stipend

**Function:** `getMonthlyStipendTotal(workKey)` (referenced at line 16005, 16007)

**Storage:** `data.stipends[workKey]` or per-site definition

**Application:** `calcPaycheck = calcProduction + stipend`

---

## 12. PAGER / CALL WINDOWS (Time References)

Hardcoded time boundaries used throughout the engine.

| Time | Mins | Meaning |
|---|---|---|
| 07:00 | **420** | Start of daytime window (used in 9748, 8736, 8720, 9285, 9749, 9750, 9833) |
| 17:00 | **1020** | End of daytime / start of evening (1048+ locations) |
| 23:00 | **1380** | End of evening / start of night (line 9749, 9302) |
| 07:00 next | **1860** | End of overnight pager window (standard pager end time; 1878+ in window defs) |

**Status:** HIDDEN — appears as literal numbers throughout; no constant definitions.

---

## 13. MISC / DISCOVERED

### 13.1 Shared Case Startup Percentage

**Default:** **50%** (HIDDEN at lines 9806, 9896)

**Field:** `caseData.sharedStartupPct` (user-entry override)

**Effect:** Base points on shared case = `0.5 × baseUnits × (sharedStartupPct / 100)`

**File:** `index.html:9804-9810`, `9895-9896`

---

### 13.2 Temporary Coverage Adjustments

**Function:** `calcTempCoveragePoints()` (index.html:10148-10176)

**Concept:** When a user is "covering" for someone else or "covered" by someone else, adjust pager pay ±3.5 pts/hr for the coverage duration.

**Types:**
- `'covered'`: Reduce pager by coverage hours × 3.5
- `'covering'`: Add pager by coverage hours × 3.5, plus AR for clocked time entries during coverage

**Rate:** **3.5 pts/hr** (HIDDEN at lines 10159, 10161)

---

### 13.3 Multi-Midnight Shift Handling

**File:** `index.html:9407-9414` (in calcARPoints)

**Concept:** Shifts spanning past midnight (call shifts) must have time entries offset by +1440 minutes per day to maintain ordering.

**Logic:** If `clockedRanges[i].start < clockedRanges[i-1].end`, add 1440 to both start and end of entry i until ordering is correct.

**Status:** Infrastructure rule; not a point constant, but affects minute-by-minute calculations.

---

### 13.4 Next-Shift Overlap Prevention

**Function:** `getNextShiftStartMin()` (index.html:9531-9540)

**Concept:** If a shift's clocked span extends into the next calendar day's shift, cap AR calculation at next shift's earliest clock-in time.

**Effect:** Prevents double-counting AR when back-to-back shifts exist.

**File:** Line 9425-9426

---

### 13.5 Effective Work Date Logic

**Function:** `effectiveWorkDate()` (index.html:8915-8940)

**Concept:** Overnight call shifts belong to "yesterday's" shift until 06:30; then advance to "today".

**Window:** Before 07:00 (420 mins) → yesterday; >= 06:40 and clocked early on call → still yesterday; after clock-in time or >= 07:00 → today.

**Impact:** Used to associate cases and time entries to correct shift date.

---

### 13.6 Post-Assignment Pager Nulling

**File:** `index.html:8661-8664`

**Rule:** Calendar assignments with labels matching `/^Post\s/i` (e.g., "Post SF1", "Post Call", "Post Mole") receive **0 pager pay** regardless of shift type.

**Status:** HIDDEN logic in getPagerPayWindow; not a numeric constant but an important rule.

---

### 13.7 Daily Minimum for Call Shifts

**Condition:** Weekday non-holiday clocked-in shifts (no pre-call split), mole/SF1/SF2 excluded

**Values:** **52 pts (OB)** or **80 pts (general)**

**File:** `index.html:9521-9526`

**Purpose:** Guarantees minimum compensation even for short shifts during business hours.

---

## 14. ADDRESSABILITY MATRIX

### Fully Addressable (Live in ENGINE_CONFIG or Overridable)

| Rule | Location | Override Path |
|---|---|---|
| Shift type definitions (AR mode, pager window, unrestricted call) | DEFAULT_SHIFT_RULES (7873) | shiftRulesOverride per site |
| Production multiplier per shift type | rule.productionMultiplier | shiftRulesOverride |
| Cardiac/Liver bonus toggle | rule.cardiacBonus / liverBonus | shiftRulesOverride |
| Float bonus | rule.floatBonus | shiftRulesOverride |
| Flat payment rule | rule.flatPoints, noProductivity | shiftRulesOverride |
| Unrestricted call entry mode | rule.unrestrictedCallEntry | shiftRulesOverride |
| Point value ($/pt) | settings.pointValues[workKey] | User entry |
| Stipend | data.stipends[workKey] | User entry |

### Hidden / Baked-In (Need Extraction)

| Rule | Current Form | File:Line | Extraction Priority |
|---|---|---|---|
| Base points multiplier (0.5) | Inline `0.5 *` | 9894, 7098, 9808 | HIGH |
| Time points rate (6 pts/hr) | Inline `* 6` | 9918, others | HIGH |
| Medical points multiplier (0.20) | Inline `0.20 *` | 9919 | HIGH |
| Acute pain multiplier (0.375) | Inline `0.375 *` | 9920 | HIGH |
| Emergency bonus (+1) | Inline `? 1 : 0` | 9921 | HIGH |
| Pager pay rate (3.5) | Inline `* 3.5` | 8815, 9359, 10159 | CRITICAL |
| Add-on point values (3.0, 2.6, 0.8, 0.6, 2.0, 0.4, 22, 3.75) | Inline `pts +=` | 9764-9773 | HIGH |
| Fixed-point procedure values (30, 5, 4, 3, 2, 22, 2.63) | Case switches | 9819-9840 | HIGH |
| Labor epidural tiers (2.5, 6, 3, 1.5) | Inline in tier loop | 9884-9887, 9781-9783 | HIGH |
| AR rate base values (20, 13) | Inline in getARRate | 9291-9295 | HIGH |
| Time-of-day multipliers (1.10, 1.25) | Inline in getARRate | 9298-9303 | HIGH |
| Weekday/evening/night boundaries (420, 1020, 1380) | Literals in conditions | 9748-9750, 9285, 9302 | CRITICAL |
| Pre-call minimum (80 pts = 4 hrs × 20) | `20 * 4` | 9468, 9689 | HIGH |
| Evening minimum (52 or 80 pts) | `13 * 4`, `20 * 4` | 9473-9474, 9522-9525 | HIGH |
| Subspecialty bonus (45 pts) | Inline | 10143 | HIGH |
| Forced-off bonus (56 pts) | Inline | 9343, 9551 | MEDIUM |
| CRNA supervision overlay (+7 pts/hr) | Inline `+ 7` | 10110 | MEDIUM |
| SF1 doubling cutover date (2026-04-27) | Const string | 8750 | LOW (date-based) |
| Stabilization month weights ([0.10, 0.40, 0.25, 0.15, 0.10]) | Repeated literal arrays | 15994, 16598, 17697, 17745, 18502, 19060 | HIGH (duplicated) |
| Shared case default % (50) | Inline `50` | 9806, 9896 | MEDIUM |
| Pain rounding 10-min AR bonus logic | Conditional after 2026-04-01 | 9827-9835 | LOW (date-based) |
| "Post" assignment pager exclusion | Regex test | 8664 | MEDIUM |

---

## 15. SUMMARY & RECOMMENDATIONS

### Critical Extraction Targets (Highest ROI)

1. **Pager rate (3.5 pts/hr)** — Used in 10+ functions, no single definition
2. **Time boundaries (420, 1020, 1380, 1860)** — Hardcoded throughout AR, case, and multiplier logic
3. **Multiplier constants (0.5, 6, 0.20, 0.375, 1, 1.10, 1.25)** — Scattered across case calculations
4. **AR base rates (20, 13)** — Central to all compensation; currently in getARRate only
5. **Stabilization weights** — Repeated 6× with no single definition
6. **All fixed-point values** — Procedure bonuses, pre-call/evening minimums scattered inline

### Recommended ENGINE_CONFIG Structure

```javascript
const ENGINE_CONFIG = {
  // Core rates
  AR: {
    base_general_pts_per_hr: 20,
    base_ob_pts_per_hr: 13,
    pager_pts_per_hr: 3.5,
    crna_supervision_overlay_pts_per_hr: 7,
  },
  
  // Time windows (minutes-from-midnight)
  TIME_WINDOWS: {
    daytime_start_min: 420,       // 07:00
    daytime_end_min: 1020,        // 17:00
    evening_start_min: 1020,      // 17:00
    evening_end_min: 1380,        // 23:00
    night_start_min: 1380,        // 23:00
    pager_default_end_min: 1860,  // 07:00 next
  },
  
  // Time multipliers
  MULTIPLIERS: {
    daytime_base: 1.0,
    evening_base: 1.10,
    night_base: 1.25,
    weekend_daytime: 1.10,
    p4_weekday_day: 1.33,
    p5_weekday_day: 1.83,
    p5_weekday_eve: 1.5,
    p5_weekend_day: 1.5,
    high_risk_peds_min: 1.33,
  },
  
  // Case point multipliers
  CASE: {
    base_units_factor: 0.5,
    time_pts_per_hr: 6,
    medical_proc_factor: 0.20,
    acute_pain_factor: 0.375,
    emergency_bonus: 1,
    shared_case_default_pct: 50,
  },
  
  // Add-ons
  ADDONS: {
    nerve_block_brachial_plexus: 3.0,
    nerve_block_other: 2.6,
    it_morphine: 3.0,
    central_line: 0.8,
    arterial_line: 0.6,
    pac: 2.0,
    tee_addon: 0.4,
    tee_exam: 22,
    thoracic_epidural: 3.75,
  },
  
  // Fixed procedures
  FIXED_PROCEDURES: {
    icu_er_lines: 30,
    epidural_blood_patch: 5,
    emergency_intubation: 4,
    epidural_rounding_01996: 3,
    pain_rounding_99231_base: 2,
    tee_exam: 22,
    crna_supervision_block: 2.63,
  },
  
  // Labor epidural
  LABOR_EPIDURAL: {
    startup_pts: 2.5,
    tier_1_start_hr: 0,
    tier_1_end_hr: 1,
    tier_1_pts_per_hr: 6,
    tier_2_start_hr: 1,
    tier_2_end_hr: 2,
    tier_2_pts_per_hr: 3,
    tier_3_start_hr: 2,
    tier_3_max_hr: 24,
    tier_3_pts_per_hr: 1.5,
  },
  
  // Minimums
  MINIMUMS: {
    precall_or_weekday_non_holiday: 80,
    evening_ob_weekday_non_holiday: 52,
    evening_general_weekday_non_holiday: 80,
    forced_off: 56,
  },
  
  // Bonuses
  BONUSES: {
    float_or_float: 30,
    subspecialty_cardiac_liver: 45,
    subspecialty_tee_per_count: 22,
  },
  
  // Blending & production
  STABILIZATION: {
    month_weights: [0.10, 0.40, 0.25, 0.15, 0.10],
    months_lookback: 5,
  },
  
  // Cutover dates
  CUTOVER_DATES: {
    sf1_fractional_doubling_from: '2026-04-27',
    pain_rounding_ar_bonus_from: '2026-04-01',
  },
};
```

---

## 16. AUDIT TRAIL

- **Document Created:** 2026-05-12
- **Reference File:** `/home/user/point-tracker/index.html` (26,363 lines)
- **Landmarks Verified:** Compensation Rules (3680-3810), DEFAULT_SHIFT_RULES (7873-7923), getResolvedShiftRules (8452), adminRulesDraft UI (5639-6398)
- **Key Functions Analyzed:** calcCasePoints, calcARPoints, calcARBreakdown, getTimeMultiplier, getARRate, caseProductionMultiplier, laborEpiduralTierPoints, calcSupervisionPoints, calcSubspecPoints, calcTempCoveragePoints, calcShiftTotal
- **Completeness Check:** All 12 user categories + Misc covered; 100+ rules/constants documented with file:line citations.

