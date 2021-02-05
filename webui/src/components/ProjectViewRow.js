import {Grid, Header, Icon, Button} from 'semantic-ui-react';
import {Link} from 'react-router-dom';

const ProjectViewRow = props => (
  <Grid columns={1}>
    <Grid.Row>
      <Grid.Column>
        <Header as='h3' icon={props.icon} content={props.title} />
      </Grid.Column>
    </Grid.Row>
    <Grid.Row columns={1}>
      <Grid.Column>
        {props.children}
      </Grid.Column>
    </Grid.Row>
  </Grid>
);

export default ProjectViewRow;
