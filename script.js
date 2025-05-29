const tmdbApiKey = 'db8dd955b2614807b1bc6b0bf4e3d090'; // Substitua pela sua chave da TMDb
const youtubeApiKey = 'AIzaSyAGtURPjB_Joo9WD7BU6_PvKbHXqKqubqM'; // Substitua pela sua chave da YouTube Data API
const tmdbBaseUrl = 'https://api.themoviedb.org/3';
const youtubeBaseUrl = 'https://www.googleapis.com/youtube/v3';
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

// Carregar gêneros da TMDb
async function loadGenres() {
    try {
        const response = await fetch(`${tmdbBaseUrl}/genre/movie/list?api_key=${tmdbApiKey}&language=pt-BR`);
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

// Buscar vídeo correspondente no YouTube
async function findYouTubeVideo(title) {
    try {
        const response = await fetch(`${youtubeBaseUrl}/search?part=snippet&q=${encodeURIComponent(title + ' filme completo dublado')}&type=video&videoCaption=any&videoDuration=long&key=${youtubeApiKey}&maxResults=1`);
        const data = await response.json();
        return data.items[0]?.id.videoId || null;
    } catch (error) {
        console.error('Erro ao buscar vídeo no YouTube:', error);
        return null;
    }
}

// Carregar filmes
async function loadMovies(genreId = '', query = '') {
    movieList.innerHTML = '<p>Carregando...</p>';
    try {
        let tmdbUrl = `${tmdbBaseUrl}/movie/popular?api_key=${tmdbApiKey}&language=pt-BR`;
        if (query) {
            tmdbUrl = `${tmdbBaseUrl}/search/movie?api_key=${tmdbApiKey}&language=pt-BR&query=${encodeURIComponent(query)}`;
        } else if (genreId) {
            tmdbUrl = `${tmdbBaseUrl}/discover/movie?api_key=${tmdbApiKey}&language=pt-BR&with_genres=${genreId}`;
        }
        const response = await fetch(tmdbUrl);
        const data = await response.json();
        movieList.innerHTML = '';
        if (data.results.length === 0) {
            movieList.innerHTML = '<p>Nenhum filme encontrado.</p>';
            return;
        }
        for (const movie of data.results) {
            const videoId = await findYouTubeVideo(movie.title);
            const movieCard = document.createElement('div');
            movieCard.className = 'movie-card';
            movieCard.innerHTML = `
                <img src="${movie.poster_path ? imageBaseUrl + movie.poster_path : 'placeholder.jpg'}" alt="${movie.title}">
                <h2>${movie.title}</h2>
                <p>${movie.overview.slice(0, 100)}...</p>
                ${videoId ? `<iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>` : '<p>Filme não disponível para streaming.</p>'}
            `;
            movieCard.addEventListener('click', () => showMovieDetails(movie.id, movie.title));
            movieList.appendChild(movieCard);
        }
    } catch (error) {
        console.error('Erro ao carregar filmes:', error);
        movieList.innerHTML = '<p>Erro ao carregar filmes.</p>';
    }
}

// Mostrar detalhes do filme no modal
async function showMovieDetails(movieId, title) {
    try {
        const response = await fetch(`${tmdbBaseUrl}/movie/${movieId}?api_key=${tmdbApiKey}&language=pt-BR`);
        const movie = await response.json();
        const videoId = await findYouTubeVideo(title);
        modalDetails.innerHTML = `
            <h2>${movie.title}</h2>
            <img src="${movie.poster_path ? imageBaseUrl + movie.poster_path : 'placeholder.jpg'}" alt="${movie.title}">
            <p>${movie.overview}</p>
            <p class="rating"><i class="fas fa-star"></i> Avaliação: ${movie.vote_average.toFixed(1)}/10</p>
            <p>Lançamento: ${new Date(movie.release_date).toLocaleDateString('pt-BR')}</p>
            <p>Gêneros: ${movie.genres.map(g => g.name).join(', ')}</p>
            ${videoId ? `<iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>` : '<p>Filme não disponível para streaming.</p>'}
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
    modalDetails.innerHTML = ''; // Limpa o modal para pausar o vídeo
});

// Busca por filmes
searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim();
    genreFilter.value = ''; // Limpa o filtro de gênero
    loadMovies('', query);
});

// Filtro por gênero
genreFilter.addEventListener('change', () => {
    const genreId = genreFilter.value;
    searchInput.value = ''; // Limpa a busca
    loadMovies(genreId);
});

// Controle da sidebar mobile
hamburger.addEventListener('click', () => sidebar.classList.toggle('open'));
document.addEventListener('click', (event) => {
    if (!event.target.closest('.sidebar') && !event.target.closest('.hamburger') && sidebar.classFacing('open')) {
        sidebar.classList.remove('open');
    }
});

// Inicializar
window.onload = () => {
    loadGenres();
    loadMovies();
};
