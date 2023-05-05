import { Header } from "./components/Header.js";
import {useCallback, useEffect, useMemo, useState} from "react";
import {apiClient} from "./api/api.js";
import {Modal} from "./components/Modal.js";

const App = () => {
    const [user, setUser] = useState({});
    const [userFavorites, setUserFavorites] = useState([]);
    const [filter, setFilter] = useState({
        search: '',
        country: '',
        genre: '',
        year: '',
    });
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState('Загрузка...');
    const [localFilter, setLocalFilter] = useState({
        year: '',
        country: '',
        genre: '',
    });
    const [showModal, setShowModal] = useState('');
    const [showMovie, setShowMovie] = useState({});

    const isAuthorized = useMemo(() => !!Object.keys(user).length, [user]);

    useEffect(() => {
        let userFromLS = localStorage.getItem('userInfo');

        if (userFromLS) {
            userFromLS = JSON.parse(userFromLS);
            if (Math.ceil(Math.abs(new Date().getTime() - new Date(userFromLS.date).getTime()) / (1000 * 3600)) < 12) {
                setUser(userFromLS.user);
            } else {
                localStorage.removeItem('userInfo');
            }
        }
    }, []);

    useEffect(() => {
        if (isAuthorized) {
            apiClient(`api/movies/favorite?id=${user.id}`, 'GET').then(res => res.json()).then(({ response }) => setUserFavorites(response));
        } else {
            setUserFavorites([]);
        }
    }, [isAuthorized, user.id]);

    useEffect(() => {
        setLoading('Загрузка...');
        apiClient(`api/movies?search=${filter.search}&year=${filter.year}&genre=${filter.genre}&country=${filter.country}`, 'GET').then(res => res.json()).then(({response}) => {
            setMovies(response);
            setLoading('')
        })
        .catch(() => setLoading(''));
    }, [
        filter.year,
        filter.country,
        filter.genre,
        filter.search
    ]);

    const getRatingColor = useCallback((rating) => {
        if (rating > 7) return 'green';
        if (rating > 4) return 'yellow';
        return 'red';
    }, []);

    const addToFavorite = (movieId) => {
        if (isAuthorized) {
            apiClient('api/movies/favorite', 'PATCH', JSON.stringify({
                userId: user.id,
                movieId: movieId
            })).then(res => res.json()).then(body => {
                if (body.result)
                    apiClient(`api/movies/favorite?id=${user.id}`, 'GET').then(res => res.json()).then(({ response }) => setUserFavorites(response));
            })
        } else {
            setShowModal('Authorization')
        }
    };

    const handleFilterChange = (e) => setLocalFilter(prevState => ({ ...prevState, [e.target.name]: e.target.value }));

    const submitFilter = (e) => {
        e.preventDefault();
        setFilter(prev => ({ ...prev, ...localFilter }))
    };

    const handleRating = (rating, id) => {
        apiClient(`api/movies?id=${id}`, 'PATCH', JSON.stringify({ rating, userId: user.id })).then(res => res.json()).then(body => {
            if (body.status) {
                const moviesArray = [...movies];
                const movieForEdit = moviesArray.find(item => item.id === id);
                movieForEdit.ratingCount += 1;
                movieForEdit.rating += rating;
                setMovies(moviesArray);
            }
        })
    }

    const movie = (data) =>
        <div className="movie-wrapper" onClick={() => setShowMovie(data)}>
            <div className="movie-pic-wrapper">
                <img src={`data:image/png;base64, ${data.pic}`}/>
            </div>
            <div className="movie-info-wrapper">
                <h3>{data.name}</h3>
                <h4> {`${data.englishName ? `${data.englishName}, ` : ''}${new Date(data.date).getFullYear()}, ${data.duration} мин.`} </h4>
                <p>{`${data.country.split(',')[0]} • ${data.genre.split(',')[0]}`} &nbsp;&nbsp; {`Режиссёр: ${data.director.split(',')[0]}`}</p>
                <p>В ролях: {data.actors}</p>
                <a href={data.trailer} target="_blank">Смотреть трейлер</a>
            </div>
            <div className="movie-actions-wrapper">
                <h2 style={{color: getRatingColor(data.rating)}}>{(data.ratingCount ? data.rating / data.ratingCount : 0).toFixed(1)}</h2>
                <p>{data.ratingCount}</p>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    handleRating(e.target.rating.value, data.id);
                }}>
                    <input name="rating" max={10} type="number" min={1} required/>
                    <button type="submit">Оценить</button>
                </form>
                <button onClick={() => addToFavorite(data.id)}>Хочу смотреть</button>
            </div>
        </div>

  return (
    <div className="App">
      <Header user={user} setUser={setUser} isAuthorized={isAuthorized} userFavorites={userFavorites} setFilter={setFilter} />
        <div className="main-page-wrapper">
            <form className="filter" onSubmit={submitFilter}>
                <div className="input-wrapper">
                    <label htmlFor="country">Страны </label>
                    <input name="country" id="country" onChange={handleFilterChange}/>
                </div>

                <div className="input-wrapper">
                    <label htmlFor="genre">Жанры </label>
                    <input name="genre" id="genre" onChange={handleFilterChange}/>
                </div>

                <div className="input-wrapper">
                    <label htmlFor="year">Годы </label>
                    <input type="number" name="year" id="year" onChange={handleFilterChange}/>
                </div>

                <button type="submit">Искать</button>
            </form>
            <div className="movies-list">
                {loading ? <h1>{loading}</h1> : movies.length ? movies.map(item => movie(item)) : <h1>Ничего не найдено</h1>}
            </div>
        </div>
        {showModal && <Modal close={() => setShowModal('')} setUser={setUser} initialTab={showModal} />}
        {Object.keys(showMovie).length &&
            <div className="modal" onClick={() => setShowMovie({})}>
                <div className="modal-content movie" onClick={e => e.stopPropagation()}>
                    <div className="movie-wrapper modal-movie">
                        <div className="movie-pic-wrapper">
                            <img src={`data:image/png;base64, ${showMovie.pic}`}/>
                        </div>
                        <div className="movie-info-wrapper">
                            <h2>{showMovie.name}</h2>
                            <h4> {showMovie.englishName}</h4>
                            <p>Жаер: {showMovie.genre}</p>
                            <p>Страна: {showMovie.country}</p>
                            <p>Дата выхода: {new Date(showMovie.date).toLocaleString("ru", {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                timezone: 'UTC'
                            })}</p>
                            <p>Режиссёр: {showMovie.director}</p>
                            <p>Сценарий: {showMovie.screenwriter}</p>
                            <p>Продюссер: {showMovie.producer}</p>
                            <p>Оператор: {showMovie.budget}</p>
                            <p>В ролях: {showMovie.actors}</p>
                            <p>Сборы в мире: {showMovie.money}</p>
                            <p>Длительность: {showMovie.duration} мин.</p>
                            <p>Возраст: {showMovie.age}+</p>
                            <p>Описание: {showMovie.description}</p>
                            <a href={showMovie.trailer} target="_blank">Смотреть трейлер</a>
                        </div>
                        <div className="movie-actions-wrapper">
                            <h2 style={{color: getRatingColor(showMovie.rating)}}>{(showMovie.ratingCount ? showMovie.rating / showMovie.ratingCount : 0).toFixed(1)}</h2>
                            <p>{showMovie.ratingCount}</p>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                handleRating(e.target.rating.value, showMovie.id);
                            }}>
                                <input name="rating" max={10} type="number" min={1} required/>
                                <button type="submit">Оценить</button>
                            </form>
                            <button onClick={() => addToFavorite(showMovie.id)}>Хочу смотреть</button>
                        </div>
                    </div>
                </div>
            </div>
        }
    </div>
  );
}

export default App;
