import {useRef} from 'react';
import PopupWithForm from './PopupWithForm';
export default function AddPlacePopup({isOpen, onClose, onAddPlace}) {
  const name = useRef('');
  const link = useRef('');
  function handleSubmit(e) {
    e.preventDefault();
  
    onAddPlace({
      name: name.current,
      link: link.current,
    }).then(onClose).catch(console.log);
  } 

  function handleChange(evt) {
    if(evt.target.id === "add-place-name") {
      name.current = evt.target.value;
    }else {
      link.current = evt.target.value;
    } 
  }
  return (
    <PopupWithForm name="add-place" title="Новое место"
    isOpen={isOpen} onClose={onClose} onSubmit = {handleSubmit}>

      <input className="form__input" type="text" placeholder="Название"
      id="add-place-name" required minLength="2" maxLength="30" onChange ={handleChange}/>

      <input className="form__input" type="url"
      placeholder="Ссылка на картинку" id="add-place-link" required onChange ={handleChange}/>
    </PopupWithForm>
  )
}