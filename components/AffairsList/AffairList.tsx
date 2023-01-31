import { useDispatch, useSelector } from 'react-redux';
import { affairs, AffairState } from '../../store/features/affairsReducer';
import { login } from '../../services/auth';
import { AffairModel } from '../../models/AffairModel';
import { useEffect } from 'react';
import { userProfile, UserState } from '../../store/features/userProfileReducer';

const AffairList = () => {
  const dispatch = useDispatch<any>();
  const user = { email: 'guillaumedesairs@gmail.com', password: '1234' };
  async function connection() {
    await login(user.email, user.password).then((status) => {
      console.log('status login', status);
      return status;
    });
  }
  connection();

  const affair = useSelector((state: any) => state.affairs);
  useEffect(() => {
    dispatch(affairs());
    dispatch(userProfile());
  }, []);
  const userProfil = useSelector((state: UserState) => state.userProfile);
  console.log('userProfile', userProfil);

  return (
    <>
      <h1>Affaires</h1>
      {/* <button onClick={() => dispatch(affairs())}>Afficher les affaires</button> */}
      {affair.loading && <div>Chargement...</div>}
      {!affair.loading && affair.error ? <div>Error: {affair.error}</div> : null}
      {!affair.loading && affair.affairs.length ? (
        <ul>
          {affair.affairs.map((affair: AffairModel) => (
            <li key={affair.id}>{affair.name}</li>
          ))}
        </ul>
      ) : null}
    </>
  );
};

AffairList.getInitialProps = () => {
  return {};
};

export default AffairList;
