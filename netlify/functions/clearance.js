export async function handler(event) {
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

  const res = await fetch(appUrl, {
    headers: {
      "User-Agent": "Netlify-Clearance-Proxy"
    }
  });

  const html = await res.text();

  // Strip scripts, styles, and tags to force readable text
  const textOnly = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<\/?[^>]+>/g, "")
    .replace(/\r/g, "")
    .replace(/\n\s*\n+/g, "\n\n")
    .trim();

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store"
    },
    body:
      textOnly ||
      "Clearance loaded successfully, but no readable text was found."
  };
}
