import { Label } from 'semantic-ui-react';

const roleColors = {
  admin: 'red',
  user: 'green',
  owner: 'orange',
  manager: 'purple',
  developer: 'blue',
};

const RoleLabel = props => (
  <Label size='mini' color={roleColors[props.role]}>{props.role}</Label>
);

export default RoleLabel;
