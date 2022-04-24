const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const MOVIE_PER_PAGE = 12

const movies = []
let filteredMovies = []

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')

function renderMovieList(data) {
  let rawHTML = ''
  data.forEach((item) => {
    rawHTML += `<div class="col-sm-3">
    <div class="mb-2">
      <div class="card">
        <img src="${POSTER_URL + item.image}" class="card-img-top" alt="Movie Poster">
        <div class="card-body">
          <h5 class="card-title">${item.title}</h5>
        </div>
        <div class="card-footer">
          <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id
      }">More</button>
      <button class="btn btn-info btn-add-favorite" data-id="${item.id
      }">+</button>
        </div>
      </div>
    </div>
  </div>`
  })
  dataPanel.innerHTML = rawHTML
}

function renderPaginator(amount) {
  const numberOfPage = Math.ceil(amount / MOVIE_PER_PAGE)
  let rawHTML = ''

  for (let page = 1; page <= numberOfPage; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}

// page分頁
function getMovieByPage(page) {
  // movies ? "movies" : "filteredMovies"
  const data = filteredMovies.length ? filteredMovies : movies
  const startIndex = (page - 1) * MOVIE_PER_PAGE
  return data.slice(startIndex, startIndex + MOVIE_PER_PAGE)
}


function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')

  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data.results
    modalTitle.innerText = data.title
    modalDate.innerText = data.release_date
    modalDescription.innerText = data.description
    modalImage.innerHTML = `<img src="${POSTER_URL + data.image}" alt="movie-poster" class="img-fluid">`
  })
}

function addToFavorite(id) {
  // function isMovieIdMatched (movie) {
  //   return movie.id === id
  // }
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find((movie) => movie.id === id)

  if (list.some((movie) => movie.id === id)) {
    console.log(movie.id)
    return alert('此電影已經在收藏清單中！')
  }

  list.push(movie)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))

}
paginator.addEventListener('click', function onPaginatorClicker(event) {
  if (event.target.tagName !== 'A') return
  const page = Number(event.target.dataset.page)
  renderMovieList(getMovieByPage(page))
})

dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite'))
    addToFavorite(Number(event.target.dataset.id))
})

searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  // 取消預設事件
  event.preventDefault()
  // 關鍵字
  const keyword = searchInput.value.trim().toLowerCase()
  // 儲存符合篩選條件的項目外移成全域變數
  // let filteredMovies = []
  // 錯誤處理輸入無效字串
  if (!keyword.length) {
    return alert('Please enter a valid string')
  }
  // 條件篩選
  filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword))

  if (filteredMovies.length === 0) {
    return alert('Cannot find movies with keyword:' + keyword)
  }
  // 重新輸出至畫面
  renderPaginator(filteredMovies.length)
  renderMovieList(getMovieByPage(1))

  // for (const movie of movies) {
  //   if (movie.title.toLowerCase.includes(keyword)) {
  //     filteredMovies.push(movie)
  //   }
  // }
})

axios
  .get(INDEX_URL)
  .then((response) => {
    // Array(80)
    // for (const movies of response.data.results) {
    //   movies.push(movies)
    // }
    movies.push(...response.data.results)
    renderPaginator(movies.length)
    renderMovieList(getMovieByPage(1))
  })
  .catch((err) => console.log(err))

// localStorage只能使用文字、數字，陣列要轉乘JSON
// localStorage.setItem('default_language', "english")
// localStorage.getItem('default_language')