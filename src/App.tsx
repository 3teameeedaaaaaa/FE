import "./App.css";

import { Route, Routes } from "react-router-dom";

import MainLayout from "./layout/main-layout/MainLayout";
import NoNavLayout from "./layout/no-nav-layout/NoNavLayout";
import AIChat from "./pages/AIChat";
import Chat from "./pages/Chat";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Survey from "./pages/Survey";
import SurveyCompletion from "./pages/SurveyCompletion";

function App() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
            </Route>
            <Route element={<NoNavLayout />}>
                <Route path="/chat" element={<Chat />} />
                <Route path="/login" element={<Login />} />
                <Route path="/chat/:surveyType/:step" element={<Survey />} />
                <Route
                    path="/chat/:surveyType/:step/done"
                    element={<SurveyCompletion />}
                />
                <Route path="/aichat/:sessionId" element={<AIChat />} />
            </Route>
        </Routes>
    );
}

export default App;
