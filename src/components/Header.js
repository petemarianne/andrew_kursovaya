import {Modal} from "./Modal.js";
import {useCallback, useState} from "react";
import {ReactComponent as UserIcon} from '../images/user.svg';

export const Header = ({user, setUser, isAuthorized, userFavorites, setFilter, setUserFavorites}) => {
    const [showModal, setShowModal] = useState('');

    const handleCloseModal = useCallback(() => setShowModal(false), []);

    const handleLogOut = useCallback(() => {
        localStorage.removeItem('userInfo');
        setUser({});
    }, []);

    const handleSearch = (e) => {
        if (e.code === 'Enter') setFilter(prev => ({ ...prev, search: e.target.value }))
        if (!e.target.value) setFilter(prev => ({ ...prev, search: '' }))
    }

    return (
        <>
            <header className="header">
                <h1 className="header-title">КиноСерч</h1>
                <input className="search-input" placeholder="Поиск фильма по названию..." onKeyDown={handleSearch}/>
                {isAuthorized ?
                    <div className="dropdown">
                        <button className="user-button"><UserIcon className="user-icon"/></button>
                        <div className="dropdown-content">
                            {user.isAdmin && <span onClick={() => setShowModal('AddMovie')}>Добавить фильм</span>}
                            {user.isAdmin && <span onClick={() => setShowModal('Registration')}>Создать администратора</span>}
                            <span onClick={() => setShowModal('Favorites')}>Посмотреть позже</span>
                            <span onClick={handleLogOut}>Выйти</span>
                        </div>
                    </div>
                     :
                    <div className="header-buttons">
                        <button className="header-button" onClick={() => setShowModal('Authorization')}>{'Войти'}</button>
                    </div>
                }
            </header>
            {showModal && <Modal close={handleCloseModal} setUser={setUser} initialTab={showModal} userFavorites={userFavorites} user={user} />}
        </>
    );
}