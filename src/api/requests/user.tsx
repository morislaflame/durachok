import useSWR from "swr";
import {fetchSWR} from "../api-client.ts";

export const useUser = (skip?: boolean) => {
    return useSWR(skip ? undefined :
            '/api/v1/user/me',
        (url) => fetchSWR<any>({input: url})
    );
}
