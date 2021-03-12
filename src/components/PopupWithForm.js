import { useEffect, useRef, createRef, useState, Fragment } from 'react';

export default function PopupWithForm({ title, inputs, funcs, buttonText, initSubmitDisabled }) {
  const { submitFunc, closeFunc } = funcs;

  const [errors, setErrors] = useState(inputs.map(() => ""))
  const [submitDisabled, setSubmitDisabed] = useState(initSubmitDisabled)
  const [serverError, setServerError] = useState("");
  const [subText, setSubText] = useState(buttonText);

  const inputRefs = useRef(inputs.map(() => createRef()));

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

  const isNotValid = obj => !obj.current.validity.valid;

  const handleSubmitButton = () => {
    setSubmitDisabed(inputRefs.current.some(isNotValid));
  }
  const submit = (evt) => {
    evt.preventDefault();
    const values = inputRefs.current.map(obj => obj.current.value);
    let counter = 0;
    const interval = setInterval(() => {
      counter++;
      switch (counter%4) {
      case 0:
        setSubText(buttonText);
        break;
      case 1:
        setSubText(buttonText + ".");
        break;
      case 2:
        setSubText(buttonText + "..");
        break;
      case 3:
        setSubText(buttonText + "...");
        break;
      default:
      }
    },200);
    submitFunc(values)
    .then(closeFunc)
    .catch(() => {
      setServerError("Что-то пошло не так,попробуйте снова...")
    }).finally(() => {
      clearInterval(interval);
      setSubText(buttonText);
    });
  }

  const handelOnChange = (evt,idx) => {
    console.log(inputRefs.current[idx].current)
    const valid = evt.target.validity.valid
    if (valid && errors[idx].length >0) {
      setErrors([...errors.slice(0,idx),
        '',
        ...errors.slice(idx+1)])
    }else if (!valid && errors[idx].length === 0) {
      setErrors([...errors.slice(0,idx),
        evt.target.validationMessage,
        ...errors.slice(idx+1)])
    }
    handleSubmitButton();
  }

  return (
    <div className="popup popup_opened">
      <div className="popup__container">
        <form className="form" name="inform" noValidate onSubmit={submit}>
          <h3 className="form__header">{title}</h3>
          <fieldset className="form__fieldset">
            {
              inputs.map((input, idx) => (
                <Fragment key={idx}>
                  <input
                  ref={inputRefs.current[idx]}
                  {...input} 
                  className="form__input" onChange={(evt) => { handelOnChange(evt,idx)}}/>
                  {errors[idx] && <span className="form__input-error">{errors[idx]}</span>}
                </Fragment>))
            }
            {serverError && <span className="form__input-server-error">{serverError}</span>}
            <button
            className={ submitDisabled ? "form__save-btn form__save-btn-inactive" : "form__save-btn"}
            type="submit"
            disabled={submitDisabled}>{subText}</button>
          </fieldset>
        </form>
        <button className="popup__close-btn" type="reset" aria-label="Закрыть форму" onClick={closeFunc}></button>
      </div>
    </div>
  );
}
