import { useRef } from 'react';
import PopupWithForm from './PopupWithForm';

export default function EditAvatarPopup({isOpen, onClose, onUpdateAvatar}) {
  const avatar = useRef('');
  function handleSubmit(e) {
    e.preventDefault();
  
    onUpdateAvatar({
      avatar: avatar.current,
    }).then(onClose).catch(console.log);
  } 

  function handleChange(evt) {
    avatar.current = evt.target.value;
  }
  return (
    <PopupWithForm name="edit-avatar" title="Обновить аватар"
    isOpen={isOpen} onClose={onClose} onSubmit = {handleSubmit}>

      <input className="form__input" type="url"
      placeholder="Ссылка на картинку" id="edit-avatar-link" required onChange = {handleChange}/>
    </PopupWithForm>

  )
}
