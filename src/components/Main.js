import { useEffect, useRef, useState } from 'react';
import Profile from './Profile';
import Api from '../api/Api';
import CardContainer from './CardContainer';
import ImagePopup from './ImagePopup';
import PopupWithForm from './PopupWithForm';

export default function Main() {

  const api = useRef(new Api({
    baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-20',
    headers: {
      authorization: '6577e49f-15b9-4798-93b6-109a6b031458',
    },
    timeout: 20000,
  }));

  const cardIdToDelete = useRef();

  const [user, setUser] = useState({});
  const [cards, setCards] = useState([]);
  const [popupWithImage, setPopupWithImage] = useState({
    active: false,
  });
  const [profilePopupActive, setProfilePopupActive] = useState(false);
  const [newPlaceActive, setNewPlaceActive] = useState(false);
  const [editAvatarActive, setEditAvatarActive] = useState(false);
  const [deletePhotoActive, setDeletePhotoActive] = useState(false);

  useEffect(() => {
    Promise.all([
      api.current.getUser(),
      api.current.getInitialCards(),
    ]).then(([user, cards]) => {
      setUser(user);
      setCards(cards);
    }).catch((err) => {
      console.log(err);
    });
  }, []);
  
  const openPopupWithImage = (card) => {
    setPopupWithImage({
      card,
      active: true,
    })
  }
  
  const openAddPlacePopup = () => {
    setNewPlaceActive(true);
  }

  const openEditAvatarPopup = () => {
    setEditAvatarActive(true);
  }

  const openEditProfilePopup = () => {
    setProfilePopupActive(true);
  }

  const openDeletePhotoPopup = (card) => {
    cardIdToDelete.current=card._id;
    setDeletePhotoActive(true);
  }

  const closePopupWithImage = () => {
    setPopupWithImage({
      active: false,
    });
  };

  const closeNewPlacePopup = () => {
    setNewPlaceActive(false);
  };

  const closeEditAvatarPopup = () => {
    setEditAvatarActive(false);
  }

  const closeEdiitProfilePopup = () => {
    setProfilePopupActive(false);
  }

  const closeDeletePhotoPopup = () => {
    setDeletePhotoActive(false);
  }

  const submitAddPlace = (values) => {
    return api.current.postCard({
      name: values[0],
      link: values[1],
    }).then((card) => {
      console.log(card);
      setCards([card, ...cards])
    });
  }

  const submitEditAvatar = (values) => {
    return api.current.updateUserAvatar(values[0])
    .then(setUser);
  }

  const submitEditProfile = (values) => {
    return api.current.updateUserInfo({
      name: values[0],
      about: values[1]
    }).then(setUser);
  }

  const deleteCard = () => {
    const id = cardIdToDelete.current
    return api.current.deleteCard(id)
    .then(() => {
      setCards(cards.filter((card) => card._id !== id))
    })
  }
  const addPlaceFields = {
    title: "Новое место",
    inputs: [
      {
        type: "text",
        placeholder: "Название",
        required: true,
        minLength: 2,
        maxLength: 30,
      },{
        type: "url",
        placeholder: "Ссылка на картинку",
        required: true,
      }
    ],
    funcs: {
      submitFunc: submitAddPlace,
      closeFunc: closeNewPlacePopup,
    },
    buttonText:"Создать",
    initSubmitDisabled: true,
  }

  const editAvatarFields = {
    title:"Обновить аватар",
    inputs : [{
      type: "url",
      placeholder: "Ссылка на картинку",
      required: true,
      defaultValue: user.avatar
    }],
    funcs: {
      submitFunc: submitEditAvatar,
      closeFunc: closeEditAvatarPopup,
    },
    buttonText: "Сохранить",
    initSubmitDisabled: false,
  }

  const profileFuncs = {
    editProfileFunc: openEditProfilePopup,
    editAvatarFunc: openEditAvatarPopup,
    addPlaceFunc: openAddPlacePopup,
  }

  const cardFuncs = {
    likeFunc: api.current.likeCard,
    unlikeFunc: api.current.unlikeCard,
    openPopupWithImage,
    deleteFunc: openDeletePhotoPopup,
  };

  const editProfileFields = {
    title:"Редактировать профиль",
    inputs: [{
      type: "text",
      required: true,
      minLength: 2,
      maxLength: 40,
      defaultValue: user.name,
    }, {
      type: "text",
      required: true,
      minLength: 2,
      maxLength: 200,
      defaultValue: user.about,
    }],
    funcs: {
      submitFunc: submitEditProfile,
      closeFunc: closeEdiitProfilePopup,
    },
    buttonText: "Сохранить",
    initSubmitDisabled: false,
  }

  const deletePhotoFields = {
    title: "Вы уверены?",
    inputs: [],
    funcs: {
      submitFunc: deleteCard,
      closeFunc: closeDeletePhotoPopup,
    },
    buttonText: "Да",
    initSubmitDisabled: false,
  }

  return (
    <>
    { user.avatar &&
      <main>
        <Profile user={user} funcs={profileFuncs}/>
        <CardContainer cards={cards} user={user} funcs={cardFuncs}/>
        { popupWithImage.active && <ImagePopup card={popupWithImage.card} closeFunc={closePopupWithImage}/>}
        { newPlaceActive && <PopupWithForm {...addPlaceFields}/>}
        { editAvatarActive && <PopupWithForm {...editAvatarFields}/>}
        { profilePopupActive && <PopupWithForm {...editProfileFields}/>}
        { deletePhotoActive && <PopupWithForm {...deletePhotoFields}/>}
      </main>
    }
    </>
  );
}
