import { auth } from "@/firebase/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const LoginScreen = () => {
  //Auth with Google
  async function handleLogin() {
    const googleProvider = new GoogleAuthProvider();
    await signInWithGoogle(googleProvider);
    async function signInWithGoogle(googleProvider) {
      try {
        const res = await signInWithPopup(auth, googleProvider);
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <div className=" flex">
      <div className="m-auto text-7xl"> LoginScreen </div>

      <button onClick={handleLogin}>Login with google</button>
    </div>
  );
};

export default LoginScreen;
