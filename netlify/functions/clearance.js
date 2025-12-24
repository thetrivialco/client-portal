import fetch from "node-fetch";

export async function handler(event) {
  const auth = event.headers.authorization || "";

  if (!auth.startsWith("Bearer ")) {
    return {
      statusCode: 401,
      body: "Unauthorized"
    };
  }

  const token = auth.replace("Bearer ", "");

  let payload;
  try {
    payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );
  } catch {
    return { statusCode: 401, body: "Invalid token" };
  }

  const email = payload.email?.toLowerCase();

  const CLIENT_MAP = {
    "thegofuser@gmail.com":
      "https://script.google.com/macros/s/AKfycbw0Q1sOPM9lxrTKKCpv-WVsy37aibaDLHhaAKjW9bDllA29MQb7WNzEzq9zxULtktFmyQ/exec",

    "echavarria@thetrivialcompany.com":
      "https://script.google.com/macros/s/AKfycbyKXQxAMCfO7vlkp2b-dqDKFshN3T3qcH9KkjHwgqAwXQaHvwteErCs0uHBRzcGYdaW/exec"
  };

  const appUrl = CLIENT_MAP[email];

  if (!appUrl) {
    return {
      statusCode: 403,
      body: "No access"
    };
  }

  const res = await fetch(appUrl, {
    headers: { "User-Agent": "Netlify-Clearance-Proxy" }
  });

  const html = await res.text();

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store"
    },
    body: html
  };
}
