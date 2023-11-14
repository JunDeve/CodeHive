import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./Main.css";

function Main() {
    const navigate = useNavigate();

    const PageGO = (event) => {
        const buttonText = event.currentTarget.textContent;

        if (buttonText === "Home Page") {
            navigate('/HomePage');
        }
        else if (buttonText === "Graph Page") {
            navigate('/GraphPage');
        }
        else if (buttonText === "Home TextPage"){
            navigate('/TextPage');
        }
        else {
            alert('사이트 존재 x');
        }
    }
    return (
        <div className="Main">
            <div className="HomeButton">
                <button onClick={PageGO}>Home Page</button>
            </div>
            <div className="GraphButton">
                <button onClick={PageGO}>Graph Page</button>
            </div>
            <div className ="GraphButton">
                <button onClick={PageGO}>Home TextPage</button>
            </div>
        </div>
    )
}
export default Main;