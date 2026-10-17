import { BrowserRouter,Navigate,Route,Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { CatalogPage } from "./pages/CatalogPage";
import { YearLevelPage } from "./pages/YearLevelPage";
import { YearLevelsPage } from "./pages/YearLevelsPage";
import { MathFoundationsPage } from "./pages/MathFoundationsPage";
import { SubjectPage } from "./pages/SubjectPage";
import { PracticePage } from "./pages/PracticePage";
import { ContactPage } from "./pages/ContactPage";
import { SupportPage } from "./pages/SupportPage";
import { BugReportsPage } from "./pages/BugReportsPage";
import { FeedbackPage } from "./pages/FeedbackPage";
import { FeedbacksPage } from "./pages/FeedbacksPage";
export default function App(){return <BrowserRouter><Layout><Routes>
<Route path="/" element={<HomePage/>}/><Route path="/about" element={<AboutPage/>}/><Route path="/catalog" element={<CatalogPage/>}/>
<Route path="/years" element={<YearLevelsPage/>}/><Route path="/year/:year" element={<YearLevelPage/>}/><Route path="/math-foundations" element={<MathFoundationsPage/>}/>
<Route path="/subjects/:slug" element={<SubjectPage/>}/><Route path="/practice/basic-algebra" element={<PracticePage/>}/>
<Route path="/contact" element={<ContactPage/>}/><Route path="/support" element={<SupportPage/>}/><Route path="/bug-reports" element={<BugReportsPage/>}/><Route path="/feedback" element={<FeedbackPage/>}/><Route path="/feedbacks" element={<FeedbacksPage/>}/>
<Route path="*" element={<Navigate to="/" replace/>}/></Routes></Layout></BrowserRouter>}
