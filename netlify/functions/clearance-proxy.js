exports.handler = async (event) => {
  // 1. Read cookies sent automatically by the browser
  const cookieHeader = event.headers.cookie || "";

  const match = cookieHeader.match(/nf_jwt=([^;]+)/);
  if (!match) {
    return {
      statusCode: 401,
      body: "Unauthorized"
    };
  }

  // 2. Decode Netlify Identity JWT (payload only)
  let payload;
  try {
    payload = JSON.parse(
      Buffer.from(match[1].split(".")[1], "base64").toString("utf8")
    );
  } catch {
    return {
      statusCode: 401,
      body: "Invalid session"
    };
  }

  const email = payload.email?.toLowerCase();
  if (!email) {
    return {
      statusCode: 401,
      body: "Unauthorized"
    };
  }

const CLIENT_MAP = {
  "thegofuser@gmail.com": {
    appUrl: "https://script.google.com/macros/u/1/s/AKfycbw0Q1sOPM9lxrTKKCpv-WVsy37aibaDLHhaAKjW9bDllA29MQb7WNzEzq9zxULtktFmyQ/exec"
  },
  "ernesto@thetrivialcompany.com": {
    appUrl: "https://script.google.com/macros/u/2/s/AKfycbyKXQxAMCfO7vlkp2b-dqDKFshN3T3qcH9KkjHwgqAwXQaHvwteErCs0uHBRzcGYdaW/exec"
  }
};

  const record = CLIENT_MAP[email];
  if (!record) {
    return {
      statusCode: 403,
      body: "No access"
    };
  }

  // 4. SAME-TAB redirect
  return {
    statusCode: 302,
    headers: {
      Location: record.appUrl,
      "Cache-Control": "no-store"
    }
  };
};
