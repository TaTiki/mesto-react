import Card from "./Card";

export default function CardContainer({ user, cards, funcs }) {
  return (
    <section className="photos">
      <ul className="photos__list">
        {cards.map( (card) => <Card
        initCard={card}
        user={user}
        key={card._id} 
        funcs={funcs}/>)}
      </ul>
    </section>
  );
}
