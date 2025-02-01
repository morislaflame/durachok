export const TOKEN = 'token';



export interface ApiError {
    code: number;
    message: string;
}

interface FetchOptions<T> extends RequestInit {
    data?: T;
    headers?: HeadersInit;
}


interface PostParams<T> {
    input?: RequestInfo;
    body?: T;
    init?: FetchOptions<T>;
 }


export async function post<T>(input: string, {body, init}: PostParams<T>
): Promise<Response> {
    const {headers, ...restInit} = init ?? {};

    return fetcher(input, {
        method: "POST",
        headers: {
            ...(headers || {}),
        },
        ...restInit,
        body: JSON.stringify(body),
    });
}



export async function trash<T>(input: string, {body, init}: PostParams<T>
): Promise<Response> {
    const {headers, ...restInit} = init ?? {};

    return fetcher(input, {
        method: "DELETE",
        headers: {
            ...(headers || {}),
        },
        ...restInit,
        body: JSON.stringify(body),
    });
}







export async function patch<T>(input: string, {body, init}: PostParams<T>
): Promise<Response> {
    const {headers, ...restInit} = init ?? {};

    return fetcher(input, {
        method: "PATCH",
        headers: {
            ...(headers || {}),
        },
        ...restInit,
        body: JSON.stringify(body),
    });
}



export const fetcher = async <T>(
    input: RequestInfo,
    options?: FetchOptions<T>,
): Promise<Response> => {

    const apiURL = "https://durak-back.1k.games";

    let requestOptions = {
        ...options,
        headers: {
            "Content-Type": "application/json",
            "token": `${localStorage.getItem(TOKEN)}`,
            ...options?.headers,
        },
    };

    if (options?.data) {
        requestOptions.body = JSON.stringify(options.data);
    }

    try {
        const response = await fetch(`${apiURL}${input}`, requestOptions);
        if (response.status === 401 || response.status === 422) {

            // localStorage.removeItem('token');
            //
            // const resp = await authHandler(retrieveLaunchParams().initDataRaw as string);
            // localStorage.setItem('token', resp.result.auth.token);
            // return fetcher(input, options);


        } else if (response.status >= 400) {
            const result = (await response.json()) as ApiError;
            return Promise.reject(result);
         }
        return response;
    } catch (error) {
        console.log(error)
        throw error;
    }
};



interface FetchSWR<T> {
    input: RequestInfo;
    init?: FetchOptions<T>;
 }

export async function fetchSWR<T>({
                                      input,
                                  }: FetchSWR<T>): Promise<T> {

    const response = await fetcher(input);
    return await response.json();
}


