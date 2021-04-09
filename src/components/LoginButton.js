import { Button } from 'semantic-ui-react';

const MySkyButton = ({ loggedIn, handleMySkyLogin, handleMySkyLogout }) => {
  return (
    <>
      {loggedIn === true && (
        <Button onClick={handleMySkyLogout}>Log Out of MySky</Button>
      )}
      {loggedIn === false && (
        <Button onClick={handleMySkyLogin}>Login with MySky</Button>
      )}
      {loggedIn === null && <Button>Loading MySky...</Button>}
    </>
  );
};

export default MySkyButton;
