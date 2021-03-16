import { useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import ImagePopup from "./ImagePopup";
import Main from "./Main";
import PopupWithForm from "./PopupWithForm";

function App() {

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});

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

  const avatarPopupFields = (
    <>
      <input className="form__input" type="url"
      placeholder="Ссылка на картинку" id="edit-avatar-link" required/>
    </>
  );

  const editProfilePopupFields = (
    <>
      <input className="form__input" type="text" id="edit-profile-name" 
      placeholder="имя" required minLength="2" maxLength="40"/>

      <input className="form__input" type="text" id="edit-profile-hobby"
      placeholder="хобби" required minLength="2" maxLength="200"/>
    </>
  );

  const addPlacePopupFields = (
    <>
      <input className="form__input" type="text" placeholder="Название"
      id="add-place-name" required minLength="2" maxLength="30"/>

      <input className="form__input" type="url"
      placeholder="Ссылка на картинку" id="add-place-link" required/>
    </>
  );

  return (
    <div className="page">
      <Header/>
      <Main onEditProfile={handleEditProfileClick}
      onAddPlace={handleAddPlaceClick} onEditAvatar={handleEditAvatarClick}
      onCardClick={handleCardClick}/>
      <PopupWithForm name="edit-profile" title="Редактировать профиль"
      inputs={editProfilePopupFields} isOpen={isEditProfilePopupOpen} onClose={closeAllPopups}/>

      <PopupWithForm name="add-place" title="Новое место"
      inputs={addPlacePopupFields} isOpen={isAddPlacePopupOpen} onClose={closeAllPopups}/>

      <PopupWithForm name="edit-avatar" title="Обновить аватар"
      inputs={avatarPopupFields} isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups}/>

      <ImagePopup card={selectedCard} onClose={closeAllPopups}/>

      <Footer/>
    </div>
  );
}

export default App;
