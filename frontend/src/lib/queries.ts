import { useQuery } from "@tanstack/react-query";
import { getRequest } from "./requests";
import { EndpointType, QueryParamType } from "./types";

export const GetQuery = (
    url: keyof EndpointType,
    query: QueryParamType = { pathname: "", params: {} },
    enabled: boolean = true
) => {
    return useQuery({
        queryKey: [url, query],
        queryFn: () => getRequest(url, query),
        enabled: enabled,
        refetchOnWindowFocus: false,
        retry: false,
    });
};
