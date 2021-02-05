import { Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const ClaimStoryButton = props => (
  <Link to={`/sprint/${props.SprintId}/claim`}>
    <Button color='orange' icon='plus' labelPosition='left' content={props.content || 'Claim Story'} />
  </Link>
);

export default ClaimStoryButton;
