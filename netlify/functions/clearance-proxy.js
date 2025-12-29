exports.handler = async (event, context) => {
  // ✅ Netlify Identity injects the user here (cookie-based, no headers needed)
  const user = context.clientContext && context.clientContext.user;

  if (!user || !user.email) {
    return {
      statusCode: 401,
      body: "Unauthorized"
    };
  }

  const email = user.email.toLowerCase();

  // ✅ Your explicit allow-list
  const CLIENT_MAP = {
    "thegofuser@gmail.com": {
      appUrl: "https://script.google.com/macros/s/AKfycbw0Q1sOPM9lxrTKKCpv-WVsy37aibaDLHhaAKjW9bDllA29MQb7WNzEzq9zxULtktFmyQ/exec"
    },
    "echavarria@thetrivialcompany.com": {
      appUrl: "https://script.google.com/macros/s/AKfycbyKXQxAMCfO7vlkp2b-dqDKFshN3T3qcH9KkjHwgqAwXQaHvwteErCs0uHBRzcGYdaW/exec"
    }
  };

  const record = CLIENT_MAP[email];

  if (!record) {
    return {
      statusCode: 403,
      body: "No access"
    };
  }

  // ✅ SAME-TAB REDIRECT AFTER AUTHORIZATION
  return {
    statusCode: 302,
    headers: {
      Location: record.appUrl,
      "Cache-Control": "no-store"
    }
  };
};
