// Import react components
import { useState, useEffect } from 'react';
import {
  Container,
  Button,
  Form,
  Header,
  Input,
  Loader,
  Dimmer,
  Divider,
  Label,
} from 'semantic-ui-react';

// Import the SkynetClient and a helper
import { SkynetClient } from 'skynet-js';
import { ContentRecordDAC } from 'content-record-library';
import MySkyButton from './components/LoginButton';
import RecordsTable from './components/RecordsTable';
// import { dataFound } from './sampleData/recordEntries';

// We'll define a portal to allow for developing on localhost.
// When hosted on a skynet portal, SkynetClient doesn't need any arguments.
const portal =
  window.location.hostname === 'localhost' ? 'https://siasky.net' : undefined;

// Initiate the SkynetClient
const client = new SkynetClient(portal);

const contentRecord = new ContentRecordDAC();
const contentRecordHNS = 'graio.hns';

const App = () => {
  const [mySky, setMySky] = useState();
  const [userID, setUserID] = useState('');
  const [eventType, setEventType] = useState('interact');
  const [contentRecordHNS, setContentRecordHNS] = useState('crqa.hns');
  const [recordsLabel, setRecordsLabel] = useState();
  const [loggedIn, setLoggedIn] = useState(null);
  const [records, setRecords] = useState();
  // const [records, setRecords] = useState(dataFound.entries);
  const [skappName, setSkappName] = useState('localhost');
  const [loading, setLoading] = useState(false);

  // const dataDomain =
  //   window.location.hostname === 'localhost' ? 'localhost' : 'skey.hns';

  const loadRecords = async (e) => {
    setLoading(true);
    const folderName = eventType === 'interact' ? 'interactions' : 'newcontent';
    const path =
      contentRecordHNS + '/' + skappName + '/' + folderName + '/page_0.json';
    const { data } = await client.file.getJSON(userID, path);

    setRecordsLabel({ userID, skappName, eventType });

    if (data && data.entries) {
      setRecords(data.entries);
    } else {
      setRecords();
    }
    setLoading(false);
  };

  useEffect(() => {
    async function initMySky() {
      try {
        // const mySky = await client.loadMySky(dataDomain);
        const mySky = await client.loadMySky();
        // await mySky.loadDacs(contentRecord);

        const loggedIn = await mySky.checkLogin();
        console.log('silent response:', loggedIn);
        setMySky(mySky);
        setLoggedIn(loggedIn);
        if (loggedIn) {
          setUserID(await mySky.userID());
        }
      } catch (e) {
        console.error(e);
      }
    }

    initMySky();

    // Specify how to clean up after this effect:
    return function cleanup() {
      async function destroyMySky() {
        if (mySky) {
          await mySky.destroy();
        }
      }

      destroyMySky();
    };
  }, []);

  const handleMySkyLogin = async () => {
    const status = await mySky.requestLoginAccess();
    console.log('requestLoginAccess', status);
    setLoggedIn(status);
    if (status) {
      setUserID(await mySky.userID());
    }
  };

  const handleMySkyLogout = async () => {
    await mySky.logout();
    setLoggedIn(false);
    setUserID('');
  };

  const buttonProps = {
    handleMySkyLogin,
    handleMySkyLogout,
    loggedIn,
  };

  return (
    <Container>
      <Header style={{ marginTop: '50px' }} as="h1">
        Content Record Entries
      </Header>
      <Dimmer.Dimmable as={Container} dimmed={loading}>
        <Dimmer active={loading}>
          <Loader />
        </Dimmer>
        <br />
        <MySkyButton {...buttonProps} />
        <br />
        <Form.Group></Form.Group>
        <Header as="h5">UserID</Header>
        <Input
          value={userID}
          onChange={(e) => {
            setUserID(e.target.value);
          }}
        />
        <Label pointing="left" basic>
          This is your public key for all discoverable files on MySky!
        </Label>
        <Header as="h5">Content Record Path</Header>
        <Input
          value={contentRecordHNS}
          onChange={(e) => {
            setContentRecordHNS(e.target.value);
          }}
        />
        <Label pointing="left" basic>
          This is the data domain used by the DAC. It will change once we leave
          beta.
        </Label>
        <Header as="h5">Skapp Name</Header>
        <Input
          label={contentRecordHNS + '/'}
          value={skappName}
          onChange={(e) => {
            setSkappName(e.target.value);
          }}
        />
        <Label pointing="left" basic>
          This is the Host Skapp URL that called Content Record DAC.
        </Label>
        <br />
        <br />
        <Form.Group>
          <Header as="h5">Event Type</Header>
          <Form.Radio
            label="Create"
            value="create"
            checked={eventType === 'create'}
            onChange={(e, { value }) => setEventType(value)}
          />
          <Form.Radio
            label="Interact"
            value="interact"
            checked={eventType === 'interact'}
            onChange={(e, { value }) => setEventType(value)}
          />
        </Form.Group>
        <br />
        <Button onClick={(e) => loadRecords(e)}>Load Records</Button>
      </Dimmer.Dimmable>
      <Divider />
      <br />
      {!!recordsLabel && (
        <RecordsTable
          eventType={recordsLabel.eventType}
          records={records}
          userID={recordsLabel.userID}
          skappName={recordsLabel.skappName}
        />
      )}
    </Container>
  );
};

export default App;
