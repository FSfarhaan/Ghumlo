import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GOOGLE_WEB_CLIENT_ID } from '../config/env';

export function configureGoogleSignIn() {
  GoogleSignin.configure({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    offlineAccess: true,
    forceCodeForRefreshToken: false,
  });
}


export async function signInWithGoogleApp() {
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    const userInfo = await GoogleSignin.signIn();

    // console.log('USER INFO:', userInfo);

    return userInfo;
  } catch (error) {
    console.error('GOOGLE SIGN IN ERROR:', error);
    throw error;
  }
}


export async function signOutFromGoogleApp() {
  try {
    await GoogleSignin.signOut(); // removes account from app
    console.log('User signed out from Google');
  } catch (error) {
    console.error('Google Sign-Out error:', error);
  }
}