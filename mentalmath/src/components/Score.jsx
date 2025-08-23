function Score({score, total}) {

    const accuracy = total > 0 ? (Math.round(score / total * 100)) : ''

    return(
        <div className = 'score'>
            <h3>Correct: {score}</h3>
            <h3>Total: {total}</h3>
            <h3>Accuracy: {accuracy}%</h3>
        </div>
    )

}

export default Score