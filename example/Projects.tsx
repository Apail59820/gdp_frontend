import { useDispatch, useSelector } from "react-redux";
import { setGlobalFilters } from "../store/features/globalFilterReducer";
import { StoreStatesType } from "../store/store";
import { setAffairState } from "../store/features/affairsReducer";
import { useEffect, useState } from "react";

const Projects = () => {
  const [text, setText] = useState("aaa");
  const dispatch = useDispatch<any>();
  const affairsList = useSelector((state: StoreStatesType) => state.affairs);
  const globalFilters = useSelector((state: StoreStatesType) => state.globalFilters);
  const globalFilterNew = {
    projects: {
      list: [],
      filter: { limit: "10" }
    },
    affairs: {
      list: [],
      filter: {}
    },
    pythagore_affaires: {
      list: [],
      filter: {}
    },
    files: {
      list: [],
      filter: {}
    },
    satisfaction: {
      list: [],
      filter: {}
    },
    clients: {
      list: [],
      filter: {}
    },
    collaborators: {
      list: [],
      filter: {}
    }
  };

  useEffect(() => {
    console.log("affairsList ", affairsList.data);
  }, [affairsList]);

  function updateAffair() {
    dispatch(setAffairState({ data: [{ name: text }], loading: true }));
    setText(text + "z");
  }

  return (
    <>
      <button onClick={() => dispatch(setGlobalFilters(globalFilterNew))}>setGlobalFilters</button>
      <button onClick={updateAffair}>Get Affairs
      </button>
      {/*<button onClick={getFromSelector}>Get Affairs From Selector</button>*/}
      {/*<button onClick={() => dispatch(projectsUserByRange())}>Projets user by range</button>*/}

      {/*{projects.projectsUser.map((e: any) => (*/}
      {/*  <div>{e.id}</div>*/}
      {/*))}*/}
    </>
  );
};

Projects.getInitialProps = () => {
  return {};
};

export default Projects;
