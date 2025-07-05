import QuestionCard from "../components/QuestionCard";
import Score from "../components/Score";
import { useState } from "react";
import CountdownTimer from "../components/Timer";

function Home() {
    
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function generateQuestion() {

        const operators = ['+', '-', '*']
        const operator = operators[Math.floor(Math.random() * operators.length)]

        if (operator === '+') {
            const num1 = getRandomInt(1, 100);
            const num2 = getRandomInt(1, 100);

            const answer = num1 + num2

            const question =  `${num1} + ${num2}`

            return {question, answer}
        }

        else if (operator === '-') {
            const num1 = getRandomInt(1, 100);
            const num2 = getRandomInt(1, 100);

            const answer = num1 - num2

            const question = `${num1} - ${num2}`

            return {question, answer}
        }

        else {
            const num1 = getRandomInt(1, 10);
            const num2 = getRandomInt(1, 10);

            const answer = num1 * num2

            const question = `${num1} * ${num2}`
            
            return {question, answer}
        }

    }

    function handleSubmit(e) {
        e.preventDefault()
        const formData = new FormData(e.target)
        const userAnswer = parseInt(formData.get('answer'))
        console.log(userAnswer)
        console.log(questionData.answer)

        setTotal(total + 1)

        if (userAnswer === questionData.answer) {

            const timeEnd = Date.now()
            const timeTaken = (timeEnd - timeStart) / 1000

            setTimePerQuestion(prev => [...prev, timeTaken])
            setQuestionData(generateQuestion())
            setScore(score + 1)
            setTimeStart(Date.now())
        }

        e.target.reset()

    }

    const handleTimeUp = () => {
        const timeEnd = Date.now()
        const timeTaken = (timeEnd - timeStart) / 1000

        setTimePerQuestion(prev => [...prev, timeTaken])
        setGameOver(true)
    }

    const [questionData, setQuestionData] = useState(generateQuestion())
    const [score, setScore] = useState(0)
    const [total, setTotal] = useState(0)
    const [gameOver, setGameOver] = useState(false)
    const [timeStart, setTimeStart] = useState(Date.now())
    const [timePerQuestion, setTimePerQuestion] = useState([])

    if (gameOver) {



        const sum = timePerQuestion.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
        const averageTimePerQuestion = (sum / timePerQuestion.length)
        const roundedTimePerQuestion = averageTimePerQuestion.toFixed(2)

        const accuracy = score / total * 100
        const roundedAccuracy = accuracy.toFixed(2)

        return <div className='gameover-screen'>
            <h1>Game Over</h1>
            <h3>Your Score: {score} / {total}</h3>
            <h3>Accuracy: {roundedAccuracy}%</h3>
            <h3>Average time per question: {roundedTimePerQuestion} seconds</h3>
            <button onClick={() => window.location.reload()}>Play Again</button>
        </div>
    }

    return (
        <div>
            <h1>Mental Math</h1>
            <QuestionCard question = {questionData.question}/>
            <div className = 'play'>
                <form 
                onSubmit={handleSubmit}
                className = 'answer-form'>
                    <input
                        type = 'number'
                        name = 'answer'
                        placeholder = ''
                        className = 'answer-input'
                        />
                </form>
            </div>

            <Score score={score} total={total} />
            <CountdownTimer duration = {10} onComplete = {handleTimeUp}/>
        </div>


    )
}

export default Home