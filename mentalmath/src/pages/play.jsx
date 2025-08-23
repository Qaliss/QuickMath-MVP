import QuestionCard from "../components/QuestionCard";
import Score from "../components/Score";
import { useState, useEffect } from "react";
import CountdownTimer from "../components/Timer";
import {auth, db} from "../firebase.js"
import { doc, collection, addDoc, average } from "firebase/firestore";
import NavBar from "../components/NavBar.jsx";
import "../css/Play.css"
import { useXP } from "../contexts/XPContext.jsx";

function Play() {

    /* Pieces of state */
    const [questionData, setQuestionData] = useState({ question: '' })
    const [score, setScore] = useState(0)
    const [total, setTotal] = useState(0)
    const [gameOver, setGameOver] = useState(false)
    const [timeStart, setTimeStart] = useState(Date.now())
    const [timePerQuestion, setTimePerQuestion] = useState([])
    const [hasStarted, setHasStarted] = useState(false)
    const [difficulty, setDifficulty] = useState('easy')
    const [duration, setDuration] = useState('30')
    const [gameXP, setGameXP] = useState(0)
    const [saveResults, setSaveResults] = useState(false)

    const {refreshXP} = useXP()
    /* Save every game */
    useEffect(() => {
        if (gameOver && !saveResults) {
            saveResultsToDatabase();
            setSaveResults(true);
            }
        }, [gameOver, saveResults]);

    /* Generate a question to start */
    useEffect(() => {
        if (!questionData || !questionData.question) {
            setQuestionData(betterQuestionGenerator({difficulty}));
        }
    }, [difficulty, questionData, betterQuestionGenerator]);
    
    /* Helper function to get integers */
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /* Generate Questions */
    function betterQuestionGenerator ({ difficulty }) {

        const operators = ['+', '-', '*']
        let operator = operators[Math.floor(Math.random() * operators.length)]

        switch (difficulty) {
            case 'easy':
                
                if (operator === '+') {
                    const num1 = getRandomInt(1, 100);
                    const num2 = getRandomInt(1, 10);

                    const answer = num1 + num2

                    const question =  `${num1} + ${num2}`

                    return {question, answer}
                }

                else if (operator === '-') {
                    const num1 = getRandomInt(1, 100);
                    const num2 = getRandomInt(1, 10);

                    const answer = num1 - num2

                    const question = `${num1} - ${num2}`

                    return {question, answer}
                }

                else if (operator ==='*') {
                    const num1 = getRandomInt(1, 10);
                    const num2 = getRandomInt(1, 10);

                    const answer = num1 * num2

                    const question = `${num1} * ${num2}`
                    
                    return {question, answer}
                }
            
            case 'medium':

                operators.push('÷', '^')
                operator = operators[Math.floor(Math.random() * operators.length)]

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

                else if (operator === '*') {
                    const num1 = getRandomInt(10, 100);
                    const num2 = getRandomInt(1, 10);

                    const answer = num1 * num2

                    const question = `${num1} * ${num2}`
                    
                    return {question, answer}
                }

                else if (operator === '÷') {
                    const num1 = getRandomInt(1, 100);
                    const answer = getRandomInt(1, 10);

                    const num2 = num1 * answer

                    const question = `${num2} ÷ ${num1}`

                    return {question, answer}
                }

                else {
                    const num1 = getRandomInt(1, 10)
                    const num2 = getRandomInt(1, 2)

                    const answer = Math.pow(num1, num2)

                    const question = `${num1} ^ ${num2}`

                    return {question, answer}
                }

            
            case 'hard':

                operators.shift()
                operators.shift()
                operator = operators[Math.floor(Math.random() * operators.length)]
                
                if (operator === '*') {
                    const num1 = getRandomInt(1, 100);
                    const num2 = getRandomInt(1, 100);

                    const answer = num1 * num2

                    const question = `${num1} * ${num2}`
                    
                    return {question, answer}
                }

                else if (operator === '÷') {
                    const num1 = getRandomInt(1, 1000);
                    const answer = getRandomInt(1, 10);

                    const num2 = num1 * answer

                    const question = `${num2} ÷ ${num1}`

                    return {question, answer}
                }

                else {
                    const num1 = getRandomInt(1, 20)
                    const num2 = getRandomInt(1, 3)

                    const answer = Math.pow(num1, num2)

                    const question = `${num1} ^ ${num2}`

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

        if (!hasStarted) {
            setHasStarted(true)
        }

        if (userAnswer === questionData.answer) {

            const timeEnd = Date.now()
            const timeTaken = (timeEnd - timeStart) / 1000
            console.log('Correct')
            setTimePerQuestion(prev => [...prev, timeTaken])
            setQuestionData(betterQuestionGenerator({difficulty}))
            setScore(score + 1)
            setTimeStart(Date.now())
        }

        else {
            console.log('Incorrect')
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

        let xp = 50;
        switch (difficulty) {
            case 'medium':
                console.log('medium bonus')
                xp += 20;
                break;
            case 'hard':
                console.log('hard bonus')
                xp += 30;
                break;
        }
        if (parseFloat(accuracy) === 100) {
            console.log('accuracy bonus')
            xp += 10;
        }
        if (parseFloat(accuracy) <= 70) {
            console.log('accuracy penalty')
            xp -= 10;
        }
        if (parseFloat(accuracy) > 70 && parseFloat(averageTime) <= 4) {
            console.log('speed bonus')
            xp += 5;
        }

        // Update the state for potential display
        setGameXP(xp);
            
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
                xp: parseInt(xp),
            });

            console.log("Document written with ID:", quizRef.id);
            console.log(`XP: ${xp}`)

            await refreshXP()

        } catch (e) {
            console.error("Error adding document:", e.message || e);
            alert("Failed to add data");
        }
    };

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

            <div className='setup-ribbon'>
                <span className='control-label'>Difficulty</span>
                <div className='difficulty-group'>
                    <button 
                            className={`control-btn ${difficulty === 'easy' ? 'active' : ''}`}
                            onClick={() => {
                                if (difficulty != 'easy') {
                                    setDifficulty('easy');
                                    setQuestionData(betterQuestionGenerator({difficulty: 'easy'}));
                                    setHasStarted(false);
                                    setScore(0);
                                    setTotal(0);
                                    setTimeStart(Date.now());
                                    setTimePerQuestion([]);
                                }

                            }}
                        >
                            Easy
                    </button>
                    <button 
                            className={`control-btn ${difficulty === 'medium' ? 'active' : ''}`}
                            onClick={() => {
                                if (difficulty != 'medium') {
                                    setDifficulty('medium');
                                    setQuestionData(betterQuestionGenerator({difficulty: 'medium'}));
                                    setHasStarted(false);
                                    setScore(0);
                                    setTotal(0);
                                    setTimeStart(Date.now());
                                    setTimePerQuestion([]);
                                }

                            }}
                        >
                            Medium
                    </button>
                    <button 
                            className={`control-btn ${difficulty === 'hard' ? 'active' : ''}`}
                            onClick={() => {
                                if (difficulty != 'hard') {
                                    setDifficulty('hard');
                                    setQuestionData(betterQuestionGenerator({difficulty: 'hard'}));
                                    setHasStarted(false);
                                    setScore(0);
                                    setTotal(0);
                                    setTimeStart(Date.now());
                                    setTimePerQuestion([]);
                                }

                            }}
                        >
                            Hard
                    </button>
                </div>
                <span className='control-label'>Duration</span>
                <div className='timer-group'>
                    <button 
                            className={`control-btn ${duration === '30' ? 'active' : ''}`}
                            onClick={() => {
                                setDuration('30');
                                setHasStarted(false);
                            }}
                        >
                            30s
                    </button>
                    <button 
                            className={`control-btn ${duration === '60' ? 'active' : ''}`}
                            onClick={() => {
                                setDuration('60');
                                setHasStarted(false);
                            }}
                        >
                            60s
                    </button>
                    <button 
                            className={`control-btn ${duration === '90' ? 'active' : ''}`}
                            onClick={() => {
                                setDuration('90');
                                setHasStarted(false);
                            }}
                        >
                            90s
                    </button>
                </div>
            </div>
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
            {hasStarted && (
                <CountdownTimer duration={duration} onComplete={handleTimeUp} />
            )}
        </div>


    )
}

export default Play