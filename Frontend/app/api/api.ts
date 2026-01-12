import { BASE_URL } from "../config/env";
import { User } from "../types/itinerary";

export async function saveUserToDB(user: User) {
  try {
    console.log(BASE_URL);
    const response = await fetch(`${BASE_URL}/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      }),
    });

    console.log("Chalo response dekhte hai " + response);
    if(response.ok) {
      console.log("Response to barabar hai");
      return true;
    } else {
      console.log("Kuch to gadbad hai");
      return false;
    }
  } catch (error) {
    console.log(error);
  }
}

export async function saveUserTrip(email: string, trip: string) {
    const response = await fetch(`${BASE_URL}/user/add-trip`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: email,
            trip: trip,
        }),
    });
    if(response.ok) return true;

    return false;
}