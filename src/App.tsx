import './App.css';
import {BrowserRouter, Route, Routes} from "react-router";
import {Game} from "./views/game.tsx";
import {MainView} from "./views/main.tsx";
import {CreateGame} from "./views/create-game.tsx";
import {TestGame} from "./views/test-game.tsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/create" element={<CreateGame/>}/>
                <Route path="/game" element={<Game/>}/>
                <Route path="/" element={<MainView/>}/>
                <Route path="/test" element={<TestGame/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;