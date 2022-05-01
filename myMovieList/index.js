const BASE_URL = "https://movie-list.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/v1/movies/";
const POSTER_URL = BASE_URL + "/posters/";
const MOVIE_PER_PAGE = 12;
let nowPage = 1;

const movies = [];
let filteredMovies = [];

const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const paginator = document.querySelector("#paginator");
const cardListIcon = document.querySelector("#list-icon");
const cardMode = document.querySelector("#card-mode");
const listMode = document.querySelector("#list-mode");

// CardMode
function renderMovieCardMode(data) {
  let rawHTML = "";
  if (dataPanel.dataset.mode === "card-mode") {
    // CardMode
    data.forEach((item) => {
      rawHTML += `<div class="col-sm-3">
      <div class="mb-2">
        <div class="card">
          <img src="${POSTER_URL + item.image
        }" class="card-img-top" alt="Movie Poster">
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
    </div>`;
    });
  } else if (dataPanel.dataset.mode === "list-mode") {
    // ListMode
    data.forEach((item) => {
      rawHTML += `
    <div class="list-group">
      <li href="#" class="list-group-item d-flex justify-content-between align-items-start">
       <div class="ms-2 me-auto fw-bold">
         ${item.title}
       </div>
       <button class="btn btn-primary btn-show-movie me-1" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">More</button>
       <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>     
    </div>`;
    });
  } else if (dataPanel.dataset.mode === "carousel-mode") {
    rawHTML += `      
      <div id="myCarousel" class="carousel slide" data-ride="carousel">
        <div class="carousel-inner">   
        `;
    for (let i = 0; i < data.length; i++) {
      let isFirst = i === 0 ? "active" : "";
      rawHTML += `
          <div class="carousel-item ${isFirst}">         
              <img src="${POSTER_URL + data[i].image
        }" class="rounded mx-auto d-block">
              <div class="fs-5"><em> Release date: ${data[i].release_date
        } </em></div>
              <div class="fs-4">${data[i].description}
              <button class="btn btn-info btn-add-favorite" data-id="${data[i].id
        }">+</button>
              </div>                
          </div>
    `;
    }
    rawHTML += `
     </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#myCarousel" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#myCarousel" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
    </div>
    `;
  } else if (dataPanel.dataset.mode === "accordion-mode") {
    // ListMode
    data.forEach((item) => {
      rawHTML += `
      <div class="accordion" id="accordionExample">
        <div class="accordion-item">
          <h2 class="accordion-header" id="heading${item.id}">
            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${item.id}" aria-expanded="true" aria-controls="collapse${item.id}">
              ${item.title}
            </button>
          </h2>
          <div id="collapse${item.id}" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
        <div class="accordion-body">   
        <div><em> Release date:  ${item.release_date} </em></div>
        <div> ${item.description} </div>            
         <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>  
        </div>
    </div>
  </div>  
</div>
  `;
    });
  }
  dataPanel.innerHTML = rawHTML;
}
// 頁數渲染
function renderPaginator(amount, nowpage) {
  const numberOfPage = Math.ceil(amount / MOVIE_PER_PAGE);
  let rawHTML = "";
  for (let page = 1; page <= numberOfPage; page++) {
    if (page === nowpage) {
      rawHTML += `<li class="page-item active"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`;
    } else {
      rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`;
    }
  }
  paginator.innerHTML = rawHTML;
}

// page分頁
function getMovieByPage(page) {
  const data = filteredMovies.length ? filteredMovies : movies;
  const startIndex = (page - 1) * MOVIE_PER_PAGE;
  return data.slice(startIndex, startIndex + MOVIE_PER_PAGE);
}

// model詳細資料
function showMovieModal(id) {
  const modalTitle = document.querySelector("#movie-modal-title");
  const modalImage = document.querySelector("#movie-modal-image");
  const modalDate = document.querySelector("#movie-modal-date");
  const modalDescription = document.querySelector("#movie-modal-description");

  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data.results;
    modalTitle.innerText = data.title;
    modalDate.innerText = data.release_date;
    modalDescription.innerText = data.description;
    modalImage.innerHTML = `<img src="${POSTER_URL + data.image
      }" alt="movie-poster" class="img-fluid">`;
  });
}

// 加入最愛
function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
  const movie = movies.find((movie) => movie.id === id);

  if (list.some((movie) => movie.id === id)) {
    return alert("此電影已經在收藏清單中！");
  }

  list.push(movie);
  localStorage.setItem("favoriteMovies", JSON.stringify(list));
}

// 移除最愛
function removeFromLike(id) {
  if (!list || !list.length) return;
  // 尋找好友位址
  const movieIndex = list.findIndex((movie) => movie.id === id);
  if (movieIndex === -1) return;
  // 移除
  list.splice(movieIndex, 1);
  localStorage.setItem("favoriteMovies", JSON.stringify(list));
  alert("已移出最愛！");
  let idPage = Math.ceil(id / FRIEND_PER_PAGE);
  renderMovieCardModee(getFriendsByPage(idPage));
  renderPaginator(friends.length, idPage);
}

// 增加切換按鈕樣式
function addClickStyle(currentMode, target) {
  dataPanel.removeAttribute("data-mode");
  dataPanel.setAttribute("data-mode", currentMode);
  for (let icon of cardListIcon.children) {
    icon.classList.remove("click-style");
  }
  target.classList.add("click-style");
  renderMovieCardMode(getMovieByPage(nowPage));
}

// 點選分頁器
paginator.addEventListener("click", function onPaginatorClicker(event) {
  if (event.target.tagName !== "A") return;
  const page = Number(event.target.dataset.page);
  nowPage = page;
  const movieslength = filteredMovies.length
    ? filteredMovies.length
    : movies.length;
  renderMovieCardMode(getMovieByPage(page));
  renderPaginator(movieslength, page);
});

// 點選新增移除好友
dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-movie")) {
    showMovieModal(Number(event.target.dataset.id));
  } else if (event.target.matches(".btn-add-favorite")) addToFavorite(Number(event.target.dataset.id));
});

// 搜尋
searchForm.addEventListener("submit", function onSearchFormSubmitted(event) {
  // 取消預設事件
  event.preventDefault();
  // 關鍵字
  const keyword = searchInput.value.trim().toLowerCase();
  if (!keyword.length) {
    return alert("Please enter a valid string");
  }
  // 條件篩選
  filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  );
  if (filteredMovies.length === 0) {
    return alert("Cannot find movies with keyword:" + keyword);
  }
  // 重新輸出至畫面
  renderPaginator(filteredMovies.length, nowPage);
  renderMovieCardMode(getMovieByPage(nowPage));
});

// 點選切換模式
cardListIcon.addEventListener("click", function cardListChang(event) {
  target = event.target;
  switch (target.id) {
    case "card-mode":
      addClickStyle("card-mode", target);
      break;
    case "list-mode":
      addClickStyle("list-mode", target);
      break;
    case "carousel-mode":
      addClickStyle("carousel-mode", target);
      break;
    case "accordion-mode":
      addClickStyle("accordion-mode", target);
      break;
    case "clear-all-favorites":
      localStorage.removeItem("favoriteMovies");
      break;
  }
});

axios
  .get(INDEX_URL)
  .then((response) => {
    movies.push(...response.data.results);
    renderPaginator(movies.length, nowPage);
    renderMovieCardMode(getMovieByPage(nowPage));
  })
  .catch((err) => console.log(err));
