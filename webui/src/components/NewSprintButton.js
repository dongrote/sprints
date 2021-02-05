import { Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const NewSprintButton = props => (
  <Link to={`/project/${props.ProjectId}/sprints`}>
    <Button color='blue' icon='plus' labelPosition='left' content={props.content || 'New Sprint'} />
  </Link>
);

export default NewSprintButton;
