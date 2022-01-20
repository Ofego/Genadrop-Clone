import { useContext } from 'react';
import { clearRule, deleteRule } from '../../gen-state/gen.actions';
import { GenContext } from '../../gen-state/gen.context';
import classes from './rulesCard.module.css';

const RulesCard = () => {
  const { dispatch, rule } = useContext(GenContext)

  const handleClearRule = () => {
    dispatch(clearRule())
  }

  const handleDelete = rule => {
    dispatch(deleteRule(rule))
  }

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        {
          rule.map((rl, idx) => (
            <div key={idx} className={classes.conflictCard}>
              <div className={classes.content}>
                {
                  rl.map((r, idx) => (
                    <div key={idx} className={classes.innerContent}>
                      <img className={classes.image} src={URL.createObjectURL(r.imageFile)} alt='' />
                      <div className={classes.title}>{r.layerTitle}</div>
                      <div className={classes.text}>{r.imageName}</div>{rl.length - 1 !== idx && '&'}
                    </div>
                  ))
                }
              </div>
              <i onClick={() => handleDelete(rl)} className={`fas fa-times ${classes.icon}`} ></i>
            </div>
          ))
        }
      </div>
      {
        rule.length ? (
          <div className={classes.clearBtnContainer}>
            <div onClick={handleClearRule}>clear all rules</div>
          </div>
        ) : <div className={classes.notification}>you have not set any rule</div>
      }

    </div>
  )
}

export default RulesCard;