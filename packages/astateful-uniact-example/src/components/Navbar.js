import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Navbar as BootstrapNavbar } from 'reactstrap';

const Navbar = ({ className, children }) => (
  <BootstrapNavbar color="faded" light expand="md" className={className}>
    {children}
  </BootstrapNavbar>
);

Navbar.propTypes = {
  className: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default styled(Navbar)`
  padding-right: 0;
  padding-left: 0;
  border-bottom: 1px solid #e5e5e5;
`;
