import { useParams } from "react-router-dom";

function useSurveyType() {
    const params = useParams();

    return params.surveyType;
}

export default useSurveyType;
