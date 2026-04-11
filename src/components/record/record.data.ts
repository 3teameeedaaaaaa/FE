export type RecordHeatmapLevel = "none" | "once" | "several";

export type RecordHeatmapRow = RecordHeatmapLevel[];

export type RecordThoughtStat = {
    label: string;
    percent: number;
    tone: string;
    emphasized?: boolean;
};

export type RecordHistoryItem = {
    id: string;
    emotion: string;
    phase: "사전" | "사후";
    thought: string;
    summary: string;
    createdAt: string;
    ticker?: string | null;
};

export type RecordEntry = {
    id: string;
    emotion: string;
    ticker?: string | null;
    phase: "사전" | "사후";
    date: string;
    thought: string;
    summary: string;
};

const DAY_MS = 24 * 60 * 60 * 1000;

const THOUGHT_TONES: Record<string, string> = {
    "지금 아니면 안된다는 생각": "#44403C",
    "최악을 상상하고 있어요": "#78716C",
    "나만 뒤쳐지는 것 같은 느낌": "#A8A29E",
    "처음 본 가격에 묶여 있어요": "#D6D3D1",
    "감정이 판단을 이끌고 있어요": "#78716C",
    "보고 싶은 것만 보이고 있어요": "#A8A29E",
    "지금 까지 한게 아까운 마음": "#D6D3D1",
    "내가 컨트롤 할 수 있다는 믿음": "#A8A29E",
};

function createIsoDate(daysAgo: number, hour: number) {
    const date = new Date();
    date.setHours(hour, 10, 0, 0);
    date.setTime(date.getTime() - daysAgo * DAY_MS);
    return date.toISOString();
}

export function buildInitialRecordHistory(): RecordHistoryItem[] {
    return [
        {
            id: "seed-1",
            emotion: "조급해요",
            phase: "사후",
            thought: "지금 아니면 안된다는 생각",
            summary: "예전 가격을 기준으로 보고 있었던 이유를 다시 적어봤어요.",
            createdAt: createIsoDate(2, 14),
        },
        {
            id: "seed-2",
            emotion: "불안해요",
            phase: "사후",
            thought: "최악을 상상하고 있어요",
            summary: "손실보다 내가 틀렸다는 감각이 더 크게 남았던 날이었어요.",
            createdAt: createIsoDate(3, 11),
        },
        {
            id: "seed-3",
            emotion: "후회돼요",
            phase: "사후",
            thought: "나만 뒤쳐지는 것 같은 느낌",
            summary: "급하게 반응했던 패턴이 반복되고 있다는 걸 다시 보게 됐어요.",
            createdAt: createIsoDate(5, 10),
        },
        {
            id: "seed-4",
            emotion: "억울해요",
            phase: "사후",
            thought: "처음 본 가격에 묶여 있어요",
            summary: "처음 본 가격을 기준으로 계속 판단하고 있었던 흐름을 적어봤어요.",
            createdAt: createIsoDate(5, 16),
        },
        {
            id: "seed-5",
            emotion: "불안해요",
            phase: "사전",
            thought: "최악을 상상하고 있어요",
            summary: "불안할수록 근거보다 손실 장면을 먼저 떠올리게 됐어요.",
            createdAt: createIsoDate(8, 15),
        },
        {
            id: "seed-6",
            emotion: "초조해요",
            phase: "사전",
            thought: "지금 아니면 안된다는 생각",
            summary: "기회를 놓칠까 봐 서두르던 순간을 다시 적어봤어요.",
            createdAt: createIsoDate(11, 13),
        },
        {
            id: "seed-7",
            emotion: "답답해요",
            phase: "사후",
            thought: "지금 아니면 안된다는 생각",
            summary: "급등 흐름이 지나갈까 봐 조급했던 이유를 돌아봤어요.",
            createdAt: createIsoDate(11, 18),
        },
        {
            id: "seed-8",
            emotion: "긴장돼요",
            phase: "사전",
            thought: "나만 뒤쳐지는 것 같은 느낌",
            summary: "다른 사람보다 늦는다는 감각이 판단을 밀어붙였던 날이었어요.",
            createdAt: createIsoDate(15, 9),
        },
        {
            id: "seed-9",
            emotion: "불안해요",
            phase: "사후",
            thought: "최악을 상상하고 있어요",
            summary: "결과를 확인하기 전에 이미 손실 장면을 크게 만들고 있었어요.",
            createdAt: createIsoDate(18, 17),
        },
        {
            id: "seed-10",
            emotion: "아쉬워요",
            phase: "사후",
            thought: "지금 아니면 안된다는 생각",
            summary: "놓친 흐름을 되돌리고 싶은 마음이 크게 남아 있었어요.",
            createdAt: createIsoDate(21, 12),
        },
    ];
}

export function formatRecordDate(createdAt: string) {
    const date = new Date(createdAt);
    const year = `${date.getFullYear()}`.slice(-2);
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");

    return `${year}.${month}.${day}`;
}

export function buildRecordEntries(records: RecordHistoryItem[]): RecordEntry[] {
    return [...records]
        .sort(
            (left, right) =>
                new Date(right.createdAt).getTime() -
                new Date(left.createdAt).getTime(),
        )
        .map((record) => ({
            id: record.id,
            emotion: record.emotion,
            ticker: record.ticker ?? null,
            phase: record.phase,
            date: formatRecordDate(record.createdAt),
            thought: record.thought,
            summary: record.summary,
        }));
}

export function buildRecordThoughtStats(records: RecordHistoryItem[]): RecordThoughtStat[] {
    const countByThought = new Map<string, number>();

    records.forEach((record) => {
        countByThought.set(record.thought, (countByThought.get(record.thought) ?? 0) + 1);
    });

    const total = records.length || 1;

    return [...countByThought.entries()]
        .sort((left, right) => right[1] - left[1])
        .map(([label, count], index) => ({
            label,
            percent: Math.round((count / total) * 100),
            tone: THOUGHT_TONES[label] ?? "#A8A29E",
            emphasized: index === 0,
        }));
}

function getHeatmapLevel(count: number): RecordHeatmapLevel {
    if (count <= 0) {
        return "none";
    }

    if (count === 1) {
        return "once";
    }

    return "several";
}

function getDayKey(date: Date) {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

export function buildRecordHeatmap(records: RecordHistoryItem[]): RecordHeatmapRow[] {
    const countByDay = new Map<string, number>();

    records.forEach((record) => {
        const date = new Date(record.createdAt);
        const key = getDayKey(date);
        countByDay.set(key, (countByDay.get(key) ?? 0) + 1);
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return Array.from({ length: 4 }, (_, weekIndex) =>
        Array.from({ length: 7 }, (_, dayIndex) => {
            const offset = (3 - weekIndex) * 7 + (6 - dayIndex);
            const current = new Date(today.getTime() - offset * DAY_MS);
            const key = getDayKey(current);
            const count = countByDay.get(key) ?? 0;

            return getHeatmapLevel(count);
        }),
    );
}
