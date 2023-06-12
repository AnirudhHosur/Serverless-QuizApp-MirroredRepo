import React, { useContext, useEffect } from "react";
import { Box } from "@mui/material";
import { AuthContext } from "../../services/AuthContext";

const LeaderBoard = () => {
  const { currentUser } = useContext(AuthContext);
  const { isAuthenticated } = useContext(AuthContext);
  const iframe =
    '<iframe width="1000" height="600" src="https://lookerstudio.google.com/embed/reporting/bed1c4aa-1b31-4d63-aef7-06e3c00598c1/page/LogXD" frameborder="0" style="border:0" allowfullscreen></iframe>';

  function Iframe(props) {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: props.iframe ? props.iframe : "" }}
      />
    );
  }

  useEffect(() => {
  }, [currentUser, isAuthenticated]);

  return isAuthenticated ? (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Iframe iframe={iframe} />,
    </Box> ) : (
    // JSX to display a message if the user is not logged in
    <div>Please login to access this page.</div>
  );
};

export default LeaderBoard;
