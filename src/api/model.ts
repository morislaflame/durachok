export interface Game {
    bet: number
    id: number
    maxPlayers: number
    password: string
    players: any[]
    state: any
    status: string
}


export interface Pagination<T> {
    items: T[]
    total: number
    page: number
    limit: number
}


