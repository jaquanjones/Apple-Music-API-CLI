/* eslint-disable camelcase */
const inquirer = require("inquirer");
const library = require("apple-music-api");
const open = require("open");

const _openInBrowser = (url) => {
  console.log("Opening in Apple Music..");
  open(url);
};

const _openURLPrompt = async (type) => {
  const options = ["Yes", "No"];
  return inquirer.prompt({
    type: "list",
    name: "openURL",
    message: `Would you like to open this ${type.slice(
      0,
      type.length - 1
    )} in Apple Music?\n`,
    choices: options,
  });
};

// SONG SEARCH FUNCTIONS
const _printSongDetails = (songDetails) => {
  console.log("- - - - - - - - - - - - - - - - - - - - -");
  console.log("Song Details:");
  console.log(`   Title: ${songDetails.title}`);
  console.log(`   Artist: ${songDetails.artist}`);
  console.log(`   Album: ${songDetails.albumName}`);
  console.log(`   Genres: ${songDetails.genres}`);
  console.log(`   Release Date: ${songDetails.releaseDate}`);
  console.log("- - - - - - - - - - - - - - - - - - - - -\n");
};

const _getSongDetailsByID = async (songID) => {
  try {
    const songDetailResponse = await library.songDetails(songID);
    const songObject = songDetailResponse.data[0];
    const songDetails = _filterSongResultDetails(songObject);
    _printSongDetails(songDetails);
    return songDetails;
  } catch (error) {
    console.log(error);
  }
};

const _songResultsOptionSelection = async (songList) => {
    const songOptions = [];

    for (const song in songList) {
      const year = songList[song].releaseDate.split("-")[0];
      const songOption = {
        name: `${songList[song].title} by ${songList[song].artist} (${year})`,
        value: `${songList[song].id}`,
      };
      songOptions.push(songOption);
    }
    songOptions.push({ name: "(None of these!)", value: 0 });
    return inquirer.prompt([
      {
        type: "list",
        name: "songID",
        message: "Which song would you like to see more details?\n",
        choices: songOptions,
      },
    ]);

};

const _songResultsOptionsPrompt = async () => {
  const options = ["see more details", "exit"]; // removed new search option

  return inquirer.prompt({
    type: "list",
    name: "userSelected",
    message: "Would you like to see more details or exit?",
    choices: options,
  });
};

const _printSongResults = (songList, search, type) => {
  console.log("- - - - - - - - - - - - - - - - - - - - -");
  console.log(`Top ${songList.length} ${type} found searching "${search}":\n`);

  for (let i = 0; i < songList.length; i++) {
    let year = songList[i].releaseDate.split("-")[0];
    console.log(
      `   ${i + 1}) ${songList[i].title} by ${songList[i].artist} (${year})\n`
    );
  }
  console.log("- - - - - - - - - - - - - - - - - - - - -\n");
};

const _filterSongResultDetails = (song) => {
  const { releaseDate, genreNames, name, artistName, url, albumName } =
    song.attributes;
  return {
    id: song.id,
    type: song.type,
    href: song.href,
    artist: artistName,
    title: name,
    genres: genreNames,
    releaseDate: releaseDate,
    albumName: albumName,
    url: url,
  };
};

const _generateSongResultList = (songResults) => {
  const songList = [];
  for (let song in songResults) {
    const newSong = _filterSongResultDetails(songResults[song]);
    songList.push(newSong);
  }
  return songList;
};

const searchSongs = async (args) => {
  try {
    const { type, search, resultLimit } = args;
    const searchResults = await library.searchAppleMusic(
      type,
      search,
      resultLimit
    );
    const songResults = searchResults.results.songs.data;
    const songList = _generateSongResultList(songResults);
    _printSongResults(songList, search, type);
    const { userSelected } = await _songResultsOptionsPrompt();

    if (userSelected !== "exit") {
      const { songID } = await _songResultsOptionSelection(
        songList
      );
      if (songID !== 0) {
        const selectedSongDetails = await _getSongDetailsByID(songID);
        const { openURL } = await _openURLPrompt(selectedSongDetails.type);
        if (openURL === "Yes") {
          _openInBrowser(selectedSongDetails.url);
        }
      } else {
        console.log(
          "Sorry, your search wasn't found.\n\nTry:\n   1) adding more keywords to your next search, or \n   2) increasing number of search result returned (default is 5)\n"
        );
      }
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  searchSongs,
};
