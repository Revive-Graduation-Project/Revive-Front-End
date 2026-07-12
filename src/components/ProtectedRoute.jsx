import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store";
import { Box, Typography, Button, Stack, Container, Paper, useTheme } from "@mui/material";
import { Lock, ArrowLeft } from "lucide-react";

/**
 * ProtectedRoute
 *
 * Wraps any route that requires authentication.
 *
 * - Authenticated  → renders children normally
 * - NOT authenticated → shows a beautiful MUI premium access screen,
 *                       prompting the user to log in
 */
function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();
  const theme = useTheme();

  if (!isAuthenticated) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f0fdf4 0%, #fff7ed 100%)",
          px: 2,
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, md: 6 },
              borderRadius: 4,
              textAlign: "center",
              bgcolor: "rgba(255, 255, 255, 0.85)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255, 255, 255, 0.6)",
              boxShadow: "0 24px 48px rgba(0,0,0,0.06)",
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                bgcolor: "#f0fdf4",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 3,
                boxShadow: "0 8px 16px rgba(22, 163, 74, 0.12)",
              }}
            >
              <Lock color="#16a34a" size={40} />
            </Box>

            <Typography variant="h4" sx={{ fontWeight: 800, color: "text.primary", mb: 2 }}>
              Premium Access Only
            </Typography>
            
            <Typography variant="body1" sx={{ color: "text.secondary", mb: 4, fontWeight: 500, lineHeight: 1.6 }}>
              You need to be signed in to access this feature. Log in to unlock full customization, order tracking, and AI meal recommendations.
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
              <Button
                variant="contained"
                onClick={() => navigate("/auth/login")}
                sx={{
                  bgcolor: "#f97316",
                  color: "white",
                  px: 4,
                  py: 1.5,
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: "1rem",
                  textTransform: "none",
                  boxShadow: "0 4px 14px 0 rgba(249,115,22,0.39)",
                  "&:hover": {
                    bgcolor: "#ea580c",
                    boxShadow: "0 6px 20px rgba(249,115,22,0.23)",
                  },
                }}
              >
                Sign In to Continue
              </Button>
              <Button
                variant="outlined"
                startIcon={<ArrowLeft size={18} />}
                onClick={() => navigate("/")}
                sx={{
                  borderColor: "rgba(0,0,0,0.1)",
                  color: "text.secondary",
                  px: 4,
                  py: 1.5,
                  borderRadius: 8,
                  fontWeight: 600,
                  textTransform: "none",
                  borderWidth: 2,
                  "&:hover": {
                    borderColor: "rgba(0,0,0,0.2)",
                    borderWidth: 2,
                    bgcolor: "rgba(0,0,0,0.03)",
                  },
                }}
              >
                Back to Home
              </Button>
            </Stack>
          </Paper>
        </Container>
      </Box>
    );
  }

  return children;
}

export default ProtectedRoute;

