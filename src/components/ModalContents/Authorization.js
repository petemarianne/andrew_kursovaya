import {useCallback, useState} from "react";
import { apiClient } from "../../api/api.js";

export const Authorization = ({ goToRegistration, setUser, close }) => {
    const goTo = useCallback(() => goToRegistration('Registration'), []);
    const [error, setError] = useState('');

    const submit = useCallback((e) => {
        e.preventDefault();
        setError('');
        const { login: email, password } = e.target;
        apiClient('api/auth/login', 'POST', JSON.stringify({ email: email.value, password: password.value }))
            .then(res => res.json()).then(body => {
            if (body.message) {
                setError(body.message)
            } else {
                setUser(body.userInfo);
                localStorage.setItem('userInfo', JSON.stringify({ date: new Date(), user: body.userInfo }));
                close();
            }
        });
    }, []);

    return (
        <form className="form" onSubmit={submit}>
            <h2 className="form-name">Авторизация</h2>

            <div className="input-wrapper">
                <label htmlFor="login">Логин: </label>
                <input type="email" name="login" id="login" required />
            </div>

            <div className="input-wrapper">
                <label htmlFor="password">Пароль: </label>
                <input type="password" name="password" id="password" required />
            </div>

            <p className="form-error">{ error }</p>

            <div className="form-button-wrapper">
                <button className="form-button" type="submit">Войти</button>
            </div>

            <div className="no-account">
                <span>Нет аккаунта? </span>
                <span onClick={goTo} className="go-to-registration">Зарегистрируйтесь</span>
            </div>
        </form>
    );
}
