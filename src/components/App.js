import { useEffect, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import ImagePopup from "./ImagePopup";
import Main from "./Main";
import api from "../utils/api";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import { Switch, Route, withRouter, useLocation } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import ProtectedRoute from "./ProtectedRoute";
import auth, { Auth } from '../utils/auth';

function App({history}) {

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [JWT, setJWT] = useState('');
  const [email, setEmail] = useState('');
  const [headerProps, setHeaderProps] = useState({buttonText: '', onClick: () => {}});

  const { pathname } = useLocation();

  useEffect(() => {
    console.log(pathname)
    switch (pathname) {
      case '/':
        console.log(1) 
        setHeaderProps({
          buttonText: 'Выйти',
          onClick: () => {
            localStorage.removeItem('JWT');
            setEmail('');
          }
        });
        
        break;
      case '/sign-in': 
      console.log(2)
        setHeaderProps({
          buttonText: 'Регистрация',
          onClick: () => {
            history.push('/sign-up');
          }
        });
        
        break;
      case '/sign-up': 
      console.log(3)
        setHeaderProps({
          buttonText: 'Войти',
          onClick: () => {
            history.push('/sign-in');
          }
        });
    }
  },[pathname] )

  useEffect(() => {
    console.log('babis')
    console.log(localStorage.getItem('JWT'))
    
    handleTokenCheck()
    
   
  }, [JWT])

  useEffect(() => {
    if(email) {
      
      Promise.all([
        api.getUser(),
        api.getInitialCards(),
      ]).then(([user, cards]) => {
        setCurrentUser(user);
        setCards(cards);
      }).catch(console.log);
    }
  }, [email])

  const handleTokenCheck = () => {
    if(localStorage.getItem('JWT')) {
      const JWT = localStorage.getItem('JWT');
      auth.getAuthUser(JWT).then((email) => {
        setEmail(email);
        history.push('/');
      }).catch(console.log)
    }
  }

  const handleSignUp = (email, password) => {
    console.log('babis')
    auth.signup(email, password).then(()=> {
      history.push('/sign-in')
    })
    .catch(console.log)
  }

  const handleSignIn = (email, password) => {
    auth.signin(email, password).then((token) => {
      console.log(token)
      setJWT(token);
     
    }).catch(console.log)
  }

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
        <Header email = {email} onClick = {headerProps.onClick} textButton = {headerProps.buttonText} />
        <Switch>
          <ProtectedRoute exact path = '/' component = { Main } onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick} onEditAvatar={handleEditAvatarClick} loggedIn = {email !== ''}
            onCardClick={handleCardClick} cards = {cards} onCardLike = {handleCardLike} onCardDelete = {handleCardDelete}/>
          <Route path = '/sign-up'>
            <Register onSubmit = {handleSignUp}/>
          </Route>  
          <Route path = '/sign-in'>
            <Login onSubmit = {handleSignIn}/>
          </Route>  
        </Switch>
        <EditProfilePopup isOpen ={isEditProfilePopupOpen} onClose ={closeAllPopups} onUpdateUser = {handleUpdateUser}/> 
        <EditAvatarPopup isOpen ={isEditAvatarPopupOpen} onClose ={closeAllPopups} onUpdateAvatar = {handleUpdateAvatar}/> 
        <AddPlacePopup isOpen = {isAddPlacePopupOpen} onClose = {closeAllPopups} onAddPlace = {handleAddPlace}/>

        <ImagePopup card={selectedCard} onClose={closeAllPopups}/>

        <Footer/>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default withRouter(App);
