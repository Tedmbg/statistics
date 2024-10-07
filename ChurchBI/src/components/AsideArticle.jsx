import { Avatar, Box, Button, Paper, Typography } from "@mui/material";
import Divider from '@mui/material/Divider';

export default function AsideArticle() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        '& > :not(style)': {
          m: 1,
          maxWidth: 250,
          paddingBottom: 4,
        },
      }}
    >
      <Paper 
        variant="outlined"
        square={false}
        sx={{ padding: "1rem",
           textAlign: "center",
           borderRadius:".7rem"
          }}
        >
        <Typography variant="h6" padding="1rem">
          Fellowship Ministries
        </Typography>
        
        <Divider sx={{ marginY: 1 }} />

        {/* Lower part of the button */}

        <Button 
           sx={{ width: "100%", marginTop: "1em" }}>
          <Box 
            sx={{ display: "flex", alignItems: "center", gap: "1rem" }}
            >
            <Avatar 
              alt="Shem Mustafa" 
              src="/static/images/avatar/1.jpg" 
              sx={{ width: 45, height: 45 }} 
              />

            <Box>
              <Typography 
                variant="subtitle2" 
                sx={{ textTransform: "capitalize", 
                textAlign: "left" }}
                >
                Counselling
              </Typography>
              <Box 
                sx={{ display: "flex", 
                alignItems: "center", 
                gap: "1em" }}
                >

                <Typography 
                  variant="subtitle1" 
                  sx={{ textTransform: "capitalize", 
                  textAlign: "left" }}
                  >
                  Shem Mustafa
                </Typography>
                <Typography 
                  variant="subtitle1" 
                  sx={{ textAlign: "left" }}
                  >
                  mb.42
                </Typography>
              </Box>
            </Box>
          </Box>
        </Button>
        <Button 
           sx={{ width: "100%", marginTop: "1em" }}>
          <Box 
            sx={{ display: "flex", alignItems: "center", gap: "1rem" }}
            >
            <Avatar 
              alt="Shem Mustafa" 
              src="/static/images/avatar/1.jpg" 
              sx={{ width: 45, height: 45 }} 
              />

            <Box>
              <Typography 
                variant="subtitle2" 
                sx={{ textTransform: "capitalize", 
                textAlign: "left" }}
                >
                Counselling
              </Typography>
              <Box 
                sx={{ display: "flex", 
                alignItems: "center", 
                gap: "1em" }}
                >

                <Typography 
                  variant="subtitle1" 
                  sx={{ textTransform: "capitalize", 
                  textAlign: "left" }}
                  >
                  Shem Mustafa
                </Typography>
                <Typography 
                  variant="subtitle1" 
                  sx={{ textAlign: "left" }}
                  >
                  mb.42
                </Typography>
              </Box>
            </Box>
          </Box>
        </Button>
        <Button 
           sx={{ width: "100%", marginTop: "1em" }}>
          <Box 
            sx={{ display: "flex", alignItems: "center", gap: "1rem" }}
            >
            <Avatar 
              alt="Shem Mustafa" 
              src="/static/images/avatar/1.jpg" 
              sx={{ width: 45, height: 45 }} 
              />

            <Box>
              <Typography 
                variant="subtitle2" 
                sx={{ textTransform: "capitalize", 
                textAlign: "left" }}
                >
                Counselling
              </Typography>
              <Box 
                sx={{ display: "flex", 
                alignItems: "center", 
                gap: "1em" }}
                >

                <Typography 
                  variant="subtitle1" 
                  sx={{ textTransform: "capitalize", 
                  textAlign: "left" }}
                  >
                  Shem Mustafa
                </Typography>
                <Typography 
                  variant="subtitle1" 
                  sx={{ textAlign: "left" }}
                  >
                  mb.42
                </Typography>
              </Box>
            </Box>
          </Box>
        </Button>
      </Paper>
    </Box>
  );
}
