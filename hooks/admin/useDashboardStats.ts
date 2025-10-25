import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useDashboardStats() {
    const { data, error, isLoading } = useSWR('/api/admin/dashboard-stats', fetcher);
    return {
        stats: data,
        isLoading,
        isError: !!error,
    };
}
