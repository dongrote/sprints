import {Grid, Header, Button} from 'semantic-ui-react';

const ProjectViewRow = props => (
  <Grid>
    <Grid.Row columns={2}>
      <Grid.Column>
        <Header as='h3' icon={props.icon} content={props.title} />
      </Grid.Column>
      <Grid.Column textAlign='right'>
        <Button color={props.buttonColor} icon={props.buttonIcon} content={props.buttonContent} />
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