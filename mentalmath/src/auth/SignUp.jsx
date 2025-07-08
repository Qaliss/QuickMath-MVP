import { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom"; 
import "../css/SignUp.css"

function SignUp ({ setUser }) { 

    const navigate = useNavigate() 

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [nickname, setNickname] = useState('')

    const handleSignUp = async (e) => {
        e.preventDefault()
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            const user = userCredential.user

            await setDoc(doc(db, 'users', user.uid), { 
                uid: user.uid,
                email: user.email,
                nickname: nickname,
                createdAt: new Date(),
            })

            setUser(user) 
            navigate('/') 

        }
        catch (err) {
            console.error('Sign up failed:', err) 
            alert('Sign up failed')
        }
    }

    return (
         <div className ='signup-screen'>
            <div className='signup-box'>
                <h1 className='signup-title'>MentalMath</h1>
                <h2>Sign up</h2>
                <form onSubmit = {handleSignUp}>
                    <input type='email' placeholder = 'E-mail' value={email} onChange={e => setEmail(e.target.value)} required/>
                    <input type='password' placeholder = 'Password' value={password} onChange={e => setPassword(e.target.value)} required/>
                    <input type='text' placeholder = 'Nickname' value={nickname} onChange={e => setNickname(e.target.value)} required/>
                    <button type='submit'>Sign up</button>
                    <p>Already a member? <Link to="/login">Log In</Link></p>
                </form>
            </div>

        </div>
    )

}

export default SignUp