import {fetchSWR, post, trash} from "../api-client";
import {Game, Pagination} from "../model";
import useSWRInfinite from "swr/infinite";


export interface GameProps {
    limit: number
}

export const useGame = ({limit}: GameProps) => {
    const params = new URLSearchParams()
    if (limit) params.append('limit', limit.toString());


    return useSWRInfinite(
        (index, previousPageData) => {
            if (previousPageData && !previousPageData.items.length) return null
            const params = new URLSearchParams()
            if (limit) params.append('limit', limit.toString());
            params.append('page', (index + 1).toString())
            return `/api/v1/game?${params.toString()}`
        },
        (url) => fetchSWR<Pagination<Game>>({input: url}), {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            errorRetryCount: 3,
            revalidateOnMount: true
        }
    );
}


export const joinGame = async ({gameId}: { gameId: number }) => {
    const response = await post(`/api/v1/game/${gameId}/join`, {
        body: {}
    });

    return (await response.json()) as { id: number }
}


export const leaveGame = async () => {
    const response = await trash(`/api/v1/game/leave`, {
        body: {}
    });

    return (await response.json()) as { id: number }
}


// 'https://durak-back.1k.games/api/v1/game/quick?players=3' \
// ё

export const quickGame = async ({players}: { players: number }) => {
    const response = await post(`/api/v1/game/quick?players=${players}`, {
        body: {}
    });

    return (await response.json()) as { id: number }
}


export interface CreateGameProps {
    bet: number,
    maxPlayers: number,
    friendsOnly: boolean
}

export const createGame = async ({bet, maxPlayers, friendsOnly}: CreateGameProps) => {
    const response = await post(`/api/v1/game`, {
        body: {
            bet,
            max_players: maxPlayers,
            friends_only: friendsOnly
        }
    });

    return (await response.json()) as { id: number }
}

