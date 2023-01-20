import { type } from 'os';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { AffairModel } from '../../models/AffairModel';
import { AffairState, addAffair } from '../../store/features/affairsReducer';
export default function AffairList() {
  // const affairs = useSelector((state: AffairState) => console.log('affaires', state));

  const dispatch = useDispatch();

  return (
    <>
      <div>AffairList</div>
      <button onClick={() => dispatch(addAffair())}>Ajouter une affaire</button>
      {/* <div>{`${affairs}`}</div> */}
    </>
  );
}
