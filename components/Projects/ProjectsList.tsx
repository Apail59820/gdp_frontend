import { type } from 'os';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { AffairModel } from '../../models/AffairModel';
import { ProjectModel } from '../../models/ProjectModel';
import { ProjectState, getAllProjects, addProject } from '../../store/features/projectsReducer';
export default function ProjectsList() {
  const projects = useSelector((state: ProjectState) => state.projects);
  console.log('PROJECTS', projects);
  function testExtractObjects(p: ProjectModel) {
    Object.entries(p).forEach((entry) => {
      const [key, value] = entry;
      console.log(key, value);
      console.log('clé :', key);
      console.log('value :', value);
      for (let e of Object.values(value)) {
        console.log('Manager projet', e.project_manager);
      }
    });
  }

  const dispatch = useDispatch();

  const testGetAllProjects = {
    id: 2,
    project_name: 'Projet particulier',
    project_manager: 'Didier Deschamps',
    total_affairs: 5,
  };
  return (
    <>
      <div>Projects</div>
      <button onClick={() => testExtractObjects(projects as ProjectModel)}>test</button>
      <button onClick={() => dispatch(getAllProjects())}>getAllProjects</button>
      <button onClick={() => dispatch(addProject(testGetAllProjects))}>Ajouter un projet</button>
      <div>{`${Object.values(projects)}`}</div>
    </>
  );
}
