# CEStudy Subject Catalog Design

**Date:** 2026-10-14  
**Status:** Approved for planning  
**Scope:** Subject catalog and curriculum transparency only. This document does not select a software stack or authorize application implementation.

## 1. Purpose

CEStudy is a low-cost, mobile-friendly reviewer for Civil Engineering students. Its catalog should make relevant technical subjects easy to browse from first year through fourth year while helping students revisit prerequisite mathematics.

The full planned catalog should be visible from the first release. Learning materials will be added gradually and must not be presented as verified before they have been checked.

## 2. Approved product decisions

- Focus on Civil Engineering technical subjects and prerequisite mathematics, not unrelated General Education subjects.
- Show all four year levels from the beginning.
- Use the Philippine national BSCE curriculum as the initial reference.
- Include a separate Mathematics Foundations and Refreshers area accessible to students from any year level.
- Include the five specialization areas in the CHED reference: Construction Engineering and Management, Geotechnical Engineering, Structural Engineering, Transportation Engineering, and Water Resources Engineering.
- Make the subject catalog broadly available, then fill it with reviewed learning materials over time.
- Make the curriculum source and limitations visible to users.
- Treat year-level placement as a typical reference, not a universal sequence for every university.

## 3. Curriculum source and transparency

### Initial reference

CHED Memorandum Order No. 92, series of 2017, *Policies, Standards and Guidelines for the Bachelor of Science in Civil Engineering (BSCE) Program*, effective beginning Academic Year 2018-2019. The catalog uses its sample program of study and lists of common and specialized professional courses as the starting reference.

Official document: https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf

Before public launch, CEStudy must re-check CHED's current issuances to determine whether CMO No. 92, s. 2017 has been amended, superseded, or supplemented. This document does not claim to establish the legal status of the order beyond the research completed on the date above.

### Public curriculum note

> **Curriculum Reference**
>
> CEStudy uses CHED Memorandum Order No. 92, series of 2017, *Policies, Standards and Guidelines for the Bachelor of Science in Civil Engineering (BSCE) Program*, as its initial national curriculum reference. The year-level placements follow the CHED sample program of study and may differ from individual universities. Supplementary mathematics foundations are provided for review and are not represented as standalone courses required by that order. CEStudy is an independent educational project and is not affiliated with or endorsed by CHED.

Display this note on the subject catalog page with a link to the source document. Keep it available from subject detail pages as well, such as through a curriculum reference link.

### Catalog labels

Each course or subject entry should be classified as one of the following:

- **CHED sample curriculum: common course:** a course named in the common or technical-course list and/or sample program of study.
- **CHED sample curriculum: specialized professional course:** a course listed among the suggested specialized professional courses.
- **Supplementary mathematics foundation:** a prerequisite or refresher topic included to help students learn CE content. Do not represent it as a standalone course required by CMO No. 92, s. 2017 unless independently verified.
- **Additional CE review topic:** a relevant supplemental subject or topic that is not being presented as a named course from the referenced CHED sample.

Do not label every subject as mandatory, required by CHED, or taught in one exact year at every university.

## 4. Proposed catalog structure

The following common-course year and semester placements are based on the CHED sample program of study. They are reference placements only. University curricula may differ.

### First Year

**First semester**
- Calculus 1
- Chemistry for Engineers
- Civil Engineering Orientation

**Second semester**
- Calculus 2
- Physics for Engineers (Calculus-Based)
- Engineering Drawing and Plans
- Computer Fundamentals and Programming

### Second Year

**First semester**
- Differential Equations
- Computer-Aided Drafting
- Statics of Rigid Bodies
- Fundamentals of Surveying
- Engineering Economics
- Engineering Management

**Second semester**
- Engineering Data Analysis
- Geology for Civil Engineers
- Dynamics of Rigid Bodies
- Mechanics of Deformable Bodies
- Construction Materials and Testing

### Third Year

**First semester**
- Structural Theory
- Highway and Railroad Engineering
- Engineering Utilities 1
- Engineering Utilities 2
- Numerical Solutions to CE Problems

**Second semester**
- Technopreneurship 101
- Building Systems Design
- Principles of Steel Design
- Principles of Reinforced/Prestressed Concrete
- Hydrology
- Hydraulics
- CE Law, Ethics and Contracts

**Summer / field experience**
- On-the-Job Training (OJT), listed in the sample program as 240 hours. The sample notes that it may be taken after third year or fourth year.

### Fourth Year

**First semester**
- Geotechnical Engineering 1 (Soil Mechanics)
- Principles of Transportation Engineering
- CE Project 1
- Professional Course - Specialized 1
- Professional Course - Specialized 2

**Second semester**
- CE Project 2
- Quantity Surveying
- Professional Course - Specialized 3
- Professional Course - Specialized 4
- Professional Course - Specialized 5
- Construction Methods and Project Management

The numbered specialized-course placeholders are not actual student-facing subject titles. They are slots in the reference sample, not named courses. The catalog should instead list named courses under the relevant specialization categories below.

## 5. Mathematics Foundations and Refreshers

Create a separate hub accessible from the main catalog and from subject pages across all year levels. It must not be tied to a single year level.

Initial areas:

