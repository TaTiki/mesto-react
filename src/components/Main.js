import { useEffect, useState } from 'react';
import api from '../utils/api';
import Card from './Card';

export default function Main({ onEditProfile, onAddPlace, onEditAvatar, onCardClick }) {

  const [user, setUser] = useState({});
  const [cards, setCards] = useState([]);

  useEffect(() => {
    Promise.all([
      api.getUser(),
      api.getInitialCards(),
    ]).then(([user, cards]) => {
      setUser(user);
      setCards(cards);
    }).catch((err) => {
      console.log(err)
    });
    /*api.getUser()
    .then(setUser).catch(console.log);

    api.getInitialCards()
    .then(setCards).catch(console.log);
    */
  }, []);

  return (
    <main>
      <section className="profile">
        <div className="profile__container">
          <div className="profile__container-marker">
            <img className="profile__picture" alt="Аватар" src={user.avatar}/>
            <button
            className="profile__picture-edit-button"
            aria-label="открыть форму обновления аватара профиля"
            onClick={onEditAvatar}></button>
          </div>
          <div className="profile__data">
            <div className="profile__info">
              <h1 className="profile__name">{user.name}</h1>
              <p className="profile__hobby">{user.about}</p>
            </div>
            <button
            className="profile__edit-button"
            aria-label="редактировать профиль"
            type="button"
            onClick={onEditProfile}></button>
          </div>
        </div>
        <button
        className="profile__add-button"
        aria-label="добавить фотографии"
        type="button"
        onClick={onAddPlace}></button>
      </section>
      <section className="photos">
        <ul className="photos__list">
          {
            cards.map(card => (
              <Card card={card} key={card._id} onCardClick={onCardClick}/>
            ))
          }
        </ul>
      </section>
    </main>
  );
}
