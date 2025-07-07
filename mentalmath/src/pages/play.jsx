import QuestionCard from "../components/QuestionCard";
import Score from "../components/Score";
import { useState, useEffect } from "react";
import CountdownTimer from "../components/Timer";
import {auth, db} from "../firebase.js"
import { doc, collection, addDoc } from "firebase/firestore";
import NavBar from "../components/NavBar.jsx";

function Play() {

    /* Pieces of state */
    const [questionData, setQuestionData] = useState(null)
    const [score, setScore] = useState(0)
    const [total, setTotal] = useState(0)
    const [gameOver, setGameOver] = useState(false)
    const [timeStart, setTimeStart] = useState(Date.now())
    const [timePerQuestion, setTimePerQuestion] = useState([])
    const [hasStarted, setHasStarted] = useState(false)
    const [difficulty, setDifficulty] = useState('medium')
    const [duration, setDuration] = useState('60')
    const [saveResults, setSaveResults] = useState(false)

    useEffect(() => {
        if (gameOver && !saveResults) {
            saveResultsToDatabase();
            setSaveResults(true);
            }
        }, [gameOver, saveResults]);
    
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function betterQuestionGenerator ({ difficulty }) {

        const operators = ['+', '-', '*']
        const operator = operators[Math.floor(Math.random() * operators.length)]

        switch (difficulty) {
            case 'easy':
                
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
            
            case 'medium':
                
                if (operator === '+') {
                    const num1 = getRandomInt(1, 1000);
                    const num2 = getRandomInt(1, 1000);

                    const answer = num1 + num2

                    const question =  `${num1} + ${num2}`

                    return {question, answer}
                }

                else if (operator === '-') {
                    const num1 = getRandomInt(1, 1000);
                    const num2 = getRandomInt(1, 1000);

                    const answer = num1 - num2

                    const question = `${num1} - ${num2}`

                    return {question, answer}
                }

                else {
                    const num1 = getRandomInt(1, 100);
                    const num2 = getRandomInt(1, 10);

                    const answer = num1 * num2

                    const question = `${num1} * ${num2}`
                    
                    return {question, answer}
                }
            
            case 'hard':
                
                if (operator === '+') {
                    const num1 = getRandomInt(1, 10000);
                    const num2 = getRandomInt(1, 10000);

                    const answer = num1 + num2

                    const question =  `${num1} + ${num2}`

                    return {question, answer}
                }

                else if (operator === '-') {
                    const num1 = getRandomInt(1, 10000);
                    const num2 = getRandomInt(1, 10000);

                    const answer = num1 - num2

                    const question = `${num1} - ${num2}`

                    return {question, answer}
                }

                else {
                    const num1 = getRandomInt(1, 100);
                    const num2 = getRandomInt(1, 100);

                    const answer = num1 * num2

                    const question = `${num1} * ${num2}`
                    
                    return {question, answer}
                }
        }
    }

    /* Handlers */
    function handleSubmit(e) {
        e.preventDefault()
        const formData = new FormData(e.target)
        const userAnswer = parseInt(formData.get('answer'))

        setTotal(total + 1)

        if (userAnswer === questionData.answer) {

            const timeEnd = Date.now()
            const timeTaken = (timeEnd - timeStart) / 1000

            setTimePerQuestion(prev => [...prev, timeTaken])
            setQuestionData(betterQuestionGenerator({difficulty}))
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

    const saveResultsToDatabase = async () => {
        const sum = timePerQuestion.reduce((acc, val) => acc + val, 0);
        const averageTime = (sum / timePerQuestion.length).toFixed(2);
        const accuracy = ((score / total) * 100).toFixed(2);
            
        try {
            const user = auth.currentUser;
            if (!user) {
                console.error("No authenticated user");
                return;
            }

            const uid = user.uid;
            const userDocRef = doc(db, "users", uid);
            const quizResultsRef = collection(userDocRef, "quiz_results");

            const quizRef = await addDoc(quizResultsRef, {
                timestamp: new Date(),
                score,
                difficulty,
                duration,
                total,
                accuracy: parseFloat(accuracy),
                average_time_per_question: parseFloat(averageTime),
            });

            console.log("Document written with ID:", quizRef.id);

        } catch (e) {
            console.error("Error adding document:", e.message || e);
            alert("Failed to add data");
        }
    };


    /* Setup */
    if (!hasStarted) {
        return (
            <div className="setup-screen">
                <NavBar />
                <h2>Game Setup</h2>
                <form onSubmit={(e) => {
                    e.preventDefault()
                    setHasStarted(true)
                    setTimeStart(Date.now()) // Initialize start time
                    setQuestionData(betterQuestionGenerator({difficulty}))
                }}>
                    <label>
                        Difficulty:
                        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </label>
                    <label>
                        Duration:
                        <select value={duration} onChange={(e) => setDuration(e.target.value)}>
                            <option value="30">30 seconds</option>
                            <option value="60">60 seconds</option>
                            <option value="90">90 seconds</option>
                        </select>
                    </label>
                    <button type="submit">Start Game</button>
                </form>
            </div>
        )
    }

    /* Game over page */
    if (gameOver) {
        const sum = timePerQuestion.reduce((acc, val) => acc + val, 0);
        const averageTime = (sum / timePerQuestion.length).toFixed(2);
        const accuracy = ((score / total) * 100).toFixed(2);

        return (
            <>
            <NavBar />
            <div className='gameover-screen'>
                <h1>Game Over</h1>
                <h3>Your Score: {score} / {total}</h3>
                <h3>Accuracy: {accuracy}%</h3>
                <h3>Average time per question: {averageTime} seconds</h3>
                <button onClick={() => window.location.reload()}>Play Again</button>
            </div>
        </>)

    }

    /* Main game */
    return (
        <div>
            <NavBar />
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
            <CountdownTimer duration = {duration} onComplete = {handleTimeUp}/>
        </div>


    )
}

export default Play