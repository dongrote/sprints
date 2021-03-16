import { Button, Container, Grid, Card } from 'semantic-ui-react';

const SignInView = () => (
  <Container text>
    <Grid columns={1}>
      <Grid.Row>
        <Grid.Column>
          <Card centered>
            <Card.Content centered>
              We only support Google Sign In.<br/><tt>:badpokerface:</tt>
            </Card.Content>
            <Card.Content extra>
              <a href='/api/auth/google'>
                <Button
                  fluid
                  basic
                  icon='google'
                  labelPosition='left'
                  content='Sign In with Google'
                />
              </a>
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </Container>
);

export default SignInView;
