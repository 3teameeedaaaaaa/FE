import "./App.css";

import { Route, Routes } from "react-router-dom";

import MainLayout from "./layout/main-layout/MainLayout";
import NoNavLayout from "./layout/no-nav-layout/NoNavLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";

function App() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
            </Route>
            <Route element={<NoNavLayout />}>
                <Route path="/login" element={<Login />} />
            </Route>
        </Routes>
    );
}

export default App;
