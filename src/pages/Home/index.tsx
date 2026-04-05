import { Link } from "react-router-dom";

import AppTopBar from "@/components/common/AppTopBar";
import HomeSectionCard from "@/components/home/HomeSectionCard";
import HomeSentimentChart from "@/components/home/HomeSentimentChart";
import HomeStoryBoard from "@/components/home/HomeStoryBoard";
import AnxiousCandleChart from "@/components/ui/AnxiousCandleChart";
import BottomGradientBackdrop from "@/components/ui/BottomGradientBackdrop";

function Home() {
    return (
        <div className="flex min-h-full flex-1 flex-col bg-white">
                <AppTopBar />

            <div className="relative flex-1 overflow-hidden bg-stone-50 pb-[112px]">
                <BottomGradientBackdrop className="pointer-events-none fixed left-1/2 top-[112px] z-0 h-[860px] w-[390px] -translate-x-1/2 overflow-hidden opacity-45" />

                <main className="relative z-10 px-5">
                    <section className="-mx-5 bg-white px-5 pb-8 pt-7">
                        <div className="flex h-8 items-center">
                            <AnxiousCandleChart
                                variant="dark"
                                size="xs"
                                className="w-full opacity-70"
                            />
                        </div>

                        <div className="mt-8 space-y-1">
                            <h1 className="text-left text-2xl leading-9 font-extrabold text-[#1a1a1a]">
                                지금 흔들리고 있나요?
                            </h1>
                            <p className="text-left font-serif text-sm leading-6 text-stone-500">
                                오늘 많은 투자자들이 감정으로 흔들렸어요.
                            </p>
                        </div>

                        <Link
                            to="/chat"
                            className="mt-6 inline-flex h-14 w-full items-center justify-center rounded-2xl bg-stone-900 px-10 text-base leading-6 font-bold text-stone-50 transition-colors hover:bg-stone-800"
                        >
                            살까, 팔까? 지금 살펴봐요.
                        </Link>
                    </section>

                    <div className="mt-6 space-y-5">
                        <HomeSectionCard
                            title="오늘 투자자들의 감정"
                            description="오늘 많이 나타난 패턴을 비율로 봅니다."
                        >
                            <HomeSentimentChart />
                        </HomeSectionCard>

                        <HomeSectionCard
                            title="오늘의 이야기"
                            description="나만 그런게 아니라는 감각을 짧게 확인합니다."
                        >
                            <HomeStoryBoard />
                        </HomeSectionCard>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Home;
