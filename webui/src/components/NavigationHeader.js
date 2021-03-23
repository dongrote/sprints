import { Component } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import { Icon, Menu } from 'semantic-ui-react';
import RoleLabel from './RoleLabel';

class NavigationHeader extends Component {
  state = {
    unauth: false,
    redirectTo: null,
    displayName: null,
    avatarUrl: null,
    systemRole: null,
  };
  async fetchUserProfile() {
    const res = await fetch('/api/users/me');
    if (res.ok) {
      const json = await res.json();
      this.setState({
        avatarUrl: json.avatarUrl,
        displayName: json.displayName,
        systemRole: json.systemRole,
      });
    }
    if (res.status === 401) this.setState({unauth: true});
  }
  async componentDidMount() {
    await this.fetchUserProfile();
  }
  render() {
    if (this.state.unauth) return <Redirect to='/' />;
    return (
      <Menu>
        <Menu.Item>
          <NavLink to='/groups' style={{color: 'black'}}>
            <Icon name='users' />
            Groups
          </NavLink>
        </Menu.Item>
        {this.state.systemRole === 'admin' && (
          <Menu.Item>
            <NavLink to='/users' style={{color: 'red'}}>
              <Icon name='setting' />
              Users
            </NavLink>
          </Menu.Item>
        )}
        <Menu.Menu position='right'>
          <Menu.Item>
            {this.state.displayName}
            {this.state.systemRole && <RoleLabel role={this.state.systemRole} />}
          </Menu.Item>
          <Menu.Item>
            <a href='/api/auth/logout'>
              <Icon color='black' name='sign out' />
            </a>
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }
}

export default NavigationHeader;
