export type FiltreGlobaux = {
  projects: {
    list: number[];
    filter: any; // { status: { _eq : "archived" } }
  };
  affairs: {
    list: number[];
    filter: any;
  };
  pythagore_affaires: {
    list: string[];
    filter: any;
  };
  files: {
    list: string[];
    filter: any;
  };
  satisfaction: {
    list: number[];
    filter: any;
  };
  clients: {
    list: string[];
    filter: any;
  };
  collaborators: {
    list: string[];
    filter: any;
  };
};

{
  _and: [
    {
      id: {
        _in: [2, 3, 4],
      },
    },
    {
      //filter
    },
  ];
}
