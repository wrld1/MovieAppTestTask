import { useEffect, useState } from "react";
import Head from "next/head";
import { NextPage } from "next";
import { RootState } from "@/store/store";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { IMovie, Props } from "@/types/interfaces";
import {
  fetchMovies,
  selectMovies,
  selectStatus,
  selectError,
  setCurrentPage,
  incrementPage,
  decrementPage,
  selectCurrentPage,
  selectTotalResults,
} from "@/store/movieSlice";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";

import SearchForm from "@/components/SearchForm";
import MovieItem from "@/components/MovieItem";
import PaginationButton from "@/components/PaginationButton";

const Home: NextPage<Props> = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [submitTerm, setSubmitTerm] = useState<string>("");

  const dispatch = useAppDispatch();
  const movies = useAppSelector(selectMovies);
  const status = useAppSelector(selectStatus);
  const error = useAppSelector(selectError);
  const currentPage = useAppSelector(selectCurrentPage);
  const totalResults = useAppSelector(selectTotalResults);

  useEffect(() => {
    (dispatch as ThunkDispatch<RootState, void, AnyAction>)(
      fetchMovies({ searchTerm: "star-wars", page: currentPage })
    );
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitTerm(searchTerm);
    dispatch(fetchMovies({ searchTerm, page: 1 }));
    setSearchTerm("");
  };

  const handleNextPageClick = () => {
    dispatch(incrementPage(submitTerm || "star-wars"));
    dispatch(setCurrentPage(currentPage + 1));
  };

  const handlePrevPageClick = () => {
    dispatch(decrementPage(submitTerm || "star-wars"));
    dispatch(setCurrentPage(currentPage - 1));
  };

  return (
    <>
      <Head>
        <title>Movies app</title>
        <meta name="description" content="omdb Movie App" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <SearchForm
          searchTerm={searchTerm}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
        <div className="flex justify-center">
          {status === "loading" && <span className="loader"></span>}
          {error && (
            <p className="font-bold text-center text-red-400">Error: {error}</p>
          )}
        </div>
        <h2 className="text-gray-400 font-bold text-center text-2xl md:text-3xl">
          {error
            ? ""
            : submitTerm
            ? `Results of search for ${submitTerm}, ${totalResults} total results`
            : "Star Wars franchise"}
        </h2>
        {movies && (
          <div className="flex gap-4 flex-wrap p-4 lg:p-10 lg:pt-4 justify-center">
            {movies.map((movie: IMovie) => (
              <MovieItem key={movie.imdbID} movie={movie} ListType="MainList" />
            ))}
          </div>
        )}
        <div className="flex justify-center mb-10">
          <PaginationButton
            buttonText="Previous page"
            onClickHandler={handlePrevPageClick}
          />
          <PaginationButton
            buttonText="Next page"
            onClickHandler={handleNextPageClick}
          />
        </div>
      </div>
    </>
  );
};

export default Home;
