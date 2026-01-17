import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../config/firebase";

export async function signInWithGoogleWeb() {
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  return {
    name: user.displayName!,
    email: user.email!,
    photo: user.photoURL!,
  };
}

export async function signOutFromGoogleWeb() {
  const auth = getAuth(app);
  await auth.signOut();
}
