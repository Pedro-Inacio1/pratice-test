import React from "react";
import App from "./App";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import RegisterEmployee from "./components/register-employee";
import Login from "./components/Authenticate";

const Pages:React.FC = () => {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/App" element={<App/>}></Route>
                <Route path="/RegisterEmployee" element={<RegisterEmployee/>}></Route>
                <Route path="/Auth" element={<Login/>}></Route>
                <Route path="/" element={<Home/>}></Route>
            </Routes>
        </BrowserRouter>
    )
}

export default Pages