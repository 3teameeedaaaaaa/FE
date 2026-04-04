import "./ai-aura-indicator.css";

interface AiAuraIndicatorProps {
    size?: number;
    className?: string;
    variant?: "light" | "dark";
}

function AiAuraIndicator({
    size = 1,
    className = "",
    variant = "light",
}: AiAuraIndicatorProps) {
    return (
        <div
            className={`ai-aura-loader variant-${variant} flex items-center justify-center ${className}`}
            style={{ "--size": size } as React.CSSProperties}
        >
            {/* v1 오라는 회전 기반 메타볼 움직임이 핵심이라 마스크 id도 원본 형태를 유지한다. */}
            <svg width="100" height="100" viewBox="0 0 100 100">
                <defs>
                    <mask id="aura-clipping">
                        <polygon
                            points="0,0 100,0 100,100 0,100"
                            fill="black"
                        />
                        <polygon points="25,25 75,25 50,75" fill="white" />
                        <polygon points="50,25 75,75 25,75" fill="white" />
                        <polygon points="35,35 65,35 50,65" fill="white" />
                        <polygon points="35,35 65,35 50,65" fill="white" />
                        <polygon points="35,35 65,35 50,65" fill="white" />
                        <polygon points="35,35 65,35 50,65" fill="white" />
                    </mask>
                </defs>
            </svg>
            <div className="aura-box" />
        </div>
    );
}

export default AiAuraIndicator;
