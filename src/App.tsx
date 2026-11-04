import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { PrivacyPage } from "./pages/PrivacyPage";
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
import { StudyPage } from "./pages/StudyPage";
import { ProgressPage } from "./pages/ProgressPage";
import { ContentReviewPage } from "./pages/ContentReviewPage";
import { ReviewMaterialsPage } from "./pages/ReviewMaterialsPage";
import { MockExamPortalPage } from "./pages/MockExamPortalPage";
import { CommunityPage } from "./pages/CommunityPage";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/review-materials" element={<ReviewMaterialsPage />} />
            <Route path="/mock-exam-portal" element={<MockExamPortalPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/years" element={<YearLevelsPage />} />
            <Route path="/year/:year" element={<YearLevelPage />} />
            <Route path="/math-foundations" element={<MathFoundationsPage />} />
            <Route path="/subjects/:slug" element={<SubjectPage />} />
            <Route path="/study/:slug" element={<StudyPage />} />
            <Route path="/study/:slug/:unit" element={<StudyPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/practice/basic-algebra" element={<PracticePage />} />
            <Route path="/owner/content-review" element={<ContentReviewPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/bug-reports" element={<BugReportsPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/feedbacks" element={<FeedbacksPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
