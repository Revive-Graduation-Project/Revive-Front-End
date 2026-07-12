import React from "react";
import { Link } from "react-router-dom";
import { Box, Container, Typography, Button, Stack, useTheme } from "@mui/material";
import { Lock } from "lucide-react";
import RegularFoodCard from "../../../components/ui/RegularFoodCard";

const PLACEHOLDER_MEALS = [
  {
    id: 1,
    name: "Mystery Meal",
    price: 12.99,
    hasDiscount: false,
    discountPercentage: 0,
    nutrients: [],
    imageUrl: null,
  },
  {
    id: 2,
    name: "Mystery Meal",
    price: 9.99,
    hasDiscount: false,
    discountPercentage: 0,
    nutrients: [],
    imageUrl: null,
  },
  {
    id: 3,
    name: "Mystery Meal",
    price: 15.99,
    hasDiscount: false,
    discountPercentage: 0,
    nutrients: [],
    imageUrl: null,
  },
  {
    id: 4,
    name: "Mystery Meal",
    price: 11.99,
    hasDiscount: false,
    discountPercentage: 0,
    nutrients: [],
    imageUrl: null,
  },
];

const SuggestedMealsTeaser = () => {
  const theme = useTheme();

  return (
    <Box component="section" sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 } }}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', color: 'text.primary', fontSize: { xs: '1.5rem', md: '2rem' } }}>
            Suggested For You
          </Typography>
          <Typography variant="h4" component="span">✨</Typography>
        </Stack>

        <Box sx={{ position: 'relative', borderRadius: 4, overflow: 'hidden' }}>
          {/* Cards with light blur */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', xl: 'repeat(4, 1fr)' },
              gap: { xs: 1, md: 4 },
              filter: 'blur(3px)',
              pointerEvents: 'none',
              userSelect: 'none',
              opacity: 0.6,
              transform: 'scale(0.98)',
              transition: 'transform 0.3s ease',
            }}
          >
            {PLACEHOLDER_MEALS.map((meal) => (
              <Box key={meal.id} aria-hidden="true" width="100%">
                <RegularFoodCard meal={meal} />
              </Box>
            ))}
          </Box>

          {/* Overlay */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(255, 255, 255, 0.45)',
              backdropFilter: 'blur(8px)',
              borderRadius: 4,
              p: 3,
              textAlign: 'center',
            }}
          >
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                bgcolor: 'background.paper',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2.5,
                boxShadow: '0px 8px 24px rgba(0,0,0,0.08)',
              }}
            >
              <Lock color="#16A34A" size={36} />
            </Box>

            <Typography variant="h4" component="h3" sx={{ fontWeight: 800, color: 'text.primary', mb: 1.5, fontSize: { xs: '1.25rem', md: '1.75rem' } }}>
              Meals tailored just for you!
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, maxWidth: 450, fontWeight: 500 }}>
              Sign in to unlock AI-powered meal recommendations precisely matched to your personal health goals.
            </Typography>

            <Stack direction="row" spacing={2}>
              <Button
                component={Link}
                to="/auth/login"
                variant="contained"
                sx={{
                  bgcolor: '#f97316',
                  color: 'white',
                  borderRadius: 8,
                  px: 4,
                  py: 1.2,
                  fontWeight: 700,
                  textTransform: 'none',
                  fontSize: '1rem',
                  boxShadow: '0 4px 14px 0 rgba(249,115,22,0.39)',
                  '&:hover': {
                    bgcolor: '#ea580c',
                    boxShadow: '0 6px 20px rgba(249,115,22,0.23)',
                  },
                }}
              >
                Sign In
              </Button>
              <Button
                component={Link}
                to="/auth/signup"
                variant="outlined"
                sx={{
                  borderColor: '#f97316',
                  color: '#f97316',
                  borderRadius: 8,
                  px: 4,
                  py: 1.2,
                  fontWeight: 700,
                  textTransform: 'none',
                  fontSize: '1rem',
                  borderWidth: 2,
                  '&:hover': {
                    borderColor: '#ea580c',
                    borderWidth: 2,
                    bgcolor: 'rgba(249, 115, 22, 0.04)',
                  },
                }}
              >
                Create Account
              </Button>
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default SuggestedMealsTeaser;
