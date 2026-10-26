# Learning specialist report: how our people learn, and what moves them

Written 2026-10-26 for the Data Hygienics front-door and Path work. Scope: the
audiences as learners, the levers that produce action or avoidance, a critique
of the Clear Path model against the evidence, a step-writing template, the
return loop, and five testable hypotheses. No code was changed.

The one-paragraph version: our no-fear-mongering rule is not a style choice, it
is the evidence-based choice. Threat only moves people who already believe they
can act. Everything else below is about raising that belief (self-efficacy),
shrinking the first action until it is trivially doable, attaching it to a
moment, and giving people a visible, calm record of what they have already done.

## 1. The audiences as learners

All of them are adults learning something they did not sign up to learn, under
mild dread, in stolen minutes. Adult learners act on problems they have right
now, not on curricula, and they need to see why before they will do how.

**Parents of kids and teens.** Believe: "my kids know more about this than I
do." Fear: being out of their depth, and the one thing they did not know to
check. Want: a short list they can be confident is complete, and language for a
conversation. Ready moment: a school letter, a news story about a chatbot and a
teenager, a first phone. They respond to competence ("here is the one setting
that matters") and to conversation scripts, and they avoid anything that
implies they are already failing.

**Adult children helping an older parent.** Believe: "Mom is sharp, she would
never fall for it," or the opposite, "Dad will never change." Fear: a call that
sounds like them, and the guilt of not having set something up. Want: a plan
they can do with the parent, not to them, that preserves the parent's dignity.
Ready moment: the parent mentions a strange call, or a friend of theirs was
scammed. They respond to co-doing and to a physical object (the card by the
phone), and they avoid steps that make the parent feel managed.

**Older adults themselves.** The evidence cuts against the stereotype. In the
FTC's 2025 data, people 60 and over reported losing money at lower rates than
younger adults and filed far more no-loss reports, while the median loss for
people 80 and over rose 21% to $2,000 (FTC report to Congress on protecting
older adults, December 2025). Loneliness and low psychological well-being
predict susceptibility more than age does (Sur, DeLiema and Brown, Rush Memory
and Aging Project data, 2021). So the learner is capable, often more cautious
than their children, and the risk concentrates in isolation and in high-value
investment pitches. They respond to respect, to rules stated as "what a real
bank never does," and to being the one who teaches the family the rule. They
avoid anything that treats them as the weak link.

**Remote workers on personal devices.** Believe: "IT handles that," even when
there is no IT. Fear: being the person who caused the breach. Want: a clear
line between what is theirs and what is work's. Ready moment: a new job, a new
laptop, a phishing test at work. They respond to professional framing and
avoid anything that sounds like a lecture they already sat through.

**The owner or accidental IT person at a 1 to 50 person organization.** Believe:
"we're too small to be a target," and "I'll get to it." Fear: a wire sent to the
wrong place, and being asked by a client, insurer or auditor for something in
writing that does not exist. Want: to be done, with proof. Ready moment: an
invoice with changed bank details, a staff member pasting client data into a
chatbot, a questionnaire from a bigger customer. They respond to order (what
first), to artifacts (the one-page rule, the plan), and to time estimates they
can trust. They avoid frameworks, acronyms and anything that smells like a
sales funnel. Note the shadow-AI fact already on the site: 45% of employees
used AI regularly on work devices in Verizon's 2026 breach-report data, up from
15% a year earlier (Verizon 2026 DBIR Executive Summary, p. 12). This audience
is already behind its own staff, which is a motivator if we frame it as "catch
up in an hour," not "you have lost control."

What all five share: security fatigue is real and measured. In NIST's 2016
interview study, more than half of 40 participants showed resignation, loss of
control, fatalism and decision avoidance, and the authors' first prescription
was to reduce the number of security decisions a person has to make (Stanton,
Theofanos, Prettyman and Furman, IT Professional, September 2016). The Path's
job is to make decisions for people, in order, and to ask for one at a time.

## 2. The buttons

Three models explain most of what we need. COM-B says a behavior happens when
capability, opportunity and motivation are all present at the same time
(Michie, van Stralen and West, Implementation Science, April 2011). Fogg's
model says behavior happens when motivation, ability and a prompt converge, and
that raising ability (making it easier) is usually cheaper than raising
motivation (Fogg, Persuasive 2009). The extended parallel process model says a
threat message produces danger control (doing the protective thing) only when
perceived efficacy is high; when efficacy is low it produces fear control
(denial, avoidance, reactance) (Witte, Communication Monographs, 1992).

**Levers that produce movement**

- **Efficacy before threat, always.** In a re-analysis of fear-appeal studies,
  threat only had an effect under high efficacy (d = 0.31), and efficacy only
  had an effect under high threat (d = 0.71) (Peters, Ruiter and Kok, 2013,
  summarized in Kok et al., Health Psychology Review, 2018). Even the most
  fear-friendly meta-analysis, which found an average effect of d = 0.29 across
  248 samples, found larger effects when messages included efficacy statements
  and recommended one-time rather than repeated behaviors (Tannenbaum et al.,
  Psychological Bulletin, 2015). Our steps already lead with "why," then "do."
  The order should be: here is the thing you can do, then here is what it
  stops. Name the threat in one sentence, never more than the solution.
- **Implementation intentions.** An if-then plan ("when my phone shows the
  bank's name and the caller says 'fraud,' I hang up and call the card") raises
  goal attainment by d = 0.65 across 94 independent tests (Gollwitzer and
  Sheeran, Advances in Experimental Social Psychology, 2006). Our best steps
  are already if-then rules. Every step should end with one, stated as a
  sentence the reader can say aloud.
- **One-time setup over repeated vigilance.** The 2015 meta-analysis found
  one-time behaviors respond better than repeated ones, and the real-world
  data agrees: Google's auto-enrollment of more than 150 million accounts in
  two-step verification produced a 50% drop in compromised accounts among those
  users (Google Safer Internet Day post, February 2022). Prefer steps that are
  set once (passkey, auto-update, alerts, freeze) and label them as such.
- **Endowed progress.** People who received a loyalty card with two of ten
  stamps already filled completed it at 34% versus 19% for an empty eight-stamp
  card (Nunes and Drèze, Journal of Consumer Research, 2006). The quiz's "what's
  already in place" question is this lever; it should be more visible, and the
  first Path screen should show "3 of 11 already done" when it is true.
- **Fresh starts.** Goal-directed behavior rises after temporal landmarks: new
  weeks, months, birthdays, new years (Dai, Milkman and Riis, Management
  Science, 2014). The monthly note and "this week" framing fit this exactly;
  send on the first of the month or Monday, never mid-week.
- **Co-doing and social proof that fits a calm brand.** Descriptive norms about
  the closest group moved behavior most: a sign that most guests in this room
  reused towels beat a generic environmental appeal (Goldstein, Cialdini and
  Griskevicius, Journal of Consumer Research, 2008). We have no numbers to show
  yet and should not invent any. The calm version is "steps most families do
  first" and, once analytics exist, honest counts ("most households start with
  the safe word").
- **Self-efficacy from mastery, in small bites.** Belief in one's own ability
  grows most from successful performance (Bandura, Psychological Review, 1977).
  A step the reader completes in ten minutes, with a check they can pass, is a
  self-efficacy intervention. Make the first step the easiest, not the most
  important.

**Levers that produce avoidance**

- Threat without a doable response (the fear-control route in Witte's model).
  Statistics in the first screen, dollar losses, countdown language.
- Choice overload. Nine chips are fine because they are one question; nine
  sections of equal weight are not.
- Streaks, grades and scores on the home side. A missed week becomes a reason
  to quit. Lally and colleagues found that missing a single day did not
  reduce the chance of forming a habit (Lally et al., European Journal of
  Social Psychology, 2010), so our product should say so and never punish a gap.
- Jargon before trust. Awareness campaigns fail because they are information
  heavy, fear based, and inconsistent in what they ask people to do (Bada,
  Sasse and Nurse, 2015, and the 2025 follow-up by Bada and Nurse).
- Telling the older adult they are the problem. It is false and it produces
  reactance.

## 3. The Path against the evidence

**Keep**

- "Start with what you'd hate to lose." It anchors on value, not threat, which
  is the efficacy-first ordering.
- Four tellings of each step. Adults vary in how they want to learn; the choice
  itself is a sense of control, and control reduces fatalism.
- "Why" then "do" then "check." The check is the mastery experience.
- Outcomes counted, no composite score. Correct for the home audience.
- "What we cut." Reducing decisions is the NIST prescription, and saying "you
  don't need this" builds trust faster than any recommendation.
- The time budget question. A path that fits a real week is the ability lever.

**Change**

- The first result is eight screens away. Show the first step after the first
  chip, then offer the remaining questions as "make it fit." Ability first.
- The Path reads as a list of chores. Lead each stage with its end state (the
  Long View sentences already written), then the count of steps to get there.
  People move toward a picture of themselves, not away from a list.
- Steps carry "minutes" but not "set once or ongoing." Add that label. One-time
  steps get preference in week one.
- The "already in place" credit is a quiz question. Surface it on the first
  Path screen as endowed progress ("3 of 11 done before you started").
- Ambiguity about what "done" means. Each step needs a done ritual: tick the
  check, see the outcome counter move, read one calm sentence that names what is
  now true ("Your email now needs your face or your key. A password alone won't
  open it.").

**Add**

- A single if-then sentence at the end of every step, ready to say aloud or
  write on the card.
- A "do it with someone" flag on conversation steps, with a script of the first
  thing to say. Co-doing is the lever for the older-relative and parent
  segments.
- A gentle restart. When someone returns after weeks away, the path should say
  "nothing expired, here's your next step," not show a decayed streak.
- Honest social proof once data exists: "most homes start here." Never fabricated.
- A printable object at the end of the foundation stage. A card by the phone
  turns a decision into an environmental cue, which is the cheapest prompt
  there is.

## 4. How a step should be written

Template, in render order:

1. **Title as the action, in the reader's words.** Verb first, no jargon.
2. **What is true after** (one sentence, present tense). The end state for this
   step. This is the motivation line and it replaces the threat as the hook.
3. **Why it holds** (one or two sentences). Name the threat once, then say why
   the step does not depend on spotting anything.
4. **Set once or ongoing, and minutes.** A label, not prose.
5. **Do** (three to five numbered items). Exact settings. No item longer than
   two lines.
6. **Say this** (the if-then sentence). One line the reader can repeat.
7. **Check** (one observable test). Pass it and the step is done.
8. **If it feels awkward** (the newcomer note). Normalize the friction.
9. **Links**, below the fold.

Example, rewritten from `money-bank-callback` in `lib/content/path/home.js`.
The substance is unchanged; the order and framing are not.

> **Hang up on "your bank," then call the number on your card.**
>
> *After this:* a call that claims to be your bank can't move your money,
> because you never act on a call you didn't start.
>
> Caller ID can show your bank's name, and a scripted voice can know part of
> your card number. None of that is proof. The call you start is the only one
> you can trust, and that stays true however good the voice gets.
>
> Set once, then it's a habit. About 10 minutes.
>
> 1. Agree the rule with everyone in the house: a call about fraud means you
>    hang up and dial the number on your card or in the bank's app.
> 2. Agree three things a real bank never asks: move money to a "safe account,"
>    read a code, install an app.
> 3. Write the rule on the card by the phone if anyone at home answers unknown
>    calls.
>
> **Say this:** "If someone calls about fraud on my account, I'll hang up and
> call the number on my card."
>
> **Check:** ask one person at home what they'd do if the bank called about
> fraud tonight. If they say "hang up and call the card," you're done.
>
> Worried it might really be your bank? Calling the card number reaches them
> anyway. Hanging up costs you a minute and nothing else.

What changed and why: the end state comes before the threat (efficacy first);
the threat is named in one sentence; the do list dropped from four items to
three by folding the "stay on the line" tell into the three-nevers; the if-then
line is explicit; the check is a single observable test instead of a
description of knowledge. The existing "simple," "detail" and "story" tellings
stay as alternate views of the same step.

## 5. What brings people back, and what makes them bring someone

**Return**

- A reason tied to a landmark. The monthly note, sent on the first of the
  month, that says what changed in the world and whether their path changed.
  Most months the answer is "nothing changed for you," which is itself the
  calm the brand promises.
- A visible, unpunishing record. Counts per outcome and the end states they
  have reached. Never a streak.
- A next step that is always small and already chosen. The decision has been
  made for them.
- Progress credit for things done elsewhere. "Did you set up a passkey this
  month? Tick it here."

**Bring someone**

- Steps that are inherently two-person: the safe word, the card by the phone,
  the elder conversation. Completing them requires another person, and that
  person becomes a member by participating.
- Artifacts that travel: the printable card, the one-page AI rule, the
  emergency kit. A card on a fridge is seen by everyone who visits.
- Identity worth wearing: "we don't take referral fees" is a position people
  repeat. Give them the phrase and the badge.
- A sharing moment built into the done ritual: "Send this step to someone you
  look out for," with a pre-written, calm message. Not a share button, a gift.

## 6. Five testable hypotheses

Once analytics and the four events (chip clicked, path completed, step done,
path saved) exist:

1. **First-step-immediately** raises the share of chip clicks that end in one
   step marked done within 24 hours from its baseline by at least a third.
   Mechanism: ability (Fogg) and mastery (Bandura).
2. **Endowed progress** on the first Path screen ("3 of 11 done before you
   started") raises path saves relative to a plain count. Mechanism: Nunes and
   Drèze, 2006.
3. **End-state headings** on stages raise the share of visitors who scroll to
   and open a second stage, compared with step-count headings alone.
4. **The if-then line plus a printable card** raises completion of conversation
   steps (safe word, bank callback, elder conversation) relative to steps
   without one. Mechanism: Gollwitzer and Sheeran, 2006.
5. **Monthly note on the first of the month** produces a higher return rate
   within seven days than the same note sent mid-month. Mechanism: Dai,
   Milkman and Riis, 2014.

Each is a two-arm test on one variable, with step-done as the outcome, not
clicks. Report the number of households and businesses, the absolute rates and
the difference, and say when the difference is too small to act on.

## Sources

- Bada, M., Sasse, M. A., Nurse, J. R. C. "Cyber Security Awareness Campaigns: Why do they fail to change behaviour?" Oxford working paper 2014, International Conference on Cyber Security for Sustainable Society 2017, arXiv 1901.02672 (2019). Follow-up: Bada and Nurse, 2025.
- Bandura, A. "Self-efficacy: Toward a unifying theory of behavioral change." Psychological Review 84(2), 1977.
- Dai, H., Milkman, K. L., Riis, J. "The Fresh Start Effect: Temporal Landmarks Motivate Aspirational Behavior." Management Science 60(10), 2014.
- Federal Trade Commission. "FTC Issues Annual Report to Congress on Agency's Actions to Protect Older Adults." December 2025.
- Fogg, B. J. "A behavior model for persuasive design." Persuasive 2009.
- Goldstein, N. J., Cialdini, R. B., Griskevicius, V. "A Room with a Viewpoint: Using Social Norms to Motivate Environmental Conservation in Hotels." Journal of Consumer Research 35, August 2008.
- Gollwitzer, P. M., Sheeran, P. "Implementation intentions and goal achievement: A meta-analysis of effects and processes." Advances in Experimental Social Psychology 38, 2006.
- Google. "Safer Internet Day" security update, February 8, 2022 (2-Step Verification auto-enrollment results).
- Kok, G., Peters, G.-J. Y., Kessels, L. T. E., ten Hoor, G. A., Ruiter, R. A. C. "Ignoring theory and misinterpreting evidence: the false belief in fear appeals." Health Psychology Review 12(2), 2018.
- Lally, P., van Jaarsveld, C. H. M., Potts, H. W. W., Wardle, J. "How are habits formed: Modelling habit formation in the real world." European Journal of Social Psychology 40, 2010.
- Michie, S., van Stralen, M. M., West, R. "The behaviour change wheel: A new method for characterising and designing behaviour change interventions." Implementation Science 6:42, April 2011.
- Nunes, J. C., Drèze, X. "The Endowed Progress Effect: How Artificial Advancement Increases Effort." Journal of Consumer Research 32(4), 2006.
- Stanton, B., Theofanos, M. F., Prettyman, S. S., Furman, S. "Security Fatigue." IT Professional 18(5), September-October 2016 (NIST).
- Sur, A., DeLiema, M., Brown, E. "Contextual and Social Predictors of Scam Susceptibility and Fraud Victimization." Michigan Retirement and Disability Research Center, 2021.
- Tannenbaum, M. B., et al. "Appealing to Fear: A Meta-Analysis of Fear Appeal Effectiveness and Theories." Psychological Bulletin 141(6), 2015.
- Verizon. 2026 Data Breach Investigations Report, Executive Summary, p. 12 (already cited on the site as verizon-dbir-2026-exec-summary).
- Witte, K. "Putting the fear back into fear appeals: The extended parallel process model." Communication Monographs 59(4), 1992.
