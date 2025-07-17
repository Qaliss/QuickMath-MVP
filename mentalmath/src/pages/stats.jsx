import { useState, useEffect, useMemo } from "react";
import { auth, db } from "../firebase";
import { average, collection, getDocs, getDoc, doc } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { useXP } from "../contexts/XPContext";
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts'
import NavBar from "../components/NavBar";

function Stats() {
    const { user } = useAuth()
    const { xp, level, xpProgress, xpForNextLevel, currentLevelXP } = useXP();
    const [allQuizData, setAllQuizData] = useState([])
    const [quizData, setQuizData] = useState([])
    const [selectedDifficulty, setSelectedDifficulty] = useState('easy')
    const [userProfile, setUserProfile] = useState(null)

    useEffect(() => {
        async function fetchData() {
            if (!user?.uid) {
                return
            }

            const quizResultsRef = collection(db, "users", user.uid, "quiz_results")
            const snapshot = await getDocs(quizResultsRef)

            const rawData = snapshot.docs.map((doc, idx) => {
                const {average_time_per_question, accuracy, difficulty, timestamp} = doc.data()
                return {
                    quiz: `${idx+1}`,
                    averageTime: average_time_per_question,
                    accuracy: accuracy,
                    difficulty: difficulty,
                    timestamp: timestamp,
                }
            })

            const sortedData = rawData.sort((a, b) => a.timestamp - b.timestamp)
            const finalData = sortedData.map((item, idx) => ({
                ...item,
                quiz: `${idx+1}`,
            }))

            setAllQuizData(finalData)

        }

        fetchData()
    }, [user])

    useEffect(() => {
            setQuizData(allQuizData.filter( q => q.difficulty === selectedDifficulty))       
    }, [selectedDifficulty, allQuizData])

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const user = auth.currentUser
                const uid = user.uid
                if (user) {
                    const userDocRef = doc(db, 'users', uid)
                    const docSnap = await getDoc(userDocRef)

                    if (docSnap.exists())
                        setUserProfile(docSnap.data())
                }
            } catch (error) {
                console.error(error)
            }
        }

        fetchUserProfile()
    }, [])

    const avgTime = quizData.length
    ? (quizData.reduce((sum, q) => sum + q.averageTime, 0) / quizData.length).toFixed(2)
    : null

    const avgAccuracy = quizData.length
    ? (quizData.reduce((sum, q) => sum + q.accuracy, 0) / quizData.length).toFixed(2)
    : null


    return (
    <div>
        <NavBar />
            <div className='welcome-box'>
                <h1 className='welcome-message'>Hi, {userProfile?.nickname || 'User'}</h1>
                <h3 className='level'>Level: {level}</h3>
                <h3 className='progress'>{(xp - currentLevelXP)} / {(xpForNextLevel - currentLevelXP)}</h3>
                <h3 className="progress-percent">Progress: {xpProgress}%</h3>
            </div>
        <h2>Performance Overview</h2>
        <div>
            <select value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value)}>
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

        <div style={{ display: 'flex', gap: '50px' }} className='graph-box'>
            <div style={{ flex: 1, width: '100%', maxWidth: '1000px', minWidth: '600px' }} className='time-graph'>
                <ResponsiveContainer width= '100%' aspect={1.778}>
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

            <div style={{ flex: 1, width: '100%', maxWidth: '1000px', minWidth: '600px' }} className='accuracy-graph'>
                <ResponsiveContainer width= '100%' aspect={1.778}>
                    <LineChart
                        data={quizData}
                        margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                    >
                        <YAxis domain={[0, 'auto']} />
                        <CartesianGrid strokeDasharray="3" />
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