- **Basic and advanced algebra:** arithmetic review, fractions, ratios and proportions, percentages, exponents, radicals, logarithms, factoring, equations, inequalities, functions, systems of equations, and rearranging engineering formulas.
- **Trigonometry:** angle measure, right-triangle trigonometry, unit circle, trigonometric functions, identities, radians, laws of sines and cosines, and solving triangles.
- **Analytic geometry:** Cartesian coordinates, distance and midpoint, slope and line equations, circles, conic sections, and coordinate methods.
- **Solid mensuration:** perimeter and area, surface area, volume, common plane figures and solids, and geometric applications.
- **Additional prerequisites:** plane geometry, vectors, unit conversions, dimensional analysis, and precalculus skills.

These are learning and review categories. Do not represent them as separate required college courses in the cited CHED order unless a separate source establishes that claim.

## 6. Specialized professional catalog

Include all five specialization categories from the CHED reference from the start. Mark them as specialized course areas. A specific course may be offered differently depending on the student's university or elective track.

### Construction Engineering and Management
- Project Construction and Management
- Advanced Construction Methods and Equipment
- Construction Cost Engineering
- Database Management in Construction
- Construction Occupational Safety and Health (COSH)

### Geotechnical Engineering
- Geotechnical Engineering 2 (Rock Mechanics)
- Foundation Engineering
- Geotechnical Earthquake Engineering
- Ground Improvement

### Structural Engineering
- Computer Software in Structural Analysis
- Earthquake Engineering
- Design of Steel Structures
- Reinforced Concrete Design
- Prestressed Concrete Design
- Structural Design of Towers and Other Vertical Structures
- Bridge Engineering
- Foundation and Retaining Wall Design

### Transportation Engineering
- Transportation Systems Planning and Design
- Highway Engineering
- Airport Design
- Ports and Harbors

### Water Resources Engineering
- Water Resources Engineering
- Flood Control and Drainage Design
- Irrigation Engineering
- Water Supply Planning and Development
- Coastal Engineering
- River Engineering
- Ground Water Flow Modeling

When the catalog includes additional relevant topics beyond this list, label them **Additional CE review topic** unless a reliable curriculum source supports a more specific classification.

## 7. Browse and navigation behavior

- The homepage or catalog landing page should provide links to First Year, Second Year, Third Year, Fourth Year, and Mathematics Foundations.
- A student can browse all catalog subjects regardless of their own year level.
- Each year level can be split into semesters where the CHED sample gives a placement.
- Specialized courses should be discoverable by specialization and may also be linked from the typical year level where relevant.
- Do not hide a subject because it has no learning material yet. Display it as **Coming soon** or **Content in preparation**.
- Subjects should be searchable by course name, topic, and common abbreviations where practical.
- The interface should make clear whether a year placement comes from the CHED sample or is an additional CEStudy classification.

## 8. Learning-material quality and status

The subject catalog and the completeness of its content are separate. A subject can exist in the catalog before its notes or question bank are ready.

### Suggested material workflow

1. **Draft:** material is being prepared and is not published as verified.
2. **Needs review:** the draft is complete enough for technical checking.
3. **Verified:** a reviewer has checked the explanation, final answer, calculations where applicable, and references against reliable sources.
4. **Published:** the verified material is available to students.
5. **Correction required / retired:** a published item has a reported issue and is hidden or flagged until corrected.

AI output alone does not qualify as verification. For numerical problems, the solution should be independently recalculated or otherwise checked. Record relevant sources, source edition or publication date when available, review status, and revision date. Make user reports of mistakes possible when the product is implemented.

Possible material types include concise reviewer notes, practice questions, step-by-step solutions, formula summaries, and references. The initial product scope should focus on quality and usability, not large-scale user submissions or advanced AI functionality.

## 9. Out of scope for this catalog design

- General Education courses unrelated to Civil Engineering review.
- Claiming CEStudy is an official CHED, university, or PRC platform.
- Claiming every university uses the same curriculum or semester sequence.
- Presenting supplementary mathematics refreshers as mandatory CHED courses.
- Publishing unreviewed AI-generated calculations as verified answers.
- Choosing a frontend framework, database, hosting provider, or AI vendor. Those decisions belong to a later architecture design.

## 10. Acceptance criteria

The subject catalog design is ready for the next planning stage when:

- All four year levels are present in the planned catalog.
- The five specialization categories and their reference course lists are represented.
- Mathematics Foundations is accessible from every year level.
- Course placement is visibly identified as based on the CHED sample and potentially different at individual universities.
- The curriculum transparency note and official source link are included.
- Catalog course classifications distinguish common courses, specialized professional courses, supplementary math foundations, and additional review topics.
- No specialized placeholder such as "Professional Course - Specialized 1" is presented as a real subject name.
- Content statuses distinguish material preparation from technical verification and publication.
- The design does not lock the product into a technology stack.

## 11. Source reference

- Commission on Higher Education, CMO No. 92, series of 2017, *Policies, Standards and Guidelines for the Bachelor of Science in Civil Engineering (BSCE) Program*, including the sample program of study and suggested specialized professional courses: https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf
- CHED's 2017 Memorandum Orders listing, which identifies CMO No. 92 as the BSCE program order effective beginning AY 2018-2019: https://legacy.ched.gov.ph/2017-ched-memorandum-orders/

**Review note:** This is a design specification for CEStudy's subject catalog, not legal advice and not a replacement for the curriculum officially approved by any individual university. Check for newer CHED issuances again before public launch.
