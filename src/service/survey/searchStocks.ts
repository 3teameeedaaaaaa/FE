import type { Stock } from "@/type/stock";

import api from "../api/api";

export const searchStocks = async (keyword: string): Promise<Stock[]> => {
    const response = await api.get<Stock[]>("/api/stocks/search", {
        params: {
            keyword,
        },
    });

    return response.data;
};
