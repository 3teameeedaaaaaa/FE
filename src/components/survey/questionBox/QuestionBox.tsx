import { TypographyH1 } from "@/components/ui/Typography";

import ActionButtons from "../actionButtons/ActionButtons";
import Body from "../body/Body";
import Desc from "../desc/Desc";

const QuestionBox = () => {
    // if (!question) {
    //     return null;
    // }

    return (
        <div>
            <TypographyH1>로그인</TypographyH1>
            <Desc>설명</Desc>
            <Body />
            <ActionButtons />
        </div>
    );
};

export default QuestionBox;
