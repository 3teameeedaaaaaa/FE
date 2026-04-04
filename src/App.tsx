import "./App.css";

import { Route, Routes } from "react-router-dom";

import MainLayout from "./layout/main-layout/MainLayout";
import NoNavLayout from "./layout/no-nav-layout/NoNavLayout";
import Chat from "./pages/Chat";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Survey from "./pages/Survey";

function App() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/chat" element={<Chat />} />
            </Route>
            <Route element={<NoNavLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/chat/:surveyType/:step" element={<Survey />} />
            </Route>
        </Routes>
    );
}

export default App;
