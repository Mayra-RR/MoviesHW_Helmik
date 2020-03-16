const EventEmitter = require("events");
const eventEmitter = new EventEmitter();
const url = require('url');
const File = require('../miscellaneous/file')
const Firebase = require('../miscellaneous/firebase.js')

module.exports = {
  handleRequest: (request, response) => {
    response.writeHead(200, { "Content-Type": "application/json" });
    switch (request.method) {
      case "GET":
        eventEmitter.emit("onGetPetition", { request, response })
        break;
      case "POST":
        onPostPetition(request, response);

        break;
      case "PUT":
        onPutPetition(request, response);
        break;
      case "DELETE":
        onDeletePettition(request, response);
        break;
      case "OPTIONS":
        response.end();
        break;
    }
  }
};
onPostPettition = (request, response) => {
  let path = url.parse(request.url).pathname;
  switch(path) {
      case '/postMovie':
          let newMovie = [];
          request.on('data', chunk => {
              newMovie.push(chunk)
          })
          request.on('end', async() => {
              let movie = JSON.parse(data).body.movie;
              await Firebase.updateMovie(movie);
              response.end();
          });
          break;
      default:
          response.writeHeader(404);
          response.write('Error');
          response.end();
  }
}
onPutPetition = (request, response) => {
  let path = url.parse(request.url).pathname;

  switch(path){
    case '/updateMovie':
      let data = [];
      request.on('data', chunk => {
        data.push(chunk);
      });
      request.on('end', async() => {
        let movie = JSON.parse(data).body.movie;
        await Firebase.updateMovie(movie);
        response.end();
      });
      break;
    default:
      response.writeHeader(404);
      response.write("Error");
      response.end();
  }
}
onDeletePettition = (request, response) => {
  let path = url.parse(request.url).pathname;
  switch(path) {
      case '/delete-movie':
          let selectedMovie = [];
          request.on('data', chunk => {
              selectedMovie.push(chunk)
          })
          request.on('end', async() => {
              let movie = JSON.parse(data).body.movie;
              await Firebase.deleteMovie(movie);
              response.end();
          });
          break;
      default:
          response.writeHeader(404);
          response.write('Error');
          response.end();
  }
}
eventEmitter.on("onGetPetition", async data => {
    let {request, response} = data;
 let path = url.parse(request.url).pathname;
    switch (path) {
    case "/getMoviesFromFile":
      File.readFile(__dirname+ '/../database/', 'movies.json')
      .then(data => {
        response.write(JSON.stringify({data}));
        response.end();
      }).catch(error => {
        response.writeHead(500)
        response.write(JSON.stringify(error));
        response.end();
        });
      break;
      case '/getMovies':
        let movies = await Firebase.getMovies();
        response.write(JSON.stringify({data : movies}));
        response.end();
        break;
        
    default:
      response.writeHeader(404);
      response.write("Error");
      response.end();
  }
});
