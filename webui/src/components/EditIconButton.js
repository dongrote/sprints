import { Button } from 'semantic-ui-react';

const EditIconButton = props => <Button
  basic
  compact
  icon='edit'
  floated={props.floated}
  size={props.size}
  content={props.content}
  onClick={() => { if (props.onClick) props.onClick(); }}
/>;

export default EditIconButton;
