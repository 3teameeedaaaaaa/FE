import "./App.css";

import { Route, Routes } from "react-router-dom";

import MainLayout from "./layout/main-layout/MainLayout";
import NoNavLayout from "./layout/no-nav-layout/NoNavLayout";
import Chat from "./pages/Chat";
import ChatConversation from "./pages/ChatConversation";
import ChatResult from "./pages/ChatResult";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Records from "./pages/Records";
import Survey from "./pages/Survey";
import SurveyCompletion from "./pages/SurveyCompletion";

function App() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/records" element={<Records />} />
            </Route>
            <Route element={<NoNavLayout />}>
                <Route path="/login" element={<Login />} />
                <Route
                    path="/chat/:surveyType/conversation"
                    element={<ChatConversation />}
                />
                <Route path="/chat/:surveyType/result" element={<ChatResult />} />
                <Route path="/chat/:surveyType/:step" element={<Survey />} />
                <Route
                    path="/chat/:surveyType/:step/done"
                    element={<SurveyCompletion />}
                />
            </Route>
        </Routes>
    );
}

export default App;
