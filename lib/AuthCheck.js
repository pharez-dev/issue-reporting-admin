import globals from "../constants/Globals";
export default async token => {
  let valid = false;
  try {
    const response = await fetch(`${globals.BASE_URL}/api/admin/checkToken`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: token },
      body: JSON.stringify({})
    });
    if (response.ok) {
      //Token is valid
      valid = true;
      //Router.push("/");
    } else {
      //Token is invalid,continue
      valid = false;
      console.log("Token invalid.");
      // https://github.com/developit/unfetch#caveats
      //   let error = new Error(response.statusText);
      //   error.response = response;
      //   return Promise.reject(error);
    }
  } catch (error) {
    console.error(
      "You have an error in your code or there are Network issues.",
      error
    );
    throw new Error(error);
  }
  return new Promise(resovle => {
    resovle(valid);
  });
};
