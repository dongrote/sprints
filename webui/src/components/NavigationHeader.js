import { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Icon, Image, Menu } from 'semantic-ui-react';
import RoleLabel from './RoleLabel';

class NavigationHeader extends Component {
  state = {
    unauth: false,
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
          <Link to='/groups'>
            <Icon name='users' />
            Groups
          </Link>
        </Menu.Item>
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
