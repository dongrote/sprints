import { Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const NewStoryButton = props => (
  <Link to={`/project/${props.ProjectId}/stories`}>
    <Button color='green' icon='plus' labelPosition='left' content={props.content || 'New Story'} />
  </Link>
);

export default NewStoryButton;
