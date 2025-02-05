
interface Player {
    id: string;
    name: string;
    cards: string[];
}

interface SocketObject {
    data: {
        actions: string[];
        cards: string[];
        state: {
            attackers_passes: string[];
            beaten: string[];
            current_player_id: string;
            deck: string[];
            players: Player[];
            table: string[];
        };
        topic: string;
        type: string;
        user_id: number;
    };
}


export default SocketObject;

