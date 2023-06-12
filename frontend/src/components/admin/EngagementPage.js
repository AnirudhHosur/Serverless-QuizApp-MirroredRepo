import { Box, Button, Typography } from "@mui/material";
import { AuthContext } from "../../services/AuthContext";
import React, {useContext, useEffect} from "react";

const EngagementPage = () => {
  const { currentUser } = useContext(AuthContext);
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
  }, [currentUser, isAuthenticated]);

  return isAuthenticated ? (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      EngagementPage
    </Box>) : (
    // JSX to display a message if the user is not logged in
    <div>Please login to access this page.</div>
  );
};

export default EngagementPage;
