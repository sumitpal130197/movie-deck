const apiKey = "f531333d637d0c44abc85b3e74db2186";
const baseUrl = "https://api.themoviedb.org/3/movie/top_rated";
let movie = [];

const fetchMovie = async () => {
  try {
    const response = await fetch(
      `${baseUrl}?api_key=${apiKey}&language=en-US&page=1`
    );
    if (!response.ok) {
      throw new Error(`error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    movie = data.results;
   
    displayMovies(movie);
  } catch (error) {
    console.log(error);
  }
};

fetchMovie();

const displayMovies = (movies) => {
    console.log(movies)
  const movieContainer = document.querySelector(".movie-card");
  movies &&
    movies.length > 0 &&
    movies.map((data) => {
      const movieCard = document.getElementById("card").cloneNode(true);
      movieCard.style.display = "block"; // Show the cloned card

      const movieImage = movieCard.querySelector(".movie-img");
      const movieTitle = movieCard.querySelector(".movie-title");
      const votesCount = movieCard.querySelector("#votesCount");
      const votesAverage = movieCard.querySelector("#votesAverage");

      movieImage.src = `https://image.tmdb.org/t/p/original/${data.poster_path}`;
      movieImage.alt = data.title;
      movieTitle.innerText = data.title;
      votesCount.innerText = `Votes: ${data.vote_count}`;
      votesAverage.innerText = `Rating: ${data.vote_average}`;

      movieContainer.appendChild(movieCard);
    });
};

const sortByDateButton = document.getElementById("sortByDate");
const sortByRatingButton = document.getElementById("sortByRating");

  // Function to sort movies based on the selected option
function sortMovies(selectedOption) {
    
  console.log(selectedOption)
    switch (selectedOption) {
      case "Sort by rating (Most to least)":
        console.log("case1")
        movie.sort((a, b) => b.vote_average - a.vote_average);
        break;
      case "Sort by rating (Least to most)":
        console.log("case2")
        movie.sort((a, b) => a.vote_average - b.vote_average);
        break;
      case "Sort by date (oldest to latest)":
        movie.sort(
          (a, b) => new Date(b.release_date) - new Date(a.release_date)
        );
        break;
      case "Sort by date (latest to oldest)":
        movie.sort(
          (a, b) => new Date(a.release_date) - new Date(b.release_date)
        );
        break;
      default:
        break;
    }
  
    displayMovies(movie);
  }

  sortByRatingButton.addEventListener("click", () => {
    if (sortByRatingButton.textContent === "Sort by rating (Least to most)") {
      console.log("if")
      sortMovies("Sort by rating (Least to most)");
      sortByRatingButton.textContent = "Sort by rating (Most to least)";
    } else {
      console.log("else")
      sortMovies("Sort by rating (Most to least)");
      sortByRatingButton.textContent = "Sort by rating (Least to most)";
    }
  });

  sortByDateButton.addEventListener("click", () => {
    if (sortByDateButton.textContent === "Sort by date (oldest to latest)") {
      console.log("if")
      sortMovies("Sort by date (oldest to latest)");
      sortByDateButton.textContent = "Sort by date (latest to oldest)";
    } else {
      console.log("else")
      sortMovies("Sort by date (latest to oldest)");
      sortByDateButton.textContent = "Sort by date (oldest to latest)";
    }
  });