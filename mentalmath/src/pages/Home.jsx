import QuestionCard from "../components/QuestionCard";
import Score from "../components/Score";
import { useState } from "react";
import CountdownTimer from "../components/Timer";
import { Link } from "react-router-dom";

function Home() {
    
    return (
        <div>
            <button><Link to="/play">Play</Link></button>
            <button><Link to="/Learn">Learn</Link></button>            
        </div>



    )
}

export default Home