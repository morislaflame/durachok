import './App.css';
import {BrowserRouter, Route, Routes} from "react-router";
import {Game} from "./views/game.tsx";
import {MainView} from "./views/main.tsx";
import {CreateGame} from "./views/create-game.tsx";
import {BuyView} from "./views/buy.tsx";


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/create" element={<CreateGame/>}/>
                <Route path="/game/:id" element={<Game/>}/>
                <Route path="/" element={<MainView/>}/>
                <Route path="*" element={<div>Not Found</div>}/>
                <Route path="/buy" element={<BuyView/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;