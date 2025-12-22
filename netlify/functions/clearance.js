exports.handler = async (event, context) => {
  const user = context.clientContext && context.clientContext.user;

  if (!user || !user.email) {
    return {
      statusCode: 401,
      body: "Unauthorized"
    };
  }

  const email = user.email.toLowerCase();

  const clearanceMap = {
    "byepyramid@gmail.com":
      "https://script.google.com/macros/s/AKfycbzqXH682LTkWv-OL6TKflvg7tOLOr2DlxHDTJwWQZ6DStl5fZAvUHb666NDXvT3NyQ/exec",

    "ernestoaudra@gmail.com":
      "https://script.google.com/a/macros/thetrivialcompany.com/s/AKfycbzqXH682LTkWv-OL6TKflvg7tOLOr2DlxHDTJwWQZ6DStl5fZAvUHb666NDXvT3NyQ/exec"
  };

  return {
    statusCode: 200,
    body: JSON.stringify({
      clearanceUrl: clearanceMap[email] || null
    })
  };
};
