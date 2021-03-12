export default function Profile({ user, funcs }) {
  const { editProfileFunc, editAvatarFunc, addPlaceFunc } = funcs;
  return (
    <section className="profile">
      <div className="profile__container">
        <div className="profile__container-marker">
          <img className="profile__picture" alt="Аватар" src={user.avatar}/>
          <button
          className="profile__picture-edit-button"
          aria-label="открыть форму обновления аватара профиля"
          onClick={editAvatarFunc}></button>
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
          onClick={editProfileFunc}></button>
        </div>
      </div>
      <button
      className="profile__add-button"
      aria-label="добавить фотографии"
      type="button"
      onClick={addPlaceFunc}></button>
    </section>
  );
}
