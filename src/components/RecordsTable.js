import React from 'react';
import { Table, Header } from 'semantic-ui-react';

const EntryRows = ({ entries, eventType }) => {
  if (entries) {
    return entries.map((entry) => {
      return createTableRow(entry, eventType);
    });
  }
  return null;
};

const createTableRow = ({ skylink, metadata, timestamp }, eventType) => {
  const ts = new Date(timestamp * 1000);
  return (
    <Table.Row key={timestamp}>
      <Table.Cell>
        <a href={skylink} target="_blank" rel="noreferrer">
          {skylink}
        </a>
      </Table.Cell>
      {eventType === 'interact' && <Table.Cell>{metadata.action}</Table.Cell>}
      <Table.Cell>
        {ts.toDateString()} {ts.toTimeString()}
      </Table.Cell>
    </Table.Row>
  );
};

const RecordsTable = ({ userID, skappName, records, eventType }) => (
  <>
    <Header as="h2">Skapp: {skappName}</Header>
    <Header as="h3">UserID: {userID}</Header>

    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Skylink</Table.HeaderCell>
          {eventType === 'interact' && (
            <Table.HeaderCell>Action</Table.HeaderCell>
          )}
          <Table.HeaderCell>Timestamp</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        <EntryRows entries={records} eventType={eventType} />
      </Table.Body>

      {/* <Table.Footer>
        <Table.Row>
          <Table.HeaderCell colSpan="3">
            <Menu floated="right" pagination>
              <Menu.Item as="a" icon>
                <Icon name="chevron left" />
              </Menu.Item>
              <Menu.Item as="a">1</Menu.Item>
              <Menu.Item as="a">2</Menu.Item>
              <Menu.Item as="a">3</Menu.Item>
              <Menu.Item as="a">4</Menu.Item>
              <Menu.Item as="a" icon>
                <Icon name="chevron right" />
              </Menu.Item>
            </Menu>
          </Table.HeaderCell>
        </Table.Row>
      </Table.Footer> */}
    </Table>
  </>
);

export default RecordsTable;
