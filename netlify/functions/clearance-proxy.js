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
    appUrl: "https://script.google.com/macros/s/AKfycbyt6JyVndlvM7o2KDbdomBj1ReKFZdta14ytXA2UvUgy6cahHOoZJkQjlB_0vwacJUvRA/exec"
  },
  "echavarria@thetrivialcompany.com": {
    appUrl: "https://script.google.com/macros/s/AKfycbyt6JyVndlvM7o2KDbdomBj1ReKFZdta14ytXA2UvUgy6cahHOoZJkQjlB_0vwacJUvRA/exec"
  },
  "rchavarria@thetrivialcompany.com": {
    appUrl: "https://script.google.com/macros/s/AKfycbyKXQxAMCfO7vlkp2b-dqDKFshN3T3qcH9KkjHwgqAwXQaHvwteErCs0uHBRzcGYdaW/exec"
  },
  "achavarria@thetrivialcompany.com": {
    appUrl: "https://script.google.com/macros/s/AKfycbyKXQxAMCfO7vlkp2b-dqDKFshN3T3qcH9KkjHwgqAwXQaHvwteErCs0uHBRzcGYdaW/exec"
  },
  "arivera@thetrivialcompany.com": {
    appUrl: "https://script.google.com/macros/s/AKfycbxOc2s4mTBBWq4RPHFqbJ4ZrAQc7HQcAivTUnGcPwc8qAXmmedqfl1m6uwUHh_bv9ZI/exec"
  },
  "trevorgrantbms@gmail.com": {
    appUrl: "https://script.google.com/macros/s/AKfycbylTB1-7pYrIJmApkpqXjII-5KWAJDoXHIWWzALtBK4HRwWedhu0cKM6aszS41AoZ5K/exec"
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
