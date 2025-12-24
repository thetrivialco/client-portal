export async function handler(event) {
  try {
    const auth = event.headers.authorization || "";

    if (!auth.startsWith("Bearer ")) {
      return { statusCode: 401, body: "Unauthorized" };
    }

    const token = auth.replace("Bearer ", "");
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );

    const email = payload.email?.toLowerCase();

    const CLIENT_MAP = {
      "thegofuser@gmail.com":
        "https://script.google.com/macros/s/AKfycbw0Q1sOPM9lxrTKKCpv-WVsy37aibaDLHhaAKjW9bDllA29MQb7WNzEzq9zxULtktFmyQ/exec"
    };

    const appUrl = CLIENT_MAP[email];
    if (!appUrl) {
      return { statusCode: 403, body: "No access" };
    }

    const res = await fetch(appUrl, { redirect: "manual" });
    const body = await res.text();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        upstreamStatus: res.status,
        upstreamHeaders: Object.fromEntries(res.headers),
        bodyPreview: body.slice(0, 500)
      }, null, 2)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: "FUNCTION ERROR:\n" + err.stack
    };
  }
}
