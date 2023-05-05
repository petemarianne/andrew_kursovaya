import {useCallback, useRef, useState} from "react";
import { apiClient } from "../../api/api.js";

export const Registration = ({ setUser, close, isAdmin }) => {
    const [error, setError] = useState('');

    const submit = useCallback((e) => {
        e.preventDefault();
        const { email, password, name, surname, password2 } = e.target;
        apiClient('api/auth/register', 'POST', JSON.stringify({ email: email.value, password: password.value, name: name.value, surname: surname.value, password2: password2.value, isAdmin }))
            .then(res => res.json())
            .then(body => {
                if (body.errors) {
                    setError(body.errors[0].msg);
                } else if (body.message) {
                    setError(body.message);
                } else if (setUser) {
                    close();
                }
            })
    }, []);

    return (
        <form className="form" onSubmit={submit}>
            <h2 className="form-name">Регистрация</h2>

            <div className="input-wrapper">
                <label htmlFor="name">Имя: </label>
                <input type="text" name="name" id="name" required />
            </div>

            <div className="input-wrapper">
                <label htmlFor="surname">Фамилия: </label>
                <input type="text" name="surname" id="surname" required />
            </div>

            <div className="input-wrapper">
                <label htmlFor="email">Почта: </label>
                <input type="email" name="email" id="email" required />
            </div>

            <div className="input-wrapper">
                <label htmlFor="password">Пароль: </label>
                <input type="password" name="password" id="password" required />
            </div>

            <div className="input-wrapper">
                <label htmlFor="password2">Повторите пароль: </label>
                <input type="password" name="password2" id="password2" required />
            </div>

            <p className="form-error">{ error }</p>

            <div className="form-button-wrapper">
                <button className="form-button" type="submit">Зарегистрироваться</button>
            </div>
        </form>
    );
}
