import { useEffect, useState } from "react";

export default function Card({ user, initCard, funcs }) {
  
  const [card, setCard] = useState(initCard);

  useEffect(() => {
    setCard(initCard);
  },[initCard]);

  const { likeFunc, unlikeFunc, openPopupWithImage, deleteFunc } = funcs;
  const { link, name, likes, owner } = card;
  const include = el => el._id === user._id;
  const isLiked = likes.some(include);
  const isMine = user._id === owner._id;

  const handleClick = () => {
    const toggle = isLiked ? unlikeFunc : likeFunc;
    toggle(card._id).then(setCard).catch(console.log);
  };

  const handleDelete = () => {
    deleteFunc(card);
  }

  const handleShowImage = () => {
    openPopupWithImage(card)
  };

  return (
    <li className="photos__card">
      <img className="photos__image" alt="картинка" src={link} onClick={handleShowImage}/>
      <div className="photos__info">
        <h2 className="photos__name">{name}</h2>
        { isMine && 
          <button className="photos__delete-button" 
          aria-label="удалить фотографию" 
          onClick={handleDelete}></button>}
        <div className="photos__like-container">
          <button
          className={isLiked ? 
            "photos__like-button photos__like-button-active" : 
            "photos__like-button"
          }
          aria-label="лайк"
          type="button" onClick={handleClick}></button>
          <span className="photos__like-count">{likes.length}</span>
        </div>
      </div>
    </li>
  );
}
