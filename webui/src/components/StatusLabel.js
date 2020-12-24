import { Label } from 'semantic-ui-react';

const colorMap = {
  READY: 'green',
  CLAIM: 'orange',
  DONE: 'blue',
};

const contentMap = {
  READY: 'Ready',
  CLAIM: 'Claimed',
  DONE: 'Done',
};

const StatusLabel = props => <Label color={colorMap[props.status]} content={contentMap[props.status]} />;

export default StatusLabel;