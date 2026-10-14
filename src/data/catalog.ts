import type { CatalogSubject } from "../types/catalog";
// Public fallback for local browsing before Supabase is configured. The SQL seed mirrors this data.
export const CATALOG_SUBJECTS:CatalogSubject[]=[
  {
    "slug": "calculus-1",
    "title": "Calculus 1",
    "summary": "Foundational limits, derivatives, and engineering applications.",
    "yearLevel": 1,
    "semester": "First semester",
    "category": "year-level",
    "classification": "ched-common-course",
    "specialization": null,
    "aliases": [
      "differential calculus"
    ],
    "sourceReference": "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
    "sourceNote": "Typical placement follows the CHED sample program of study. Individual university curricula and semester placements may differ.",
    "availability": "coming-soon",
    "displayOrder": 1
  },
  {
    "slug": "chemistry-for-engineers",
    "title": "Chemistry for Engineers",
    "summary": "Chemistry concepts used in engineering materials and processes.",
    "yearLevel": 1,
    "semester": "First semester",
    "category": "year-level",
    "classification": "ched-common-course",
    "specialization": null,
    "aliases": [
      "engineering chemistry"
    ],
    "sourceReference": "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
    "sourceNote": "Typical placement follows the CHED sample program of study. Individual university curricula and semester placements may differ.",
    "availability": "coming-soon",
    "displayOrder": 2
  },
  {
    "slug": "civil-engineering-orientation",
    "title": "Civil Engineering Orientation",
    "summary": "An introduction to civil engineering practice, disciplines, and professional responsibilities.",
    "yearLevel": 1,
    "semester": "First semester",
    "category": "year-level",
    "classification": "ched-common-course",
    "specialization": null,
    "aliases": [
      "CE orientation"
    ],
    "sourceReference": "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
    "sourceNote": "Typical placement follows the CHED sample program of study. Individual university curricula and semester placements may differ.",
    "availability": "coming-soon",
    "displayOrder": 3
  },
  {
    "slug": "calculus-2",
    "title": "Calculus 2",
    "summary": "Integral calculus and related mathematical methods.",
    "yearLevel": 1,
    "semester": "Second semester",
    "category": "year-level",
    "classification": "ched-common-course",
    "specialization": null,
    "aliases": [
      "integral calculus"
    ],
    "sourceReference": "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
    "sourceNote": "Typical placement follows the CHED sample program of study. Individual university curricula and semester placements may differ.",
    "availability": "coming-soon",
    "displayOrder": 4
  },
  {
    "slug": "physics-for-engineers",
    "title": "Physics for Engineers (Calculus-Based)",
    "summary": "Calculus-based physics concepts used in engineering.",
    "yearLevel": 1,
    "semester": "Second semester",
    "category": "year-level",
    "classification": "ched-common-course",
    "specialization": null,
    "aliases": [
      "engineering physics"
    ],
    "sourceReference": "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
    "sourceNote": "Typical placement follows the CHED sample program of study. Individual university curricula and semester placements may differ.",
    "availability": "coming-soon",
    "displayOrder": 5
  },
  {
    "slug": "engineering-drawing-and-plans",
    "title": "Engineering Drawing and Plans",
    "summary": "Technical drawing, plans, and visual communication.",
    "yearLevel": 1,
    "semester": "Second semester",
    "category": "year-level",
    "classification": "ched-common-course",
    "specialization": null,
    "aliases": [
      "engineering drawing",
      "plans"
    ],
    "sourceReference": "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
    "sourceNote": "Typical placement follows the CHED sample program of study. Individual university curricula and semester placements may differ.",
    "availability": "coming-soon",
    "displayOrder": 6
  },
  {
    "slug": "computer-fundamentals-and-programming",
    "title": "Computer Fundamentals and Programming",
    "summary": "Computing fundamentals and introductory programming.",
    "yearLevel": 1,
    "semester": "Second semester",
    "category": "year-level",
    "classification": "ched-common-course",
    "specialization": null,
    "aliases": [
      "programming",
      "computer fundamentals"
    ],
    "sourceReference": "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
    "sourceNote": "Typical placement follows the CHED sample program of study. Individual university curricula and semester placements may differ.",
    "availability": "coming-soon",
    "displayOrder": 7
  },
  {
    "slug": "differential-equations",
    "title": "Differential Equations",
    "summary": "Differential equation methods used to model engineering systems.",
    "yearLevel": 2,
    "semester": "First semester",
    "category": "year-level",
    "classification": "ched-common-course",
    "specialization": null,
    "aliases": [
      "DE"
    ],
    "sourceReference": "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
    "sourceNote": "Typical placement follows the CHED sample program of study. Individual university curricula and semester placements may differ.",
    "availability": "coming-soon",
    "displayOrder": 8
  },
  {
    "slug": "computer-aided-drafting",
    "title": "Computer-Aided Drafting",
    "summary": "Digital drafting methods and technical drawing workflows.",
    "yearLevel": 2,
    "semester": "First semester",
    "category": "year-level",
    "classification": "ched-common-course",
    "specialization": null,
    "aliases": [
      "CAD"
    ],
    "sourceReference": "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
    "sourceNote": "Typical placement follows the CHED sample program of study. Individual university curricula and semester placements may differ.",
    "availability": "coming-soon",
    "displayOrder": 9
  },
  {
    "slug": "statics-of-rigid-bodies",
    "title": "Statics of Rigid Bodies",
    "summary": "Forces, equilibrium, moments, and rigid-body analysis.",
    "yearLevel": 2,
    "semester": "First semester",
    "category": "year-level",
    "classification": "ched-common-course",
    "specialization": null,
    "aliases": [
      "statics",
      "engineering statics"
    ],
    "sourceReference": "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
    "sourceNote": "Typical placement follows the CHED sample program of study. Individual university curricula and semester placements may differ.",
    "availability": "coming-soon",
    "displayOrder": 10
  },
  {
    "slug": "fundamentals-of-surveying",
    "title": "Fundamentals of Surveying",
    "summary": "Surveying principles, measurements, and field computations.",
    "yearLevel": 2,
    "semester": "First semester",
    "category": "year-level",
    "classification": "ched-common-course",
    "specialization": null,
    "aliases": [
      "surveying",
      "land surveying"
    ],
    "sourceReference": "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
    "sourceNote": "Typical placement follows the CHED sample program of study. Individual university curricula and semester placements may differ.",
    "availability": "coming-soon",
    "displayOrder": 11
  },
  {
    "slug": "engineering-economics",
    "title": "Engineering Economics",
    "summary": "Economic comparison and decision methods for engineering projects.",
    "yearLevel": 2,
    "semester": "First semester",
    "category": "year-level",
    "classification": "ched-common-course",
    "specialization": null,
    "aliases": [
      "engineering economy"
    ],
    "sourceReference": "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
    "sourceNote": "Typical placement follows the CHED sample program of study. Individual university curricula and semester placements may differ.",
    "availability": "coming-soon",
    "displayOrder": 12
  },
  {
    "slug": "engineering-management",
    "title": "Engineering Management",
    "summary": "Planning, organizing, and managing engineering work.",
    "yearLevel": 2,
    "semester": "First semester",
    "category": "year-level",
    "classification": "ched-common-course",
    "specialization": null,
    "aliases": [
      "management"
    ],
    "sourceReference": "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
    "sourceNote": "Typical placement follows the CHED sample program of study. Individual university curricula and semester placements may differ.",
    "availability": "coming-soon",
    "displayOrder": 13
  },
  {
    "slug": "engineering-data-analysis",
    "title": "Engineering Data Analysis",
    "summary": "Data summaries, probability, and statistical reasoning.",
    "yearLevel": 2,
    "semester": "Second semester",
    "category": "year-level",
    "classification": "ched-common-course",
    "specialization": null,
    "aliases": [
      "statistics",
      "data analysis"
    ],
    "sourceReference": "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
    "sourceNote": "Typical placement follows the CHED sample program of study. Individual university curricula and semester placements may differ.",
    "availability": "coming-soon",
    "displayOrder": 14
  },
  {
    "slug": "geology-for-civil-engineers",
    "title": "Geology for Civil Engineers",
    "summary": "Geologic materials, processes, and site considerations.",
    "yearLevel": 2,
    "semester": "Second semester",
    "category": "year-level",
    "classification": "ched-common-course",
    "specialization": null,
    "aliases": [
      "engineering geology"
    ],
    "sourceReference": "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
    "sourceNote": "Typical placement follows the CHED sample program of study. Individual university curricula and semester placements may differ.",
    "availability": "coming-soon",
    "displayOrder": 15
  },
  {
    "slug": "dynamics-of-rigid-bodies",
    "title": "Dynamics of Rigid Bodies",
    "summary": "Motion, forces, and energy in rigid-body systems.",
    "yearLevel": 2,
    "semester": "Second semester",
    "category": "year-level",
    "classification": "ched-common-course",
    "specialization": null,
    "aliases": [
      "dynamics"
    ],
    "sourceReference": "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
    "sourceNote": "Typical placement follows the CHED sample program of study. Individual university curricula and semester placements may differ.",
    "availability": "coming-soon",
    "displayOrder": 16
  },
  {
    "slug": "mechanics-of-deformable-bodies",
    "title": "Mechanics of Deformable Bodies",
    "summary": "Stress, strain, material behavior, and deformation.",
    "yearLevel": 2,
    "semester": "Second semester",
    "category": "year-level",
    "classification": "ched-common-course",
    "specialization": null,
    "aliases": [
      "mechanics of materials",
      "strength of materials"
    ],
    "sourceReference": "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
    "sourceNote": "Typical placement follows the CHED sample program of study. Individual university curricula and semester placements may differ.",
    "availability": "coming-soon",
    "displayOrder": 17
  },
  {
    "slug": "construction-materials-and-testing",
    "title": "Construction Materials and Testing",
    "summary": "Properties and standard testing concepts for construction materials.",
    "yearLevel": 2,
    "semester": "Second semester",
    "category": "year-level",
    "classification": "ched-common-course",
    "specialization": null,
    "aliases": [
      "materials testing"
    ],
    "sourceReference": "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
    "sourceNote": "Typical placement follows the CHED sample program of study. Individual university curricula and semester placements may differ.",
    "availability": "coming-soon",
    "displayOrder": 18
  },
  {
    "slug": "structural-theory",
    "title": "Structural Theory",
    "summary": "Analysis of forces and responses in structural systems.",
    "yearLevel": 3,
    "semester": "First semester",
    "category": "year-level",
    "classification": "ched-common-course",
    "specialization": null,
    "aliases": [
      "structural analysis"
    ],
    "sourceReference": "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
    "sourceNote": "Typical placement follows the CHED sample program of study. Individual university curricula and semester placements may differ.",
    "availability": "coming-soon",
    "displayOrder": 19
  },
  {
    "slug": "highway-and-railroad-engineering",
    "title": "Highway and Railroad Engineering",
    "summary": "Highway and railroad planning, design, and operation.",
    "yearLevel": 3,
    "semester": "First semester",
    "category": "year-level",
    "classification": "ched-common-course",
    "specialization": null,
    "aliases": [
      "highway engineering"
    ],
    "sourceReference": "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
    "sourceNote": "Typical placement follows the CHED sample program of study. Individual university curricula and semester placements may differ.",
    "availability": "coming-soon",
    "displayOrder": 20
  },
  {
    "slug": "engineering-utilities-1",
    "title": "Engineering Utilities 1",
    "summary": "Building utility systems and their engineering applications.",
    "yearLevel": 3,
    "semester": "First semester",
    "category": "year-level",
    "classification": "ched-common-course",
    "specialization": null,
    "aliases": [
      "utilities 1"
    ],
    "sourceReference": "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
    "sourceNote": "Typical placement follows the CHED sample program of study. Individual university curricula and semester placements may differ.",
    "availability": "coming-soon",
    "displayOrder": 21
  },
  {
    "slug": "engineering-utilities-2",
    "title": "Engineering Utilities 2",
    "summary": "Further building utility systems and design considerations.",
    "yearLevel": 3,
    "semester": "First semester",
    "category": "year-level",
    "classification": "ched-common-course",
    "specialization": null,
    "aliases": [
      "utilities 2"
    ],
    "sourceReference": "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
    "sourceNote": "Typical placement follows the CHED sample program of study. Individual university curricula and semester placements may differ.",
    "availability": "coming-soon",
    "displayOrder": 22
  },
  {
    "slug": "numerical-solutions-to-ce-problems",
    "title": "Numerical Solutions to CE Problems",
    "summary": "Numerical approaches for solving civil engineering problems.",
    "yearLevel": 3,
    "semester": "First semester",
    "category": "year-level",
    "classification": "ched-common-course",
    "specialization": null,
    "aliases": [
      "numerical methods"
    ],
    "sourceReference": "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
    "sourceNote": "Typical placement follows the CHED sample program of study. Individual university curricula and semester placements may differ.",
    "availability": "coming-soon",
    "displayOrder": 23
  },
  {
    "slug": "technopreneurship-101",
    "title": "Technopreneurship 101",
    "summary": "Entrepreneurship concepts for technology and engineering ideas.",
    "yearLevel": 3,
    "semester": "Second semester",
    "category": "year-level",
    "classification": "ched-common-course",
    "specialization": null,
    "aliases": [
      "technopreneurship"
    ],
    "sourceReference": "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
    "sourceNote": "Typical placement follows the CHED sample program of study. Individual university curricula and semester placements may differ.",
    "availability": "coming-soon",
    "displayOrder": 24
  },
  {
    "slug": "building-systems-design",
    "title": "Building Systems Design",
    "summary": "Coordination and design concepts for building systems.",
    "yearLevel": 3,
    "semester": "Second semester",
    "category": "year-level",
    "classification": "ched-common-course",
    "specialization": null,
    "aliases": [
      "building design"
    ],
    "sourceReference": "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
    "sourceNote": "Typical placement follows the CHED sample program of study. Individual university curricula and semester placements may differ.",
    "availability": "coming-soon",
    "displayOrder": 25
  },
  {
    "slug": "principles-of-steel-design",
    "title": "Principles of Steel Design",
    "summary": "Core principles used to analyze and design steel members.",
    "yearLevel": 3,
    "semester": "Second semester",
    "category": "year-level",
    "classification": "ched-common-course",
    "specialization": null,
    "aliases": [
      "steel design"
    ],
    "sourceReference": "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
    "sourceNote": "Typical placement follows the CHED sample program of study. Individual university curricula and semester placements may differ.",
    "availability": "coming-soon",
    "displayOrder": 26
  },
  {
    "slug": "principles-of-reinforced-prestressed-concrete",
    "title": "Principles of Reinforced/Prestressed Concrete",
    "summary": "Principles for concrete structural elements and reinforcement.",
    "yearLevel": 3,
    "semester": "Second semester",
    "category": "year-level",
    "classification": "ched-common-course",
    "specialization": null,
    "aliases": [
      "reinforced concrete",
      "prestressed concrete"
    ],
    "sourceReference": "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
    "sourceNote": "Typical placement follows the CHED sample program of study. Individual university curricula and semester placements may differ.",
    "availability": "coming-soon",
    "displayOrder": 27
  },
  {
    "slug": "hydrology",
    "title": "Hydrology",
    "summary": "Occurrence, movement, and distribution of water.",
    "yearLevel": 3,
    "semester": "Second semester",
    "category": "year-level",
    "classification": "ched-common-course",
    "specialization": null,
    "aliases": [
      "hydrologic cycle"
    ],
    "sourceReference": "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
    "sourceNote": "Typical placement follows the CHED sample program of study. Individual university curricula and semester placements may differ.",
    "availability": "coming-soon",
    "displayOrder": 28
  },
  {
    "slug": "hydraulics",
    "title": "Hydraulics",
    "summary": "Fluid behavior and flow analysis in civil engineering.",
    "yearLevel": 3,
    "semester": "Second semester",
    "category": "year-level",
    "classification": "ched-common-course",
    "specialization": null,
    "aliases": [
      "fluid mechanics"
    ],
    "sourceReference": "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
    "sourceNote": "Typical placement follows the CHED sample program of study. Individual university curricula and semester placements may differ.",
    "availability": "coming-soon",
    "displayOrder": 29
  },
  {
    "slug": "ce-law-ethics-and-contracts",
    "title": "CE Law, Ethics and Contracts",
    "summary": "Legal responsibilities, professional ethics, and contracts.",
    "yearLevel": 3,
    "semester": "Second semester",
    "category": "year-level",
    "classification": "ched-common-course",
    "specialization": null,
    "aliases": [
      "civil engineering law",
      "ethics"
    ],
    "sourceReference": "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
    "sourceNote": "Typical placement follows the CHED sample program of study. Individual university curricula and semester placements may differ.",
    "availability": "coming-soon",
    "displayOrder": 30
  },
  {
    "slug": "on-the-job-training",
    "title": "On-the-Job Training (OJT)",
    "summary": "Practical field or industry experience. The CHED sample lists 240 hours and allows timing to vary.",
    "yearLevel": 3,
    "semester": "Summer / field experience",
    "category": "year-level",
    "classification": "ched-common-course",
    "specialization": null,
    "aliases": [
      "OJT",
      "field experience"
    ],
    "sourceReference": "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
    "sourceNote": "Typical placement follows the CHED sample program of study. Individual university curricula and semester placements may differ.",
    "availability": "coming-soon",
    "displayOrder": 31
  },
  {
    "slug": "geotechnical-engineering-1",
    "title": "Geotechnical Engineering 1 (Soil Mechanics)",
    "summary": "Soil properties, classification, seepage, and soil mechanics.",
    "yearLevel": 4,
    "semester": "First semester",
    "category": "year-level",
    "classification": "ched-common-course",
    "specialization": null,
    "aliases": [
      "soil mechanics",
      "geotechnical 1"
    ],
    "sourceReference": "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
    "sourceNote": "Typical placement follows the CHED sample program of study. Individual university curricula and semester placements may differ.",
    "availability": "coming-soon",
    "displayOrder": 32
  },
  {
    "slug": "principles-of-transportation-engineering",
    "title": "Principles of Transportation Engineering",
    "summary": "Introduction to transportation systems and engineering principles.",
    "yearLevel": 4,
    "semester": "First semester",
    "category": "year-level",
    "classification": "ched-common-course",
    "specialization": null,
    "aliases": [
      "transportation engineering"
    ],
    "sourceReference": "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
    "sourceNote": "Typical placement follows the CHED sample program of study. Individual university curricula and semester placements may differ.",
    "availability": "coming-soon",
    "displayOrder": 33
  },
  {
    "slug": "ce-project-1",
    "title": "CE Project 1",
    "summary": "First-stage capstone or project work as defined by the university.",
    "yearLevel": 4,
    "semester": "First semester",
    "category": "year-level",
    "classification": "ched-common-course",
    "specialization": null,
    "aliases": [
      "civil engineering project 1"
    ],
    "sourceReference": "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
    "sourceNote": "Typical placement follows the CHED sample program of study. Individual university curricula and semester placements may differ.",
    "availability": "coming-soon",
    "displayOrder": 34
  },
  {
    "slug": "ce-project-2",
    "title": "CE Project 2",
    "summary": "Continuation or completion of CE project work.",
    "yearLevel": 4,
    "semester": "Second semester",
    "category": "year-level",
    "classification": "ched-common-course",
    "specialization": null,
    "aliases": [
      "civil engineering project 2"
    ],
    "sourceReference": "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
    "sourceNote": "Typical placement follows the CHED sample program of study. Individual university curricula and semester placements may differ.",
    "availability": "coming-soon",
    "displayOrder": 35
  },
  {
    "slug": "quantity-surveying",
    "title": "Quantity Surveying",
    "summary": "Quantity takeoff and estimating concepts for construction.",
    "yearLevel": 4,
    "semester": "Second semester",
    "category": "year-level",
    "classification": "ched-common-course",
    "specialization": null,
    "aliases": [
      "quantity takeoff",
      "estimation"
    ],
    "sourceReference": "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
    "sourceNote": "Typical placement follows the CHED sample program of study. Individual university curricula and semester placements may differ.",
    "availability": "coming-soon",
    "displayOrder": 36
  },
  {
    "slug": "construction-methods-and-project-management",
    "title": "Construction Methods and Project Management",
    "summary": "Construction methods and project management in the CHED sample.",
    "yearLevel": 4,
    "semester": "Second semester",
    "category": "year-level",
    "classification": "ched-common-course",
    "specialization": null,
    "aliases": [
      "construction management"
    ],
    "sourceReference": "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
    "sourceNote": "Typical placement follows the CHED sample program of study. Individual university curricula and semester placements may differ.",
    "availability": "coming-soon",
    "displayOrder": 37
  },
  {
    "slug": "project-construction-and-management",
    "title": "Project Construction and Management",
    "summary": "Planning and management of construction projects.",
    "yearLevel": null,
    "semester": null,
    "category": "specialization",
    "classification": "ched-specialized-course",
    "specialization": "Construction Engineering and Management",
    "aliases": [
      "construction project management"
    ],
    "sourceReference": "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
    "sourceNote": "Listed in the CHED reference as a specialized course area. Course names and availability may vary by university and elective track.",
    "availability": "coming-soon",
    "displayOrder": 38
  },
  {
    "slug": "advanced-construction-methods-and-equipment",
    "title": "Advanced Construction Methods and Equipment",
    "summary": "Advanced construction methods, equipment selection, and operations.",
    "yearLevel": null,
    "semester": null,
    "category": "specialization",
    "classification": "ched-specialized-course",
    "specialization": "Construction Engineering and Management",
    "aliases": [
      "construction equipment"
    ],
    "sourceReference": "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
    "sourceNote": "Listed in the CHED reference as a specialized course area. Course names and availability may vary by university and elective track.",
    "availability": "coming-soon",
    "displayOrder": 39
  },
  {
    "slug": "construction-cost-engineering",
    "title": "Construction Cost Engineering",
    "summary": "Cost planning, estimating, and control.",
    "yearLevel": null,
    "semester": null,
    "category": "specialization",
    "classification": "ched-specialized-course",
    "specialization": "Construction Engineering and Management",
    "aliases": [
      "construction costing"
    ],
    "sourceReference": "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
    "sourceNote": "Listed in the CHED reference as a specialized course area. Course names and availability may vary by university and elective track.",
    "availability": "coming-soon",
    "displayOrder": 40
  },
  {
    "slug": "database-management-in-construction",
    "title": "Database Management in Construction",
    "summary": "Managing construction information with database concepts.",
    "yearLevel": null,
    "semester": null,
    "category": "specialization",
    "classification": "ched-specialized-course",
    "specialization": "Construction Engineering and Management",
    "aliases": [
      "construction databases"
    ],
    "sourceReference": "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
    "sourceNote": "Listed in the CHED reference as a specialized course area. Course names and availability may vary by university and elective track.",
    "availability": "coming-soon",
    "displayOrder": 41
  },
  {
    "slug": "construction-occupational-safety-and-health",
    "title": "Construction Occupational Safety and Health (COSH)",
    "summary": "Safety and health concepts for construction settings.",
    "yearLevel": null,
    "semester": null,
    "category": "specialization",
    "classification": "ched-specialized-course",
    "specialization": "Construction Engineering and Management",
    "aliases": [
      "COSH",
      "construction safety"
    ],
    "sourceReference": "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
    "sourceNote": "Listed in the CHED reference as a specialized course area. Course names and availability may vary by university and elective track.",
    "availability": "coming-soon",
    "displayOrder": 42
  },
  {
    "slug": "geotechnical-engineering-2",
    "title": "Geotechnical Engineering 2 (Rock Mechanics)",
    "summary": "Rock mechanics and its geotechnical applications.",
    "yearLevel": null,
    "semester": null,
    "category": "specialization",
    "classification": "ched-specialized-course",
    "specialization": "Geotechnical Engineering",
    "aliases": [
      "rock mechanics"
    ],
    "sourceReference": "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
    "sourceNote": "Listed in the CHED reference as a specialized course area. Course names and availability may vary by university and elective track.",
    "availability": "coming-soon",
    "displayOrder": 43
  },
  {
    "slug": "foundation-engineering",
    "title": "Foundation Engineering",
    "summary": "Design principles and behavior of foundation systems.",
    "yearLevel": null,
    "semester": null,
    "category": "specialization",
    "classification": "ched-specialized-course",
    "specialization": "Geotechnical Engineering",
    "aliases": [
      "shallow foundations",
      "deep foundations"
    ],
    "sourceReference": "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
    "sourceNote": "Listed in the CHED reference as a specialized course area. Course names and availability may vary by university and elective track.",
    "availability": "coming-soon",
    "displayOrder": 44
  },
  {
    "slug": "geotechnical-earthquake-engineering",
    "title": "Geotechnical Earthquake Engineering",
    "summary": "Soil behavior and geotechnical response during earthquakes.",
    "yearLevel": null,
    "semester": null,
    "category": "specialization",
    "classification": "ched-specialized-course",
    "specialization": "Geotechnical Engineering",
    "aliases": [
      "seismic geotechnics"
    ],
    "sourceReference": "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
    "sourceNote": "Listed in the CHED reference as a specialized course area. Course names and availability may vary by university and elective track.",
    "availability": "coming-soon",
    "displayOrder": 45
  },
  {
    "slug": "ground-improvement",
    "title": "Ground Improvement",
    "summary": "Methods that improve soil performance.",
    "yearLevel": null,
    "semester": null,
    "category": "specialization",
    "classification": "ched-specialized-course",
    "specialization": "Geotechnical Engineering",
    "aliases": [
      "soil improvement"
    ],
    "sourceReference": "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
    "sourceNote": "Listed in the CHED reference as a specialized course area. Course names and availability may vary by university and elective track.",
    "availability": "coming-soon",
    "displayOrder": 46
  },
  {
    "slug": "computer-software-in-structural-analysis",
    "title": "Computer Software in Structural Analysis",
    "summary": "Use and limitations of structural analysis software.",
    "yearLevel": null,
    "semester": null,
    "category": "specialization",
    "classification": "ched-specialized-course",
    "specialization": "Structural Engineering",
    "aliases": [
      "structural analysis software"
    ],
    "sourceReference": "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
    "sourceNote": "Listed in the CHED reference as a specialized course area. Course names and availability may vary by university and elective track.",
    "availability": "coming-soon",
    "displayOrder": 47
  },
  {
    "slug": "earthquake-engineering",
    "title": "Earthquake Engineering",
    "summary": "Earthquake effects, structural response, and seismic design.",
    "yearLevel": null,
    "semester": null,
    "category": "specialization",
    "classification": "ched-specialized-course",
    "specialization": "Structural Engineering",
    "aliases": [
      "seismic engineering"
    ],
    "sourceReference": "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
    "sourceNote": "Listed in the CHED reference as a specialized course area. Course names and availability may vary by university and elective track.",
    "availability": "coming-soon",
    "displayOrder": 48
  },
  {
    "slug": "design-of-steel-structures",
    "title": "Design of Steel Structures",
    "summary": "Analysis and design principles for steel structures.",
    "yearLevel": null,
    "semester": null,
    "category": "specialization",
    "classification": "ched-specialized-course",
    "specialization": "Structural Engineering",
    "aliases": [
      "steel structures"
    ],
    "sourceReference": "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
    "sourceNote": "Listed in the CHED reference as a specialized course area. Course names and availability may vary by university and elective track.",
    "availability": "coming-soon",
    "displayOrder": 49
  },
  {
    "slug": "reinforced-concrete-design",
    "title": "Reinforced Concrete Design",
    "summary": "Design principles for reinforced concrete members.",
    "yearLevel": null,
    "semester": null,
    "category": "specialization",
    "classification": "ched-specialized-course",
    "specialization": "Structural Engineering",
    "aliases": [
      "RC design"
    ],
    "sourceReference": "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
    "sourceNote": "Listed in the CHED reference as a specialized course area. Course names and availability may vary by university and elective track.",
    "availability": "coming-soon",
    "displayOrder": 50
  },
  {
    "slug": "prestressed-concrete-design",
    "title": "Prestressed Concrete Design",
    "summary": "Design concepts for prestressed concrete elements.",
    "yearLevel": null,
    "semester": null,
    "category": "specialization",
    "classification": "ched-specialized-course",
    "specialization": "Structural Engineering",
    "aliases": [
      "prestressed concrete"
    ],
    "sourceReference": "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
    "sourceNote": "Listed in the CHED reference as a specialized course area. Course names and availability may vary by university and elective track.",
    "availability": "coming-soon",
    "displayOrder": 51
  },
  {
    "slug": "structural-design-of-towers-and-vertical-structures",
    "title": "Structural Design of Towers and Other Vertical Structures",
    "summary": "Design considerations for towers and tall structures.",
    "yearLevel": null,
    "semester": null,
    "category": "specialization",
    "classification": "ched-specialized-course",
    "specialization": "Structural Engineering",
    "aliases": [
      "tower design"
    ],
    "sourceReference": "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
    "sourceNote": "Listed in the CHED reference as a specialized course area. Course names and availability may vary by university and elective track.",
    "availability": "coming-soon",
    "displayOrder": 52
  },
  {
    "slug": "bridge-engineering",
    "title": "Bridge Engineering",
    "summary": "Bridge systems, behavior, and design considerations.",
    "yearLevel": null,
    "semester": null,
    "category": "specialization",
    "classification": "ched-specialized-course",
    "specialization": "Structural Engineering",
    "aliases": [
      "bridge design"
    ],
    "sourceReference": "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
    "sourceNote": "Listed in the CHED reference as a specialized course area. Course names and availability may vary by university and elective track.",
    "availability": "coming-soon",
    "displayOrder": 53
  },
  {
    "slug": "foundation-and-retaining-wall-design",
    "title": "Foundation and Retaining Wall Design",
    "summary": "Design topics for foundations and retaining walls.",
    "yearLevel": null,
    "semester": null,
    "category": "specialization",
    "classification": "ched-specialized-course",
    "specialization": "Structural Engineering",
    "aliases": [
      "retaining wall design"
    ],
    "sourceReference": "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
    "sourceNote": "Listed in the CHED reference as a specialized course area. Course names and availability may vary by university and elective track.",
    "availability": "coming-soon",
    "displayOrder": 54
  },
  {
    "slug": "transportation-systems-planning-and-design",
    "title": "Transportation Systems Planning and Design",
    "summary": "Planning and design methods for transportation networks.",
    "yearLevel": null,
    "semester": null,
    "category": "specialization",
    "classification": "ched-specialized-course",
    "specialization": "Transportation Engineering",
    "aliases": [
      "transport planning"
    ],
    "sourceReference": "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
    "sourceNote": "Listed in the CHED reference as a specialized course area. Course names and availability may vary by university and elective track.",
    "availability": "coming-soon",
    "displayOrder": 55
  },
  {
    "slug": "highway-engineering",
    "title": "Highway Engineering",
    "summary": "Highway planning, geometric design, and engineering.",
    "yearLevel": null,
    "semester": null,
    "category": "specialization",
    "classification": "ched-specialized-course",
    "specialization": "Transportation Engineering",
    "aliases": [
      "road engineering"
    ],
    "sourceReference": "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
    "sourceNote": "Listed in the CHED reference as a specialized course area. Course names and availability may vary by university and elective track.",
    "availability": "coming-soon",
    "displayOrder": 56
  },
  {
    "slug": "airport-design",
    "title": "Airport Design",
    "summary": "Planning and design considerations for airport facilities.",
    "yearLevel": null,
    "semester": null,
    "category": "specialization",
    "classification": "ched-specialized-course",
    "specialization": "Transportation Engineering",
    "aliases": [
      "airport engineering"
    ],
    "sourceReference": "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
    "sourceNote": "Listed in the CHED reference as a specialized course area. Course names and availability may vary by university and elective track.",
    "availability": "coming-soon",
    "displayOrder": 57
  },
  {
    "slug": "ports-and-harbors",
    "title": "Ports and Harbors",
    "summary": "Engineering concepts for port and harbor facilities.",
    "yearLevel": null,
    "semester": null,
    "category": "specialization",
    "classification": "ched-specialized-course",
    "specialization": "Transportation Engineering",
    "aliases": [
      "port engineering"
    ],
    "sourceReference": "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
    "sourceNote": "Listed in the CHED reference as a specialized course area. Course names and availability may vary by university and elective track.",
    "availability": "coming-soon",
    "displayOrder": 58
  },
  {
    "slug": "water-resources-engineering",
    "title": "Water Resources Engineering",
    "summary": "Engineering planning and management of water resources.",
    "yearLevel": null,
    "semester": null,
    "category": "specialization",
    "classification": "ched-specialized-course",
    "specialization": "Water Resources Engineering",
    "aliases": [
      "water resources"
    ],
    "sourceReference": "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
    "sourceNote": "Listed in the CHED reference as a specialized course area. Course names and availability may vary by university and elective track.",
    "availability": "coming-soon",
    "displayOrder": 59
  },
  {
    "slug": "flood-control-and-drainage-design",
    "title": "Flood Control and Drainage Design",
    "summary": "Drainage systems and flood risk reduction.",
    "yearLevel": null,
    "semester": null,
    "category": "specialization",
    "classification": "ched-specialized-course",
    "specialization": "Water Resources Engineering",
    "aliases": [
      "drainage design",
      "flood control"
    ],
    "sourceReference": "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
    "sourceNote": "Listed in the CHED reference as a specialized course area. Course names and availability may vary by university and elective track.",
    "availability": "coming-soon",
    "displayOrder": 60
  },
  {
    "slug": "irrigation-engineering",
    "title": "Irrigation Engineering",
    "summary": "Design and operation of irrigation systems.",
    "yearLevel": null,
    "semester": null,
    "category": "specialization",
    "classification": "ched-specialized-course",
    "specialization": "Water Resources Engineering",
    "aliases": [
      "irrigation"
    ],
    "sourceReference": "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
    "sourceNote": "Listed in the CHED reference as a specialized course area. Course names and availability may vary by university and elective track.",
    "availability": "coming-soon",
    "displayOrder": 61
  },
  {
    "slug": "water-supply-planning-and-development",
    "title": "Water Supply Planning and Development",
    "summary": "Planning and development of water supply systems.",
    "yearLevel": null,
    "semester": null,
    "category": "specialization",
    "classification": "ched-specialized-course",
    "specialization": "Water Resources Engineering",
    "aliases": [
      "water supply"
    ],
    "sourceReference": "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
    "sourceNote": "Listed in the CHED reference as a specialized course area. Course names and availability may vary by university and elective track.",
    "availability": "coming-soon",
    "displayOrder": 62
  },
  {
    "slug": "coastal-engineering",
    "title": "Coastal Engineering",
    "summary": "Engineering for shorelines and coastal environments.",
    "yearLevel": null,
    "semester": null,
    "category": "specialization",
    "classification": "ched-specialized-course",
    "specialization": "Water Resources Engineering",
    "aliases": [
      "coastal processes"
    ],
    "sourceReference": "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
    "sourceNote": "Listed in the CHED reference as a specialized course area. Course names and availability may vary by university and elective track.",
    "availability": "coming-soon",
    "displayOrder": 63
  },
  {
    "slug": "river-engineering",
    "title": "River Engineering",
    "summary": "River processes and engineering interventions.",
    "yearLevel": null,
    "semester": null,
    "category": "specialization",
    "classification": "ched-specialized-course",
    "specialization": "Water Resources Engineering",
    "aliases": [
      "river systems"
    ],
    "sourceReference": "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
    "sourceNote": "Listed in the CHED reference as a specialized course area. Course names and availability may vary by university and elective track.",
    "availability": "coming-soon",
    "displayOrder": 64
  },
  {
    "slug": "ground-water-flow-modeling",
    "title": "Ground Water Flow Modeling",
    "summary": "Concepts used to model groundwater flow.",
    "yearLevel": null,
    "semester": null,
    "category": "specialization",
    "classification": "ched-specialized-course",
    "specialization": "Water Resources Engineering",
    "aliases": [
      "groundwater modeling"
    ],
    "sourceReference": "https://legacy.ched.gov.ph/wp-content/uploads/2018/04/CMO-92-s.-2017-BS-Civil-Engineering.pdf",
    "sourceNote": "Listed in the CHED reference as a specialized course area. Course names and availability may vary by university and elective track.",
    "availability": "coming-soon",
    "displayOrder": 65
  },
  {
    "slug": "basic-algebra",
    "title": "Basic and Advanced Algebra",
    "summary": "Arithmetic, exponents, radicals, factoring, functions, systems, and rearranging engineering formulas.",
    "yearLevel": null,
    "semester": null,
    "category": "math-foundation",
    "classification": "supplementary-math-foundation",
    "specialization": null,
    "aliases": [
      "basic algebra",
      "equations",
      "factoring",
      "ratios"
    ],
    "sourceReference": "CEStudy supplementary review catalog",
    "sourceNote": "Supplementary review topic. It is not represented as a standalone course required by CMO No. 92, s. 2017.",
    "availability": "in-preparation",
    "displayOrder": 66
  },
  {
    "slug": "trigonometry",
    "title": "Trigonometry",
    "summary": "Angles, trig functions, identities, and triangle-solving methods.",
    "yearLevel": null,
    "semester": null,
    "category": "math-foundation",
    "classification": "supplementary-math-foundation",
    "specialization": null,
    "aliases": [
      "sine",
      "cosine",
      "tangent",
      "trig"
    ],
    "sourceReference": "CEStudy supplementary review catalog",
    "sourceNote": "Supplementary review topic. It is not represented as a standalone course required by CMO No. 92, s. 2017.",
    "availability": "coming-soon",
    "displayOrder": 67
  },
  {
    "slug": "analytic-geometry",
    "title": "Analytic Geometry",
    "summary": "Coordinates, lines, circles, conics, and coordinate-based problem solving.",
    "yearLevel": null,
    "semester": null,
    "category": "math-foundation",
    "classification": "supplementary-math-foundation",
    "specialization": null,
    "aliases": [
      "coordinate geometry",
      "conic sections"
    ],
    "sourceReference": "CEStudy supplementary review catalog",
    "sourceNote": "Supplementary review topic. It is not represented as a standalone course required by CMO No. 92, s. 2017.",
    "availability": "coming-soon",
    "displayOrder": 68
  },
  {
    "slug": "solid-mensuration",
    "title": "Solid Mensuration",
    "summary": "Perimeter, area, surface area, volume, and common figures.",
    "yearLevel": null,
    "semester": null,
    "category": "math-foundation",
    "classification": "supplementary-math-foundation",
    "specialization": null,
    "aliases": [
      "area",
      "volume",
      "surface area"
    ],
    "sourceReference": "CEStudy supplementary review catalog",
    "sourceNote": "Supplementary review topic. It is not represented as a standalone course required by CMO No. 92, s. 2017.",
    "availability": "coming-soon",
    "displayOrder": 69
  },
  {
    "slug": "plane-geometry",
    "title": "Plane Geometry",
    "summary": "Core geometry concepts for technical and engineering problems.",
    "yearLevel": null,
    "semester": null,
    "category": "math-foundation",
    "classification": "supplementary-math-foundation",
    "specialization": null,
    "aliases": [
      "geometry"
    ],
    "sourceReference": "CEStudy supplementary review catalog",
    "sourceNote": "Supplementary review topic. It is not represented as a standalone course required by CMO No. 92, s. 2017.",
    "availability": "coming-soon",
    "displayOrder": 70
  },
  {
    "slug": "vectors-and-unit-conversions",
    "title": "Vectors and Unit Conversions",
    "summary": "Vector fundamentals, unit conversion, and dimensional consistency.",
    "yearLevel": null,
    "semester": null,
    "category": "math-foundation",
    "classification": "supplementary-math-foundation",
    "specialization": null,
    "aliases": [
      "vectors",
      "unit conversion",
      "dimensional analysis"
    ],
    "sourceReference": "CEStudy supplementary review catalog",
    "sourceNote": "Supplementary review topic. It is not represented as a standalone course required by CMO No. 92, s. 2017.",
    "availability": "coming-soon",
    "displayOrder": 71
  },
  {
    "slug": "precalculus-and-functions",
    "title": "Precalculus and Functions",
    "summary": "Functions, logarithms, graphs, and prerequisites for higher mathematics.",
    "yearLevel": null,
    "semester": null,
    "category": "math-foundation",
    "classification": "supplementary-math-foundation",
    "specialization": null,
    "aliases": [
      "functions",
      "logarithms",
      "precalculus"
    ],
    "sourceReference": "CEStudy supplementary review catalog",
    "sourceNote": "Supplementary review topic. It is not represented as a standalone course required by CMO No. 92, s. 2017.",
    "availability": "coming-soon",
    "displayOrder": 72
  }
];
