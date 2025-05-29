const apiKey = 'db8dd955b2614807b1bc6b0bf4e3d090'; // Substitua por sua chave da API do TMDb
const baseUrl = 'https://api.themoviedb.org/3';
const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

// Elementos do DOM
const movieList = document.getElementById('movie-list');
const searchInput = document.getElementById('search-input');
const genreFilter = document.getElementById('genre-filter');
const modal = document.getElementById('movie-modal');
const modalDetails = document.getElementById('modal-details');
const closeModal = document.querySelector('.close-modal');
const hamburger = document.querySelector('.hamburger');
const sidebar = document.querySelector('.sidebar');

// Carregar gêneros
async function loadGenres() {
    try {
        const response = await fetch(`${baseUrl}/genre/movie/list?api_key=${apiKey}&language=pt-BR`);
        const data = await response.json();
        data.genres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre.id;
            option.textContent = genre.name;
            genreFilter.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar gêneros:', error);
    }
}

// Carregar filmes populares
async function loadMovies(genreId = '', query = '') {
    movieList.innerHTML = '<p>Carregando...</p>';
    try {
        let url = `${baseUrl}/movie/popular?api_key=${apiKey}&language=pt-BR`;
        if (query) {
            url = `${baseUrl}/search/movie?api_key=${apiKey}&language=pt-BR&query=${encodeURIComponent(query)}`;
        } else if (genreId) {
            url = `${baseUrl}/discover/movie?api_key=${apiKey}&language=pt-BR&with_genres=${genreId}`;
        }
        const response = await fetch(url);
        const data = await response.json();
        movieList.innerHTML = '';
        data.results.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.className = 'movie-card';
            movieCard.innerHTML = `
                <img src="${movie.poster_path ? imageBaseUrl + movie.poster_path : 'placeholder.jpg'}" alt="${movie.title}">
                <h2>${movie.title}</h2>
                <p>${movie.overview.slice(0, 100)}...</p>
            `;
            movieCard.addEventListener('click', () => showMovieDetails(movie.id));
            movieList.appendChild(movieCard);
        });
    } catch (error) {
        console.error('Erro ao carregar filmes:', error);
        movieList.innerHTML = '<p>Erro ao carregar filmes.</p>';
    }
}

// Mostrar detalhes do filme em um modal
async function showMovieDetails(movieId) {
    try {
        const response = await fetch(`${baseUrl}/movie/${movieId}?api_key=${apiKey}&language=pt-BR`);
        const movie = await response.json();
        modalDetails.innerHTML = `
            <h2>${movie.title}</h2>
            <img src="${movie.poster_path ? imageBaseUrl + movie.poster_path : 'placeholder.jpg'}" alt="${movie.title}">
            <p>${movie.overview}</p>
            <p class="rating"><i class="fas fa-star"></i> Avaliação: ${movie.vote_average.toFixed(1)}/10</p>
            <p>Lançamento: ${new Date(movie.release_date).toLocaleDateString('pt-BR')}</p>
            <p>Gêneros: ${movie.genres.map(g => g.name).join(', ')}</p>
        `;
        modal.style.display = 'flex';
    } catch (error) {
        console.error('Erro ao carregar detalhes do filme:', error);
        modalDetails.innerHTML = '<p>Erro ao carregar detalhes.</p>';
    }
}

// Fechar modal
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Busca por filmes
searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim();
    loadMovies('', query);
});

// Filtro por gênero
genreFilter.addEventListener('change', () => {
    const genreId = genreFilter.value;
    searchInput.value = ''; // Limpa busca ao mudar gênero
    loadMovies(genreId);
});

// Controle da sidebar mobile
hamburger.addEventListener('click', () => sidebar.classList.toggle('open'));
document.addEventListener('click', (event) => {
    if (!event.target.closest('.sidebar') && !event.target.closest('.hamburger') && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
    }
});

// Inicializar
window.onload = () => {
    loadGenres();
    loadMovies();
};
