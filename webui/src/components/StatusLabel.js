import { Label } from 'semantic-ui-react';

const colorMap = {
  READY: 'green',
  ALLOC: 'orange',
  DONE: 'blue',
};

const contentMap = {
  READY: 'Ready',
  ALLOC: 'Allocated',
  DONE: 'Done',
};

const StatusLabel = props => <Label color={colorMap[props.status]} content={contentMap[props.status]} />;

export default StatusLabel;