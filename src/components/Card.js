export default function Card({ card, onCardClick }) {
  
  return (
    <li className="photos__card">
      <img className="photos__image" alt="картинка" src={card.link} onClick={() => onCardClick(card)}/>
      <div className="photos__info">
        <h2 className="photos__name">{card.name}</h2>
        <button className="photos__delete-button" 
          aria-label="удалить фотографию" 
          onClick={() => {}}></button>
        <div className="photos__like-container">
          <button
          className="photos__like-button"
          aria-label="лайк"
          type="button" onClick={() => {}}></button>
          <span className="photos__like-count">{card.likes.length}</span>
        </div>
      </div>
    </li>
  );
}
