import { useMemo, useState } from "react";
import { Authorization } from "./ModalContents/Authorization.js";
import { Registration } from "./ModalContents/Registration.js";
import { WatchLater } from "./ModalContents/WatchLater.js";
import {AddMovie} from "./ModalContents/AddMovie.js";
import {Favorites} from "./ModalContents/Favorites.js";
import {EditMovie} from "./ModalContents/EditMovie.js";

export const Modal = ({ close, setUser, initialTab, userFavorites, user, setShowMovie, movieList, movie }) => {
    const [currentTab, setCurrentTab] = useState(initialTab);

    const tab = useMemo(() => {
        switch (currentTab) {
            case 'Authorization':
                return <Authorization goToRegistration={setCurrentTab} setUser={setUser} close={close}/>
            case 'Registration':
                return <Registration setUser={setUser} close={close} isAdmin={initialTab === 'Registration'}/>
            case 'AddMovie':
                return <AddMovie close={close}/>
            case 'Favorites':
                return <Favorites userFavorites={userFavorites} user={user} movieList={movieList} setShowMovie={setShowMovie}/>
            case 'WatchLater':
                return <WatchLater />
            case 'EditMovie':
                return <EditMovie close={close} movie={movie}/>
            default:
                return null
        }
    }, [currentTab])

    return (
        <div className="modal" onClick={close}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                { tab }
            </div>
        </div>
    );
}