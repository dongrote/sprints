import { Icon } from 'semantic-ui-react';
const providerIcons = {google: 'google'};
const IdentityProviderIcon = props => <Icon name={providerIcons[props.provider]} />;
export default IdentityProviderIcon;
