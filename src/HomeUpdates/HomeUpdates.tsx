import React from 'react';
import styles from './HomeUpdates.module.scss';

type Update = {
  title: string;
  content: React.ReactNode;
};

// TODO
const UPDATES: Update[] = [
  {
    title: '12/12/2022 - Mise à jour de la plateforme',
    content: (
      <>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam lobortis feugiat odio, id placerat augue
          luctus in. Donec aliquet rutrum velit, eu mattis sem tristique quis. Aenean at consequat metus.
        </p>
        <p>
          Donec nec ullamcorper nisi, faucibus sollicitudin risus. Maecenas porttitor, dui sit amet semper sodales,
          lectus odio cursus arcu, ut finibus turpis ipsum sit amet leo. Class aptent taciti sociosqu ad litora torquent
          per conubia nostra, per inceptos himenaeos. Nunc vitae nisl non augue suscipit dignissim eget pretium orci.
        </p>
      </>
    ),
  },
  {
    title: '12/12/2022 - Mise à jour de la plateforme',
    content: (
      <>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam lobortis feugiat odio, id placerat augue
          luctus in. Donec aliquet rutrum velit, eu mattis sem tristique quis. Aenean at consequat metus.
        </p>
        <p>
          Donec nec ullamcorper nisi, faucibus sollicitudin risus. Maecenas porttitor, dui sit amet semper sodales,
          lectus odio cursus arcu, ut finibus turpis ipsum sit amet leo. Class aptent taciti sociosqu ad litora torquent
          per conubia nostra, per inceptos himenaeos. Nunc vitae nisl non augue suscipit dignissim eget pretium orci.
        </p>
      </>
    ),
  },
  {
    title: '12/12/2022 - Mise à jour de la plateforme',
    content: (
      <>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam lobortis feugiat odio, id placerat augue
          luctus in. Donec aliquet rutrum velit, eu mattis sem tristique quis. Aenean at consequat metus.
        </p>
        <p>
          Donec nec ullamcorper nisi, faucibus sollicitudin risus. Maecenas porttitor, dui sit amet semper sodales,
          lectus odio cursus arcu, ut finibus turpis ipsum sit amet leo. Class aptent taciti sociosqu ad litora torquent
          per conubia nostra, per inceptos himenaeos. Nunc vitae nisl non augue suscipit dignissim eget pretium orci.
        </p>
      </>
    ),
  },
  {
    title: '12/12/2022 - Mise à jour de la plateforme',
    content: (
      <>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam lobortis feugiat odio, id placerat augue
          luctus in. Donec aliquet rutrum velit, eu mattis sem tristique quis. Aenean at consequat metus.
        </p>
        <p>
          Donec nec ullamcorper nisi, faucibus sollicitudin risus. Maecenas porttitor, dui sit amet semper sodales,
          lectus odio cursus arcu, ut finibus turpis ipsum sit amet leo. Class aptent taciti sociosqu ad litora torquent
          per conubia nostra, per inceptos himenaeos. Nunc vitae nisl non augue suscipit dignissim eget pretium orci.
        </p>
      </>
    ),
  },
];

const HomeUpdates = () => {
  return (
    <div className={styles.homeUpdates}>
      {UPDATES.map((update) => (
        <section key={update.title} className={styles.update}>
          <h3 className={styles.title}>{update.title}</h3>
          {update.content}
        </section>
      ))}
    </div>
  );
};

export default HomeUpdates;
