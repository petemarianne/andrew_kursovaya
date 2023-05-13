import {apiClient} from "../../api/api.js";
import {useState} from "react";

export const Favorites = ({ userFavorites, user, movieList, setShowMovie }) => {

    const [movies, setMovies] = useState(userFavorites)
    const deleteFav = (id) => {
        apiClient('api/movies/favorite', 'DELETE', JSON.stringify({ movieId: id, userId: user.id })).then(() => {
            let arrayForEdit = [...movies];
            arrayForEdit = arrayForEdit.filter(item => item.id !== id)
            setMovies(arrayForEdit);
        })
    }

    return (
        <div className="favorites-list">
            { !movies.length && <h1>Фильмы еще не добавлены!</h1> }
            { movies.map(item =>
                <div className="favorite-wrapper" onClick={() => {
                    setShowMovie(movieList.find(movie => movie.id === item.id))
                }}>
                    <div className="favorite-pic-wrapper">
                        <img src={`data:image/png;base64, ${item.pic}`}/>
                    </div>
                    <div className="favorite-name">
                        <h4>{ item.name }</h4>
                        <button onClick={(e) => {
                            e.stopPropagation()
                            deleteFav(item.id)
                        }}>Удалить</button>
                    </div>
                </div>
            ) }
        </div>
    );
}
