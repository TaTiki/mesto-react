import { useEffect } from "react";

export default function PopupWithImage({ card, closeFunc }) {
  const { link, name } = card;

  useEffect(() => {
    const handleEscClose = ({ key }) => {
      if (key === 'Escape') {
        closeFunc();
      }
    }

    const handleClick = ({ target }) => {
      if (target.classList.contains('popup')) {
        closeFunc();
      }
    }

    document.addEventListener('keydown', handleEscClose);
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('keydown', handleEscClose);
      document.removeEventListener('click', handleClick);
    };
  }, [closeFunc]);

  return (
    <div className="popup popup_opened" id="show-photo">
      <div className="popup__container popup__container-photos">
        <form className="form-photos">
          <img className="form-photos__image" alt={name} src={link}/>
          <h4 className="form-photos__info">{name}</h4>
        </form>
        <button className="popup__close-btn" aria-label="закрыть просмотр фотографии" onClick={closeFunc}></button>
      </div>
    </div>
  );
}
