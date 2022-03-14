import React from 'react';
import NavWrapper from './Nav.wrapper';
import Nav from './Nav';
import NavDesktop from './Nav.desktop';

const Header: React.FC = () => {
  return (
    <>
      <NavWrapper>
        <Nav />
      </NavWrapper>
      <NavWrapper desktop>
        <NavDesktop />
      </NavWrapper>
    </>
  );
};

export default Header;
