import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles/global.css";
import Layout from "./components/Layout";
import GalleryPage from "./pages/GalleryPage";
import ProjectPage from "./pages/ProjectPage";
import SubmitPage from "./pages/SubmitPage";
import NotFoundPage from "./pages/NotFoundPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<GalleryPage />} />
          <Route path="/p/:slug" element={<ProjectPage />} />
          <Route path="/submit" element={<SubmitPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
