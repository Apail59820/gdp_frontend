import React, {useEffect, useState} from 'react';
import styles from './KebabMenuForCards.module.scss';
import kebabMenu from '../../../public/ellipsis-vertical.svg';
import {Dropdown, MenuProps} from "antd";
import {Simulate} from "react-dom/test-utils";
import drop = Simulate.drop;

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
