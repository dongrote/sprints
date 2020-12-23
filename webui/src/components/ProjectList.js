import { Table, Button, Header, Icon } from 'semantic-ui-react';

const ProjectList = props => (
  <Table>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell>Projects</Table.HeaderCell>
        <Table.HeaderCell textAlign='right'>Actions</Table.HeaderCell>
      </Table.Row>
    </Table.Header>
    <Table.Body>
    {props.projects.map((project, i) => (
      <Table.Row key={i}>
        <Table.Cell>
          <Header as='h3'>
            <Icon name='briefcase' />
            <Header.Content>{project}</Header.Content>
          </Header>
        </Table.Cell>
        <Table.Cell textAlign='right'>
          <Button.Group compact>
            <Button
              primary
              icon='eye'
              labelPosition='left'
              content='View'
              onClick={() => props.onProjectSelect(project)}
            />
            <Button negative icon='trash alternate' />
          </Button.Group>
        </Table.Cell>
      </Table.Row>
    ))}
    </Table.Body>
  </Table>
);

export default ProjectList;