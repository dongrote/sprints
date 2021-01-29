import { Sparklines, SparklinesLine } from 'react-sparklines';

const BurndownSparkline = props => (
  <Sparklines
    data={props.values}
    min={0}
    height={props.height}
    width={props.width}
    max={props.claimed}
  >
    <SparklinesLine color='orange'/>
  </Sparklines>
);

export default BurndownSparkline;
