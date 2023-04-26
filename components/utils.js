// utils.js
const countGenres = (genreList) => {
    const genreCount = {};
    const genGenres = [
      "alternative",
      "punk",
      "emo",
      "folk",
      "rock",
      "indie",
      "lo-fi",
      "anime",
      "blues",
      "country",
      "electronic",
      "r&b",
      "gospel",
      "jazz",
      "classical",
      "comedy",
      "country",
      "rap",
      "pop",
      "metal",
      "soul",
      "regae",
      "indian"
    ]

    genreList.forEach((genre) => {
      if (genre !== '') {
        genGenres.forEach((genGenre) => {
          if (genre.includes(genGenre)) {
            genreCount[genGenre] = genreCount[genGenre] ? genreCount[genGenre] + 1 : 1;
          }
        })
        
      }
    });
    return genreCount;
  };
  
  export { countGenres };