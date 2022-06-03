const yargs = require("yargs/yargs")(process.argv.slice(2));

const app = require("./app");

yargs
  .usage("$0: Usage <cmd> [options]")
  .command(
    "search <type> <search>", // command
    "Search songs in the Apple Music library", // command description
    // builder
    (yargs) => {
      return yargs
        .positional("type", {
          describe:
            "- type of search to be performed (either songs, artists, or albums)",
          type: "string",
          choices: ["songs", "artists", "albums"],
        })
        .positional("search", {
          describe:
            "- song/artist/album being searched\n" +
            '- Please wrap search keywords with double quotes (i.e. "Wizkid Essence")',
          type: "string",
        })
        .option("r", {
          alias: "resultLimit",
          describe: "the number of search results to display",
          default: 5,
          type: "number",
        });
    },
    // handler
    (args) => {
      if (args.type === "songs") {
        app.searchSongs(args).then(() => {
          console.log("Search complete.");
        });
      } else if (args.type === "artists") {
        console.log("Search by artist feature coming soon!");
      } else if (args.type === "albums") {
        console.log("Search by album feature coming soon!");
      } else {
        console.log(`${args.type} search is not ready`);
      }
    }
  )
  .help()
  .parse();
