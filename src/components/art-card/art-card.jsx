import { useContext, useState, useEffect } from 'react';
import { addPreview, removeImage, removePreview, updateImage, updatePreview } from '../../gen-state/gen.actions';
import { GenContext } from '../../gen-state/gen.context';
import classes from './art-card.module.css';

const ArtCard = ({ layerTitle, trait, setActiveCard, activeCard }) => {
  const [state, setState] = useState({
    prompt: '',
    inputValue: {
      name: trait.traitTitle,
      rarity: trait.Rarity
    },
    previousValue: '',
  })
  const { prompt, inputValue, previousValue, newImage} = state;
  const { image, traitTitle, Rarity } = trait;
  const { dispatch, preview, isRule } = useContext(GenContext);

  const handleSetState = payload => {
    setState(state => ({ ...state, ...payload }))
  }

  const handleAddPreview = (name, imageFile) => {
    dispatch(addPreview({ layerTitle, imageName: name, imageFile }))
    setActiveCard(traitTitle)
  }

  const handleRemove = () => {
    dispatch(removePreview({ layerTitle, imageName: traitTitle }))
    dispatch(removeImage({ layerTitle, traitTitle }))
  }

  const handleChange = event => {
    const { name, value } = event.target;
    handleSetState({ inputValue: ({ ...inputValue, [name]: value }) })
  }

  const handleRename = (e, imageFile) => {
    e.preventDefault()
    preview.forEach(item => {
      if (item['layerTitle'] === layerTitle && item['imageName'] === previousValue) {
        dispatch(updatePreview({ layerTitle, imageName: inputValue.name, imageFile }))
      }
    })
    handleSetState({ prompt: '' })
    dispatch(updateImage({ 
      layerTitle, 
      image, 
      traitTitle: inputValue.name, 
      Rarity: Number(inputValue.rarity) > 100 
      ? "100" 
      : Number(inputValue.rarity) < 1
      ? "1" 
      :
      inputValue.rarity 
    }))
  }

  const handlePrompt = value => {
    handleSetState({ prompt: value })
    setActiveCard(traitTitle)
    handleSetState({ previousValue: traitTitle })
  }

  useEffect(() => {
    if (activeCard !== traitTitle) handleSetState({ prompt: '' })
  }, [activeCard, traitTitle])

  useEffect(() => {
    if (!preview.length) {
      setActiveCard('')
    }
  }, [preview])

  return (
    <div className={`${classes.container} ${activeCard === traitTitle ? classes.active : classes.inActive}`}>
      <div className={classes.action}>
        {
          !isRule 
          ? <i/>
          : activeCard === traitTitle 
          ? <img src='/assets/icon-check-active.svg' alt='' onClick={() => handleAddPreview(traitTitle, image)} /> 
          : <img src='/assets/icon-check.svg' alt=''/> 
        }
        <img onClick={handleRemove} src="/assets/icon-close.svg" alt="" />
      </div>
      <div onClick={() => handleAddPreview(traitTitle, image)} className={classes.imageContainer}>
        <img className={classes.image} src={URL.createObjectURL(image)} alt="avatar" />
      </div>
      <div className={classes.details}>
        <div>
          {prompt !== "name"
            ?
            <div className={classes.inputText}>
              <div>{traitTitle}</div>
              <img onClick={() => handlePrompt("name")} src="/assets/icon-edit-dark.svg" alt="" />
            </div>
            :
            <div className={classes.editInput}>
              <form onSubmit={e => handleRename(e, image)}>
                <input
                  autoFocus type="text"
                  name="name"
                  value={inputValue.name}
                  onChange={handleChange}
                />
              </form>
              <img onClick={e => handleRename(e, image)} src="/assets/icon-mark-dark.svg" alt="" />
            </div>
          }
        </div>

        <div>
          {prompt !== "rarity"
            ?
            <div className={classes.inputText}>
              <div>Rarity: {Rarity}</div>
              <img onClick={() => handlePrompt("rarity")} src="/assets/icon-edit-dark.svg" alt="" />
            </div>
            :
            <div className={classes.editInput}>
              <form onSubmit={handleRename}>
                <input
                  autoFocus
                  type="number"
                  min="0"
                  max="100"
                  name="rarity"
                  value={inputValue.rarity}
                  onChange={handleChange}
                />
              </form>
              <img onClick={handleRename} src="/assets/icon-mark-dark.svg" alt="" />
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default ArtCard;