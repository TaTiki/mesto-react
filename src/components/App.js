import { useEffect, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import ImagePopup from "./ImagePopup";
import Main from "./Main";
import PopupWithForm from "./PopupWithForm";
import api from "../utils/api";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';

function App() {

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);


  useEffect(() => {
    Promise.all([
      api.getUser(),
      api.getInitialCards(),
    ]).then(([user, cards]) => {
      setCurrentUser(user);
      setCards(cards);
    }).catch(console.log);
  }, [])

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  };
  
  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  };
  
  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
  }

  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setSelectedCard({});
  };

  const handleUpdateUser = (userInfo) => {
    return api.updateUserInfo(userInfo).then(setCurrentUser);
  }

  const handleUpdateAvatar = (avatar) => {
    return api.updateUserAvatar(avatar).then(setCurrentUser);
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    const func = isLiked ? api.unlikeCard : api.likeCard;
    func(card._id).then((newCard) => {
      setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
    }).catch(console.log);
  } 

  function handleCardDelete(card) {
    api.deleteCard(card._id).then(() => {
      setCards((state) => state.filter((c) => c._id !== card._id));
    }).catch(console.log);
  }

  function handleAddPlace(card) {
    return api.postCard(card).then((card) => {
      setCards([card, ...cards]);
    });
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header/>
        <Main onEditProfile={handleEditProfileClick}
        onAddPlace={handleAddPlaceClick} onEditAvatar={handleEditAvatarClick}
        onCardClick={handleCardClick} cards = {cards} onCardLike = {handleCardLike} onCardDelete = {handleCardDelete}/>
        <EditProfilePopup isOpen ={isEditProfilePopupOpen} onClose ={closeAllPopups} onUpdateUser = {handleUpdateUser}/> 
        <EditAvatarPopup isOpen ={isEditAvatarPopupOpen} onClose ={closeAllPopups} onUpdateAvatar = {handleUpdateAvatar}/> 
        <AddPlacePopup isOpen = {isAddPlacePopupOpen} onClose = {closeAllPopups} onAddPlace = {handleAddPlace}/>

        <ImagePopup card={selectedCard} onClose={closeAllPopups}/>

        <Footer/>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
