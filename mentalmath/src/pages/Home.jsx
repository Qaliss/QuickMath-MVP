import QuestionCard from "../components/QuestionCard";
import Score from "../components/Score";
import { useState, useEffect } from "react";
import CountdownTimer from "../components/Timer";
import { Link } from "react-router-dom";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

function Home() {

    const [userProfile, setUserProfile] = useState(null)
    const [loading, setLoading] = useState(true)

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
            } finally {
                setLoading(false)
            }
        }

        fetchUserProfile()
    }, [])

    const handleSignOut = async () => {
        try {
            await signOut(auth)
        } catch (error) {
            console.log(error)
        }
    }

    if (loading) {
        return(
            <div>Loading...</div>
        )
    }
    
    return (

        <div>
            <h1>Welcome, {userProfile?.nickname || 'User'}!</h1>
            <button><Link to="/play">Play</Link></button>
            <button><Link to="/Learn">Learn</Link></button>
            <button onClick={handleSignOut}>Log Out</button>        
        </div>



    )
}

export default Home