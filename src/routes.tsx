import React from "react";
import App from "./App";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Pages:React.FC = () => {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App/>}></Route>
            </Routes>
        </BrowserRouter>
    )
}

export default Pages