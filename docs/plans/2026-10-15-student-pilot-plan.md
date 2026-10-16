# CEStudy controlled student pilot plan

**Status:** Plan prepared; no student pilot has started.  
**Audience:** A small opt-in group of 5 to 8 Civil Engineering students, preferably including first- and second-year students who match the MVP's initial use cases.

## Entry conditions

Do not recruit participants or announce a broad launch until the blocking release checks have passed: live Supabase connection and headers, mobile/desktop and route checks, privacy verification, contact/correction path, human question-review process, and an approved recovery plan appropriate to the data held.

The eight seeded Basic Algebra questions are not available for student quiz testing until a human reviewer approves them. The catalog can be evaluated separately, but participants must not be shown unpublished questions.

## Pilot session

Invite volunteers directly. Explain that this is an early usability test, not a graded activity. Participation is optional and they can stop at any time. Do not collect student ID numbers, grades, passwords, personal study records, or unnecessary personal details. Ask permission before recording anything; prefer an anonymous checklist and short written feedback. Do not add accounts or a student-data collection feature for the pilot.

Each session should take about 15 to 20 minutes. Ask a participant to:

1. Open the home page and describe what CEStudy is for.
2. Find the subject catalog and locate a selected subject.
3. Use search and filters to find a Year 2 subject.
4. Open Mathematics Foundations or a subject detail page, then refresh the page directly.
5. Locate a CHED source link and explain whether the source is easy to recognize.
6. Share what was confusing, useful, missing, or hard to read on their phone.

If, and only if, a human-reviewed question set is intentionally published after all privacy gates pass, add a short task to answer one practice question and understand its solution.

## Proposed success measures

Record results without linking them to participant identities.

- At least 80% of participants complete each core catalog/navigation task without assistance.
- Zero critical privacy or security issues. The live app/API and pilot materials must not expose unpublished questions; the earlier exposure of the original eight drafts in public Git history is an accepted exception, not a pilot incident.
- No blocking layout issue at phone width or desktop width.
- Median ease-of-use score of at least 4 out of 5.
- Every critical issue has an owner and an explicit fix or deferral decision before inviting more students.

Treat these as proposed pilot thresholds, not current results or validated targets. With a group this small, the test is for usability problems, not proof that the product works for all CE students.

## Feedback, fixes, and decision

Before recruitment, provide one clear feedback/contact path and tell students how to report an incorrect question or broken source link. Review the feedback after each session, group duplicate issues, fix critical failures first, and rerun the affected tasks.

At the end, record participant count, anonymous task completion, issue summary, changes made, and a go/no-go decision in Git. Stop the pilot immediately if sensitive data or unpublished questions are exposed. Do not broaden access until the owner reviews the evidence and approves the next stage.
