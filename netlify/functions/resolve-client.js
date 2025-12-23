exports.handler = async (event) => {
  const auth = event.headers.authorization || "";
  if (!auth.startsWith("Bearer ")) {
    return { statusCode: 401, body: "Unauthorized" };
  }

  const CLIENT_MAP = {
    "thegofuser@gmail.com": {
      clientId: "savant",
      clientName: "Savant",
      appUrl: "https://script.google.com/macros/s/AKfycbw0Q1sOPM9lxrTKKCpv-WVsy37aibaDLHhaAKjW9bDllA29MQb7WNzEzq9zxULtktFmyQ/exec"
    },
    "echavarria@thetrivialcompany.com": {
      clientId: "cerrito-mayfair",
      clientName: "Cerrito Mayfair",
      appUrl: "https://script.google.com/macros/s/AKfycbyKXQxAMCfO7vlkp2b-dqDKFshN3T3qcH9KkjHwgqAwXQaHvwteErCs0uHBRzcGYdaW/exec"
    }
  };

  const token = auth.replace("Bearer ", "");
  const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
  const email = payload.email?.toLowerCase();

  const record = CLIENT_MAP[email];
  if (!record) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: "No client mapping for this email" })
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(record)
  };
};
