import { useDispatch, useSelector } from 'react-redux';
import { projectsUserByRange, rangeDataSelection } from '../store/features/projectsUserReducer';

const Projects = () => {
  const dispatch = useDispatch<any>();
  const projects = useSelector((state: any) => state.projectsUser);
  console.log('project', projects);

  return (
    <>
      <button onClick={() => dispatch()}>Get projects</button>
      <button onClick={() => dispatch(rangeDataSelection({ offSet: 2, limit: 50 }))}>Range</button>
      <button onClick={() => dispatch(projectsUserByRange())}>Projets user by range</button>

      {projects.projectsUser.map((e: any) => (
        <div>{e.id}</div>
      ))}
    </>
  );
};

Projects.getInitialProps = () => {
  return {};
};

export default Projects;
