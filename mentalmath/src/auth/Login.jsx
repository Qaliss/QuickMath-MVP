import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

function Login () {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password)

        }
        catch (err) {
            alert('Sign in failed')
        }
    }

    return (
        <form onSubmit = {handleLogin}>
            <input type='email' placeholder = 'E-mail' value={email} onChange={e => setEmail(e.target.value)} required/>
            <input type='password' placeholder = 'Password' value={password} onChange={e => setPassword(e.target.value)} required/>
            <button type='submit'>Log in</button>
        </form>
    )

}

export default Login