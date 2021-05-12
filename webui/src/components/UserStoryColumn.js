import { Table } from 'semantic-ui-react';
import UserStory from './UserStory';

const storyCountString = stories => {
  const count = stories.length;
  return count === 1 ? `1 story` : `${count} stories`;
};

const storyPointSumString = stories => {
  const sum = stories.reduce((acc, cur) => acc + cur.points, 0);
  return `${sum} point${sum === 1 ? '' : 's'}`;
};

const UserStoryColumn = props => (
  <Table color={props.color}>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell>{`${props.header} (${storyCountString(props.userStories)} | ${storyPointSumString(props.userStories)})`}</Table.HeaderCell>
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

export default UserStoryColumn;
