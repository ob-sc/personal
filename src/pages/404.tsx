import { Container, Typography } from "@mui/material";

export default function Custom404() {
  return (
    <Container
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Typography variant="h1">404</Typography>
      <Typography variant="h4" color="primary">
        Seite nicht gefunden
      </Typography>
    </Container>
  );
}
