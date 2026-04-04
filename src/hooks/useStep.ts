import { useParams } from "react-router-dom";

function useStep() {
    const { step } = useParams<{ step?: string }>();

    if (!step) return 0;

    return Number(step);
}

export default useStep;
