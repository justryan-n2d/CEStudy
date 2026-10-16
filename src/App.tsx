import { BrowserRouter,Navigate,Route,Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { CatalogPage } from "./pages/CatalogPage";
import { YearLevelPage } from "./pages/YearLevelPage";
import { YearLevelsPage } from "./pages/YearLevelsPage";
import { MathFoundationsPage } from "./pages/MathFoundationsPage";
import { SubjectPage } from "./pages/SubjectPage";
import { PracticePage } from "./pages/PracticePage";
export default function App(){return <BrowserRouter><Layout><Routes>
<Route path="/" element={<HomePage/>}/><Route path="/catalog" element={<CatalogPage/>}/>
<Route path="/years" element={<YearLevelsPage/>}/><Route path="/year/:year" element={<YearLevelPage/>}/><Route path="/math-foundations" element={<MathFoundationsPage/>}/>
<Route path="/subjects/:slug" element={<SubjectPage/>}/><Route path="/practice/basic-algebra" element={<PracticePage/>}/>
<Route path="*" element={<Navigate to="/" replace/>}/></Routes></Layout></BrowserRouter>}
