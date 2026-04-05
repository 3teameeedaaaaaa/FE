import gradientBlue from "@/assets/chat/gradient-blue.svg";
import gradientPeach from "@/assets/chat/gradient-peach.svg";
import gradientPurple from "@/assets/chat/gradient-purple.svg";

interface BottomGradientBackdropProps {
    className?: string;
}

function BottomGradientBackdrop({
    className = "absolute left-0 top-[353px] h-[772px] w-[390px] overflow-hidden",
}: BottomGradientBackdropProps) {
    return (
        <div className={className}>
            <div
                className="absolute flex h-[565px] w-[561px] items-center justify-center"
                style={{ left: "-118px", top: "205px" }}
            >
                <div style={{ transform: "rotate(51.69deg) skewX(0.53deg)" }}>
                    <div
                        className="relative"
                        style={{ width: "399px", height: "403px" }}
                    >
                        <img
                            src={gradientBlue}
                            alt=""
                            className="absolute block max-w-none"
                            style={{
                                inset: "-37.27% -37.62%",
                                width: "174.74%",
                                height: "174.54%",
                            }}
                        />
                    </div>
                </div>
            </div>

            <div
                className="absolute flex h-[517px] w-[514px] items-center justify-center"
                style={{ left: "-109px", top: "43px" }}
            >
                <div style={{ transform: "rotate(-34.82deg) skewX(-0.51deg)" }}>
                    <div
                        className="relative"
                        style={{ width: "375px", height: "367px" }}
                    >
                        <img
                            src={gradientPurple}
                            alt=""
                            className="absolute block max-w-none"
                            style={{
                                inset: "-40.93% -40%",
                                width: "180%",
                                height: "181.86%",
                            }}
                        />
                    </div>
                </div>
            </div>

            <div
                className="absolute flex h-[518px] w-[486px] items-center justify-center"
                style={{ left: "39px", top: "87px" }}
            >
                <div style={{ transform: "rotate(-34.82deg) skewX(-0.51deg)" }}>
                    <div
                        className="relative"
                        style={{ width: "308px", height: "414px" }}
                    >
                        <img
                            src={gradientPeach}
                            alt=""
                            className="absolute block max-w-none"
                            style={{
                                inset: "-36.2% -48.72%",
                                width: "197.44%",
                                height: "172.4%",
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BottomGradientBackdrop;
