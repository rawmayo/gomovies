const processQuery = async (query = "", type = "") => {
  const url = `https://www.omdbapi.com/?apikey=ae9a00dc&type=${type}&s=${query}`;
  const encodedURL = encodeURI(url);

  const response = await fetch(encodedURL);

  return { data: await response.json(), url };
};

export default processQuery;
