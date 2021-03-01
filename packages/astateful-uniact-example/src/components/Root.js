import React from 'react';
import PropTypes from 'prop-types';
import { renderRoutes } from 'react-router-config';
import Helmet from 'react-helmet';
import {
  Container,
  Row,
  Col,
  Collapse,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';
import { NavLink as RouterNavLink } from 'react-router-dom';

import '../styles/bootstrap.scss';

import head from '../head';

import Footer from './Footer';
import Navbar from './Navbar';
import Body from './Body';

export default class Root extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
    };
  }

  static propTypes = {
    route: PropTypes.object.isRequired,
    thunk: PropTypes.object.isRequired,
  };

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  render() {
    return (
      <div>
        <Helmet
          title={head.title}
          meta={head.meta}
          htmlAttributes={head.html}
        />
        <Container>
          <Row>
            <Col>
              <Navbar>
                <NavbarBrand tag={RouterNavLink} to="/">
                  astateful-uniact-example
                </NavbarBrand>
                <NavbarToggler onClick={this.toggle} />
                <Collapse isOpen={this.state.isOpen} navbar>
                  <Nav className="ml-auto" navbar>
                    <NavItem>
                      <NavLink tag={RouterNavLink} to="/">
                        Home
                      </NavLink>
                    </NavItem>
                  </Nav>
                </Collapse>
              </Navbar>
            </Col>
          </Row>
          <Body>
            {renderRoutes(this.props.route.routes, { thunk: this.props.thunk })}
          </Body>
          <Footer>
            <p>&copy; astateful-uniact-example {new Date().getFullYear()}</p>
          </Footer>
        </Container>
      </div>
    );
  }
}
