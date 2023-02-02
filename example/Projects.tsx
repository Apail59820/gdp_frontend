import { useDispatch, useSelector } from 'react-redux';
import { getProjects, projectsUserByRange, rangeDataSelection } from '../store/features/projectsUserReducer';

const Projects = () => {
  const dispatch = useDispatch<any>();
  const projects = useSelector((state: any) => state.projectsUser);
  console.log('project', projects);

  return (
    <>
      <button onClick={() => dispatch(getProjects())}>Get projects</button>
      <button onClick={() => dispatch(rangeDataSelection({ offSet: 2, limit: 10 }))}>Range</button>
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
