const firebase = require('firebase/app');
require('firebase/database');
require('firebase/auth');

const firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    databaseURL: process.env.databaseURL,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId
}

firebase.initializeApp(firebaseConfig);

const database = firebase.database();


function getMoviesFromDB (){
    return new Promise((resolve, reject) => {
        database.ref('/movies').once('value')
    .then((snapshot) => {
        let movies = [];
        let results = snapshot.val();

        for (let key in results){
            movies.push(results[key]);
        }
    resolve(movies);
    }).catch(error => {
        resolve([]);
        console.error(error);
        
    }) ;
    });
   
};

module.exports = {
    getMovies: () => {
    return getMoviesFromDB();
    },
    updateMovie: async (movie) => {
        let movies = await getMoviesFromDB();
        let position = movies.findIndex(m => {
            return m.id === movie.id;
        })
        return new Promise((resolve, reject) => {
            firebase.database().ref('/movies/c' + position).set(movie) //set pasa el objeto de la pelicula que recibio como parametro
            .then(() => {
                resolve();
            }).catch(err=> {
                console.error(err);
             resolve();   
            });
        });
       
    }
}