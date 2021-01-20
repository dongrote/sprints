import { Table } from 'semantic-ui-react';
import UserStory from './UserStory';

const UserStoryColumn = props => {
  const sum = props.userStories.reduce((acc, cur) => acc + cur.points, 0);
  return (
  <Table color={props.color}>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell>{`${props.header} (${sum} point${sum === 1 ? '' : 's'})`}</Table.HeaderCell>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {props.userStories.map((story, i) => (
        <Table.Row key={i}>
          <Table.Cell>
            <UserStory
              fluid
              UserStoryId={story.id}
              onClaim={props.onClaim}
              onRemit={props.onRemit}
              onComplete={props.onComplete}
              title={story.title}
              points={story.points}
              completedAt={story.completedAt}
              description={story.description}
            />
          </Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  </Table>
);
      };

export default UserStoryColumn;
