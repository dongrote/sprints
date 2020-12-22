import { Label } from 'semantic-ui-react';

const colorMap = {
  TODO: 'yellow',
  REVW: 'orange',
  PROG: 'blue',
  DONE: 'green',
  TEST: 'red',
};

const contentMap = {
  TODO: 'To Do',
  REVW: 'Under Review',
  PROG: 'In Progress',
  DONE: 'Complete',
  TEST: 'Testing',
};

const StatusLabel = props => <Label color={colorMap[props.status]} content={contentMap[props.status]} />;

export default StatusLabel;