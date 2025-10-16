const authenticate =  {
    authenticateRoutes: {
      path: [
        "/api/v1/auth/login",
        "/api/v1/auth/register",
        "/",
        "/api/v1/addUrlAndPrice"
      ],
      method: ["GET", "POST"],
    },
  };


export {authenticate}