const express = require("express");
const app = express();
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const dbPath = path.join(__dirname, "moviesData.db");
let db = null;
app.use(express.json());

const convertDbObjectToResponseObject = (dbObject) => {
  return {
    movieName: dbObject.movie_name,
  };
};

const convertDbObjectToResponseObject1 = (dbObject) => {
  return {
    movieId: dbObject.movie_id,
    directorId: dbObject.director_id,
    movieName: dbObject.movie_name,
    leadActor: dbObject.lead_actor,
  };
};

const connectDBAndRunServer = async () => {
  try {
    db = await open({ filename: dbPath, driver: sqlite3.Database });
    app.listen(3000, () => {
      console.log("Server Running Fine");
    });
  } catch (e) {
    console.log("Run DB error ${e.message}");
    process.exit(1);
  }
};

connectDBAndRunServer();

app.get("/movies/", async (request, response) => {
  const getMovieQuery = `
        SELECT movie_name
        FROM movie;
        `;
  const dbResponse = await db.all(getMovieQuery);
  let dbResponseList = [];
  for (let i of dbResponse) {
    dbResponseList.push(convertDbObjectToResponseObject(i));
  }
  response.send(dbResponseList);
});

app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getMovieQuery = `
        SELECT *
        FROM movie
        WHERE movie_id=${movieId};
        `;
  const dbResponse = await db.get(getMovieQuery);
  let dbResponseList = convertDbObjectToResponseObject1(dbResponse);
  response.send(dbResponseList);
});

app.post("/movies/", async (request, response) => {
  const bookDetails = request.body;
  const director_id = bookDetails.directorId;
  const movie_name = bookDetails.movieName;
  const lead_actor = bookDetails.leadActor;
  const movie_id = 117;
  const getMovieQuery = `
        INSERT
            INTO
        movie
            (movie_id,director_id,movie_name,lead_actor)
        VALUES
            (${movie_id},${director_id},${movie_name},${lead_actor});
        `;
  const dbResponse = await db.run(getMovieQuery);
  response.send(dbResponse.lastID);
});

module.exports = app;
