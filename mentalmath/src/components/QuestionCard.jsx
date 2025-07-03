import { useState } from "react";


function QuestionCard({question}) {

    return (
        <div className = "question-card">
            <h2>{question}</h2>
        </div>
    )
}

export default QuestionCard;