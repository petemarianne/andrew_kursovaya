import {useState} from "react";

export const EditMovie = ({ movie }) => {
    const [data, setData] = useState({ ...movie, date: new Date(movie.date).toLocaleDateString('zh-Hans-CN').replace(/\//, '-').replace(/\//, '-') });

    const handleChange = e =>  setData(prevState => ({ ...prevState, [e.target.name]: e.target.value }));

    return (
        <form className="form" encType="multipart/form-data" method="POST" action={`http://localhost:2300/api/movie/edit?id=${data.id}`}>
            <h2 className="form-name">Редактировать фильм</h2>

            <div className="inputs-wrapper">
                <div className="input-wrapper">
                    <label htmlFor="name">Название: </label>
                    <input type="text" name="name" id="name" onChange={handleChange} value={data.name}/>
                </div>
                <div className="input-wrapper">
                    <label htmlFor="englishName">Английское название: </label>
                    <input type="text" name="englishName" id="englishName" onChange={handleChange} value={data.englishName}/>
                </div>
            </div>

            <div className="inputs-wrapper">
                <div className="input-wrapper">
                    <label htmlFor="date">Дата выпуска: </label>
                    <input type="date" name="date" id="date" onChange={handleChange} value={data.date}/>
                </div>
                <div className="input-wrapper">
                    <label htmlFor="genre">Жанр: </label>
                    <input type="text" name="genre" id="genre" onChange={handleChange} value={data.genre}/>
                </div>
                <div className="input-wrapper">
                    <label htmlFor="duration">Длительность: </label>
                    <input type="number" name="duration" id="duration" onChange={handleChange} value={data.duration}/>
                </div>
            </div>

            <div className="inputs-wrapper">
                <div className="input-wrapper">
                    <label htmlFor="director">Режиссер: </label>
                    <input type="text" name="director" id="director" onChange={handleChange} value={data.director}/>
                </div>
                <div className="input-wrapper">
                    <label htmlFor="producer">Продюссер: </label>
                    <input type="text" name="producer" id="producer" onChange={handleChange} value={data.producer}/>
                </div>
            </div>

            <div className="inputs-wrapper">
                <div className="input-wrapper">
                    <label htmlFor="operator">Оператор: </label>
                    <input type="text" name="operator" id="operator" onChange={handleChange} value={data.operator}/>
                </div>
                <div className="input-wrapper">
                    <label htmlFor="screenwriter">Сценарист: </label>
                    <input type="text" name="screenwriter" id="screenwriter" onChange={handleChange} value={data.screenwriter}/>
                </div>
            </div>

            <div className="inputs-wrapper">
                <div className="input-wrapper">
                    <label htmlFor="budget">Бюджет: </label>
                    <input type="number" name="budget" id="budget" onChange={handleChange} value={data.budget}/>
                </div>
                <div className="input-wrapper">
                    <label htmlFor="money">Сборы в мире: </label>
                    <input type="number" name="money" id="money" onChange={handleChange} value={data.money}/>
                </div>
                <div className="input-wrapper">
                    <label htmlFor="country">Страна: </label>
                    <input type="text" name="country" id="country" onChange={handleChange} value={data.country}/>
                </div>
            </div>

            <div className="inputs-wrapper">
                <div className="input-wrapper">
                    <label htmlFor="age">Возрастное ограничение: </label>
                    <input type="number" name="age" id="age" onChange={handleChange} value={data.age}/>
                </div>
                <div className="input-wrapper">
                    <label htmlFor="trailer">Трейлер: </label>
                    <input type="text" name="trailer" id="trailer" onChange={handleChange} value={data.trailer}/>
                </div>
            </div>

            <div className="input-wrapper">
                <label htmlFor="actors">Актеры: </label>
                <input name="actors" id="actors" onChange={handleChange} value={data.actors}/>
            </div>

            <div className="input-wrapper">
                <label htmlFor="description">Описание: </label>
                <textarea name="description" id="description" onChange={handleChange} value={data.description}/>
            </div>

            <div className="input-wrapper">
                <label htmlFor="pic">Афиша: </label>
                <input type="file" name="pic" id="pic" className="file-input" />
            </div>

            <div className="form-button-wrapper">
                <button className="form-button" type="submit">Редактировать</button>
            </div>
        </form>
    );
}
