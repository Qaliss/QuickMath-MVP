import { useState } from "react";


function QuestionCard({question}) {

    return (
        <div className = "question-card">
            <h1>{question}</h1>
        </div>
    )
}

export default QuestionCard;