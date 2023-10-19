const apiKey = "f531333d637d0c44abc85b3e74db2186";
const baseUrl = "https://api.themoviedb.org/3/movie/top_rated";
let movie = [];
let currentPage = 1;
const totalPages = 3;
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

const fetchMovie = async (page) => {
  try {
    const response = await fetch(
      `${baseUrl}?api_key=${apiKey}&language=en-US&page=${page}`
    );
    if (!response.ok) {
      throw new Error(`error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    movie = data.results;

    const currentPageButton = document.getElementById("currentPage");

    currentPageButton.textContent = `Current Page: ${currentPage}`;

    displayMovies(movie);
  } catch (error) {
    console.log(error);
  }
};

fetchMovie(currentPage);

const displayMovies = (movies) => {
  const movieContainer = document.querySelector(".movie-card");
  const cardClone = document.getElementById("card").cloneNode(true);

  // Clear the movie container
  movieContainer.innerHTML = "";
  movies &&
    movies.length > 0 &&
    movies.map((data) => {
      const movieCard = cardClone.cloneNode(true);
      movieCard.style.display = "block"; // Show the cloned card
      const movieImage = movieCard.querySelector(".movie-img");
      const movieTitle = movieCard.querySelector(".movie-title");
      const votesCount = movieCard.querySelector("#votesCount");
      const votesAverage = movieCard.querySelector("#votesAverage");
      const favIcon = movieCard.querySelector("#favoriteBtn");

      movieImage.src = `https://image.tmdb.org/t/p/original/${data.poster_path}`;
      movieImage.alt = data.title;
      movieTitle.innerText = data.title;
      votesCount.innerText = `Votes: ${data.vote_count}`;
      votesAverage.innerText = `Rating: ${data.vote_average}`;
      // Set the movie ID as a data attribute
      favIcon.dataset.movieId = data.id;

      const index = favorites.findIndex((favMovie) => favMovie.id === data.id);
      if (index !== -1) {
        favIcon.classList.remove("fa-regular");
        favIcon.classList.add("fa");
        favIcon.classList.add("color-fav");
      } else {
        favIcon.classList.remove("fa");
        favIcon.classList.add("fa-regular");
        favIcon.classList.remove("color-fav");
      }

      favIcon.addEventListener("click", () => {
        favbtnToggle(data, favIcon);
      });

      movieContainer.appendChild(movieCard);
    });
};

function favbtnToggle(data, favicon) {
  // Check if the movie is already a favorite
  const index = favorites.findIndex((favMovie) => favMovie.id === data.id);
  if (index !== -1) {
    favorites.splice(index, 1);
    favicon.classList.remove("fa");
    favicon.classList.add("fa-regular");
    favicon.classList.remove("color-fav");
  } else {
    favorites.push(data);
    favicon.classList.remove("fa-regular");
    favicon.classList.add("fa");
    favicon.classList.add("color-fav");
  }

  // Update the favorites in local storage
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

const sortByDateButton = document.getElementById("sortByDate");
const sortByRatingButton = document.getElementById("sortByRating");

// Function to sort movies based on the selected option
function sortMovies(selectedOption) {
  switch (selectedOption) {
    case "Sort by rating (Most to least)":
      movie.sort((a, b) => b.vote_average - a.vote_average);
      break;
    case "Sort by rating (Least to most)":
      movie.sort((a, b) => a.vote_average - b.vote_average);
      break;
    case "Sort by date (oldest to latest)":
      movie.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
      break;
    case "Sort by date (latest to oldest)":
      movie.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
      break;
    default:
      break;
  }
  displayMovies(movie);
}

sortByRatingButton.addEventListener("click", () => {
  if (sortByRatingButton.textContent === "Sort by rating (Least to most)") {
    sortMovies("Sort by rating (Least to most)");
    sortByRatingButton.textContent = "Sort by rating (Most to least)";
  } else {
    sortMovies("Sort by rating (Most to least)");
    sortByRatingButton.textContent = "Sort by rating (Least to most)";
  }
});

sortByDateButton.addEventListener("click", () => {
  if (sortByDateButton.textContent === "Sort by date (oldest to latest)") {
    sortMovies("Sort by date (oldest to latest)");
    sortByDateButton.textContent = "Sort by date (latest to oldest)";
  } else {
    sortMovies("Sort by date (latest to oldest)");
    sortByDateButton.textContent = "Sort by date (oldest to latest)";
  }
});

// Function to handle movie search
const searchButton = document.getElementById("searchButton");
const searchInput = document.getElementById("searchInput");

searchButton.addEventListener("click", () => {
  const searchTerm = searchInput.value.toLowerCase();

  // Filter movies based on the search term
  const filteredMovies = movie.filter((data) =>
    data.title.toLowerCase().includes(searchTerm)
  );

  // Display the filtered movies
  displayMovies(filteredMovies);
});

// Function to update pagination buttons and display current page
const updatePaginationUI = () => {
  const prevPageButton = document.getElementById("prevPage");
  const nextPageButton = document.getElementById("nextPage");

  if (currentPage === 1) {
    prevPageButton.disabled = true;
  } else {
    prevPageButton.disabled = false;
  }

  if (currentPage === totalPages) {
    nextPageButton.disabled = true;
  } else {
    nextPageButton.disabled = false;
  }
};

// Event listener for previous page button
const prevPageButton = document.getElementById("prevPage");
prevPageButton.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    fetchMovie(currentPage);
  }
});

// Event listener for next page button
const nextPageButton = document.getElementById("nextPage");
nextPageButton.addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++;
    fetchMovie(currentPage);
  }
});

const favMovie = document.getElementById("fav-movie");
const allMovie = document.getElementById("all-movie");

favMovie.addEventListener("click", () => {
  displayMovies(favorites);
});

allMovie.addEventListener("click", () => {
  displayMovies(movie);
});
