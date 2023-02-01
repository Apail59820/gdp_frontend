import { useDispatch, useSelector } from 'react-redux';
import { rangeDataSelection, twoLastUserProject } from '../store/features/projectsUserReducer';

const Projects = () => {
  const dispatch = useDispatch<any>();
  const projects = useSelector((state: any) => state.projectsUser);
  console.log('project', projects);

  return (
    <>
      <button onClick={() => dispatch(rangeDataSelection({ offSet: 2, limit: 5 }))}>Range</button>
      <button onClick={() => dispatch(twoLastUserProject())}>last</button>
    </>
  );
};

Projects.getInitialProps = () => {
  return {};
};

export default Projects;
