import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ComponentPage } from "./pages/ComponentPage";
import { ComponentsIndex } from "./pages/ComponentsIndex";
import { GettingStarted } from "./pages/GettingStarted";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { Theming } from "./pages/Theming";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="getting-started" element={<GettingStarted />} />
        <Route path="theming" element={<Theming />} />
        <Route path="components" element={<ComponentsIndex />} />
        <Route path="components/:slug" element={<ComponentPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
