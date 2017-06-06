import {Link} from 'react-router-dom';
import React from 'react';
import glamorous from 'glamorous';
import R from 'ramda';
const NavBar = props => {
  const {Nav} = glamorous;
  const {navItems} = props;
  const StyledLink = glamorous(Link)({
    display: 'inline-block',
    textAlign: 'center',
    padding: 10,
  });
  const length = R.length(navItems);
  const navLinks = R.addIndex(R.map)((item, index) => {
    if (index === length - 1) {
      return <StyledLink key={index} to={`/${item}`}>{item.toUpperCase()}</StyledLink>;
    } else {
      return [
        <StyledLink to={`/${item}`} key={index}>{item.toUpperCase()}</StyledLink>,
        '|',
      ];
    }
  });
  return (
    <Nav paddingLeft="41%">
      {navLinks(navItems)}
    </Nav>
  );
};

export default NavBar;
