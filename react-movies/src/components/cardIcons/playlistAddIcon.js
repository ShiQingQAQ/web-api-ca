import React, { useContext } from "react";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import IconButton from "@mui/material/IconButton";
import { MoviesContext } from "../../contexts/moviesContext";

const PlaylistAddIconComponent = ({ movie }) => {
  const { addToWatchlist } = useContext(MoviesContext);

  return (
    <IconButton
      aria-label="add to watchlist"
      onClick={() => addToWatchlist(movie)}  // Call addToWatchlist on click
    >
      <PlaylistAddIcon color="primary" />
    </IconButton>
  );
};

export default PlaylistAddIconComponent;