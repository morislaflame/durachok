import './App.css';
import {BrowserRouter, Route, Routes} from "react-router";
import {Game} from "./views/game.tsx";
import {MainView} from "./views/main.tsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/game" element={<Game/>}/>
                <Route path="/" element={<MainView/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;