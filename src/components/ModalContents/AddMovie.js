export const AddMovie = () => {
    return (
        <form className="form" encType="multipart/form-data" method="POST" action="http://localhost:2300/api/movies">
            <h2 className="form-name">Добавить фильм</h2>

            <div className="inputs-wrapper">
                <div className="input-wrapper">
                    <label htmlFor="name">Название: </label>
                    <input type="text" name="name" id="name" required />
                </div>
                <div className="input-wrapper">
                    <label htmlFor="englishName">Английское название: </label>
                    <input type="text" name="englishName" id="englishName" />
                </div>
            </div>

            <div className="inputs-wrapper">
                <div className="input-wrapper">
                    <label htmlFor="date">Дата выпуска: </label>
                    <input type="date" name="date" id="date" required />
                </div>
                <div className="input-wrapper">
                    <label htmlFor="genre">Жанр: </label>
                    <input type="text" name="genre" id="genre" required />
                </div>
                <div className="input-wrapper">
                    <label htmlFor="duration">Длительность: </label>
                    <input type="number" name="duration" id="duration" required />
                </div>
            </div>

            <div className="inputs-wrapper">
                <div className="input-wrapper">
                    <label htmlFor="director">Режиссер: </label>
                    <input type="text" name="director" id="director" required />
                </div>
                <div className="input-wrapper">
                    <label htmlFor="producer">Продюссер: </label>
                    <input type="text" name="producer" id="producer" required/>
                </div>
            </div>

            <div className="inputs-wrapper">
                <div className="input-wrapper">
                    <label htmlFor="operator">Оператор: </label>
                    <input type="text" name="operator" id="operator" required/>
                </div>
                <div className="input-wrapper">
                    <label htmlFor="screenwriter">Сценарист: </label>
                    <input type="text" name="screenwriter" id="screenwriter" required/>
                </div>
            </div>

            <div className="inputs-wrapper">
                <div className="input-wrapper">
                    <label htmlFor="budget">Бюджет: </label>
                    <input type="number" name="budget" id="budget" required/>
                </div>
                <div className="input-wrapper">
                    <label htmlFor="money">Сборы в мире: </label>
                    <input type="number" name="money" id="money" required/>
                </div>
                <div className="input-wrapper">
                    <label htmlFor="country">Страна: </label>
                    <input type="text" name="country" id="country" required/>
                </div>
            </div>

            <div className="inputs-wrapper">
                <div className="input-wrapper">
                    <label htmlFor="age">Возрастное ограничение: </label>
                    <input type="number" name="age" id="age" required/>
                </div>
                <div className="input-wrapper">
                    <label htmlFor="trailer">Трейлер: </label>
                    <input type="text" name="trailer" id="trailer" required />
                </div>
            </div>

            <div className="input-wrapper">
                <label htmlFor="actors">Актеры: </label>
                <input name="actors" id="actors" required />
            </div>

            <div className="input-wrapper">
                <label htmlFor="description">Описание: </label>
                <textarea name="description" id="description" required />
            </div>

            <div className="input-wrapper">
                <label htmlFor="pic">Афиша: </label>
                <input type="file" name="pic" id="pic" className="file-input" required />
            </div>

            <div className="form-button-wrapper">
                <button className="form-button" type="submit">Добавить</button>
            </div>
        </form>
    );
}
