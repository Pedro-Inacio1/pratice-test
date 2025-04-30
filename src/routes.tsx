import React from "react";
import App from "./App";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import RegisterEmployee from "./components/register-employee";

const Pages:React.FC = () => {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App/>}></Route>
                <Route path="/RegisterEmployee" element={<RegisterEmployee/>}></Route>
            </Routes>
        </BrowserRouter>
    )
}

export default Pages