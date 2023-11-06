import React from 'react';

import { useNavigate } from 'react-router-dom';

import './Home.css';


function Home() {
    const navigate = useNavigate();

    const PageGo = () => {
        navigate('/Search');
    }
    return (
        <>
            <div className="HomeMain">
                <div className="HomeAbout">
                    <div className="MainFont">
                        <div className="MainLogoFont">
                            A <span className="FontColor">FRESH.</span> INNOVATIVE <br />
                        </div>
                        <div className="MainLogoFont">
                            CREATIVE DESIGN <br />
                        </div>
                        <div className="MainLogoFont">
                            AGENCY IN SUNDERLAND. <br />
                        </div>
                        <div className="MainLogoFont">
                            UK
                        </div>
                    </div>
                    <div className="MainFont2">
                        Creating Immersive Experiences and Shifing Perspectives.
                    </div>
                    <div className="MainFont3">
                        <button onClick={PageGo}>VIEW SERVICES</button>
                    </div>
                </div>
            </div>



        </>
    )
}
export default Home;