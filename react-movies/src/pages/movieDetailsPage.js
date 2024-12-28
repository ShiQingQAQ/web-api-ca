import React from "react";
import { useParams } from 'react-router-dom';
import MovieDetails from "../components/movieDetails/";
import PageTemplate from "../components/templateMoviePage";
import { getMovie , getMovieRecommendations, getSimilarMovies} from '../api/tmdb-api'
import { useQuery } from "react-query";
import Spinner from '../components/spinner'
//import useMovie from "../hooks/useMovie";

const MoviePage = (props) => {
  const { id } = useParams();
  const { data: movie, error, isLoading, isError } = useQuery(
    ["movie", { id: id }],
    getMovie
  );

  const { data : recommendations, isLoading: isLoadingRecommendations } = useQuery(
    ["recommendations", id],
    () => getMovieRecommendations(id),
    { enabled: !!id }
  );//load recommend movies

const { data: similarMovies, isLoading: isLoadingSimilar } = useQuery(
  ["similarMovies", id],
  () => getSimilarMovies(id),
  { enabled: !!id }
);//load similar movies

if(isLoading || isLoadingRecommendations || isLoadingSimilar){
  return <Spinner />;
}


  if (isError) {
    return <h1>{error.message}</h1>;
  }

  return (
    <>
      {movie ? (
        <>
          <PageTemplate movie={movie}>
           <MovieDetails movie={movie} />

           <h3>Recommended Movies</h3>
           <ul>
            {recommendations?.results.map((rec) => (
              <li key={rec.id}>{rec.title}</li>
            ))}
           </ul>

           <h3>Similar Movies</h3>
           <ul>
            {similarMovies?.results.map((sim) =>(
              <li key={sim.id}>{sim.title}</li>
            ))}
           </ul>
          </PageTemplate>
        </>
      ) : (
        <p>Waiting for movie details</p>
      )}
    </>
  );
};

export default MoviePage;