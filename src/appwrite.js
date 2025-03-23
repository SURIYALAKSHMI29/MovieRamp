import { Client, Databases, ID, Query } from "appwrite";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(PROJECT_ID);

// using database functionality
const database = new Databases(client);

export const updateSearchCount = async(searchTerm, movie) => {
    // 1. Check whether the search term exists in the database
    // 2. If not, create a new document
    // 3. Otherwise update the search count

    try{
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.equal('searchTerm', searchTerm)
        ]); // checking if the movie already exists in the db or not

        if(result.documents.length > 0){
            const doc = result.documents[0];

            await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
                count: doc.count + 1
            });  // updating

        } else{
            await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(),{
                searchTerm,
                count: 1,
                movie_id: movie.id,
                poster_url: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
            }) // creating a new document
        }
    } catch(error){
        console.error(error); 
    }

}

export const getTrendingMovies = async() => {
    try{
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID,[
            Query.orderDesc('count'),
            Query.limit(5),
        ]);
        return result.documents;
    } catch(error){
        console.error(error);
    }
}