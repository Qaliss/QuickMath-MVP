import QuestionCard from "../components/QuestionCard";
import Score from "../components/Score";
import { useState } from "react";

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
            setQuestionData(generateQuestion())
            setScore(score + 1)
        }

        e.target.reset()

    }

    const [questionData, setQuestionData] = useState(generateQuestion())
    const [score, setScore] = useState(0)
    const [total, setTotal] = useState(0)

    return (
        <div>
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
        </div>


    )
}

export default Home