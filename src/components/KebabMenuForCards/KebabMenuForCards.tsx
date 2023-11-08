import React from 'react';
import styles from './KebabMenuForCards.module.scss';
import kebabMenu from '../../../public/ellipsis-vertical.svg';
import {Dropdown, MenuProps} from "antd";

type Props = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  dropDownItems?: MenuProps
};
const KebabMenuForCards = ({ onClick, dropDownItems }: Props) => {

    return (
        <>
          {dropDownItems ? (
              <Dropdown placement={"top"} menu={dropDownItems}>
                  <button
                      className={styles.kebabMenuForCards}
                      onClick={(e) => {
                          e.preventDefault();
                          onClick(e);
                      }}
                  >
                      <img src={kebabMenu.src} alt="Kebab menu icon" />
                  </button>
              </Dropdown>
          ) : (
              <>
                  <button
                      className={styles.kebabMenuForCards}
                      onClick={(e) => {
                          e.preventDefault();
                          onClick(e);
                      }}
                  >
                      <img src={kebabMenu.src} alt="Kebab menu icon" />
                  </button>
              </>
              )}
        </>
  );
};

export default KebabMenuForCards;
