import { useState, useEffect } from "react";
import { db } from "../firebase";
import { average, collection, getDocs } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts'
import NavBar from "../components/NavBar";

function Stats() {
    const { user } = useAuth()
    const [allQuizData, setAllQuizData] = useState([])
    const [quizData, setQuizData] = useState([])
    const [selectedDifficulty, setSelectedDifficulty] = useState('all')

    useEffect(() => {
        async function fetchData() {
            if (!user?.uid) {
                return
            }

            const quizResultsRef = collection(db, "users", user.uid, "quiz_results")
            const snapshot = await getDocs(quizResultsRef)

            const rawData = snapshot.docs.map((doc, idx) => {
                const {average_time_per_question, accuracy, difficulty} = doc.data()
                return {
                    quiz: `${idx+1}`,
                    averageTime: average_time_per_question,
                    accuracy: accuracy,
                    difficulty: difficulty,
                }
            })

            setAllQuizData(rawData)

        }

        fetchData()
    }, [user])

    useEffect(() => {
        if (selectedDifficulty === 'all') {
            setQuizData(allQuizData)
        }

        else {
            setQuizData(allQuizData.filter( q => q.difficulty === selectedDifficulty))
        }
            
    }, [selectedDifficulty, allQuizData])

    const avgTime = quizData.length
    ? (quizData.reduce((sum, q) => sum + q.averageTime, 0) / quizData.length).toFixed(2)
    : null

    const avgAccuracy = quizData.length
    ? (quizData.reduce((sum, q) => sum + q.accuracy, 0) / quizData.length).toFixed(2)
    : null

    return (
    <div>
        <NavBar />
        <h2>Performance Overview</h2>
        <div>
            <select value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value)}>
                <option value='all'>All</option>
                <option value='easy'>Easy</option>
                <option value='medium'>Medium</option>
                <option value='hard'>Hard</option>
            </select>
        </div>

        {quizData.length > 0 && (
        <div style={{ marginTop: '20px' }}>
            <h3><strong>Average Time per Question:</strong> {avgTime} sec</h3>
            <h3><strong>Average Accuracy:</strong> {avgAccuracy}%</h3>
        </div>
        )}

        <div style={{ display: 'flex', gap: '100px' }}>
        <div style={{ flex: 1 }}>
            <ResponsiveContainer width={500} height={600}>
            <LineChart
                data={quizData}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
                <YAxis domain={[0, 'auto']} />
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quiz" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                type="monotone"
                dataKey="averageTime"
                name="Avg Time (sec)"
                stroke="#8884d8"
                />
            </LineChart>
            </ResponsiveContainer>
        </div>

        <div style={{ flex: 1 }}>
            <ResponsiveContainer width={500} height={600}>
            <LineChart
                data={quizData}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
                <YAxis domain={[0, 'auto']} />
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quiz" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                type="monotone"
                dataKey="accuracy"
                name="Accuracy (%)"
                stroke="#82ca9d"
                />
            </LineChart>
            </ResponsiveContainer>
        </div>
        </div>
    </div>
    )

}

export default Stats