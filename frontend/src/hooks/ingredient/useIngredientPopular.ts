import { useQuery } from "@tanstack/react-query";

export function useIngredientPopular() {
    const { data: popularItems = [], isPending: isPopularPending } = useQuery({
        queryKey: ["ingredientPopular"],
        queryFn: async () => {
            const res = await fetch("http://localhost:4000/api/ingredients/popular");
            if (!res.ok) throw new Error("Lỗi khi tải dữ liệu phổ biến");
            const json = await res.json();
            return json.data;
        },
        staleTime: 5 * 60_000, // Cache trong 5 phút
    });

    return { popularItems, isPopularPending };
}