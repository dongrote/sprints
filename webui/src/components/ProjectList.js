import { List, Button } from 'semantic-ui-react';

const ProjectList = props => (
  <List>
    {props.projects.map((project, i) => (
      <List.Item key={i}>
        {project}
        <Button primary content='View' onClick={() => props.onProjectSelect(project)} />
      </List.Item>
    ))}
  </List>
);

export default ProjectList;