exports.handler = async (event) => {
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
    "https://script.google.com/macros/s/AKfycbw0Q1sOPM9lxrTKKCpv-WVsy37aibaDLHhaAKjW9bDllA29MQb7WNzEzq9zxULtktFmyQ/exec",

  "echavarria@thetrivialcompany.com":
    "https://script.google.com/macros/s/AKfycbzqXH682LTkWv-OL6TKflvg7tOLOr2DlxHDTJwWQZ6DStl5fZAvUHb666NDXvT3NyQ/exec"
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

  // Option 1: escape HTML and render raw source for proof
  const escaped = html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store"
    },
    body: `
      <div style="padding:16px;font-family:monospace">
        <h3>Clearance HTML Debug View</h3>
        <p>This confirms the Google endpoint returned non-empty HTML.</p>
        <pre style="
          white-space: pre-wrap;
          word-break: break-word;
          background: #f6f6f6;
          border: 1px solid #ddd;
          padding: 12px;
          border-radius: 6px;
          max-height: 80vh;
          overflow: auto;
        ">${escaped}</pre>
      </div>
    `
  };
}
