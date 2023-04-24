// utils.js
const countGenres = (genreList) => {
    const genreCount = {};
    genreList.forEach((genre) => {
      if (genre !== '') {
        genreCount[genre] = genreCount[genre] ? genreCount[genre] + 1 : 1;
      }
    });
    return genreCount;
  };
  
  export { countGenres };