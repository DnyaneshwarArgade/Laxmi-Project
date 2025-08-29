import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box, CircularProgress } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong"; 
import { countGetData } from "../../store/components/Dashboard/count";
import { useDispatch, useSelector } from "react-redux";

export default function DashboardCards() {
  const dispatch = useDispatch();
  const { login } = useSelector((state) => state?.login);
  const { count } = useSelector((state) => state?.dashboard?.count);

  const [showCards, setShowCards] = useState(false);

  const data = {
    token: login?.token,
  };

  useEffect(() => {
    dispatch(countGetData(data));
    const timer = setTimeout(() => {
      setShowCards(true);
    }, 4000); // 4 seconds

    return () => clearTimeout(timer);
  }, [dispatch, login?.token]);

  const cardData = [
    {
      title: "Total Customers",
      value: count?.data?.total_customers ?? count?.total_customers ?? 0,
      icon: <PeopleIcon fontSize="large" />,
      color: "#E3F2FD",
      iconColor: "#1976D2",
    },
    {
      title: "Total Items",
      value: count?.data?.total_items ?? count?.total_items ?? 0,
      icon: <ShoppingCartIcon fontSize="large" />,
      color: "#FFF3E0",
      iconColor: "#F57C00",
    },
    {
      title: "Total Orders",
      value: count?.data?.orders?.total ?? 0,
      icon: <ReceiptLongIcon fontSize="large" />,
      color: "#FCE4EC",
      iconColor: "#C2185B",
    },
  ];

  if (!showCards) {
    return (
      <Box
        sx={{
          height: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "#f4f6f8",
        }}
      >
        <CircularProgress size={60} thickness={5} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "1fr", md: "repeat(3, 1fr)" },
        gap: { xs: 2, sm: 3, md: 3 },
        maxWidth: "1200px",
        width: "100%",
        p: { xs: 2, sm: 3, md: 4 },
        bgcolor: "#f4f6f8",
        mx: "auto",
      }}
    >
      {cardData.map((item, index) => (
        <Card
          key={index}
          sx={{
            borderRadius: "16px",
            background: "#fff",
            boxShadow: "0 2px 10px rgba(178, 175, 175, 0.1)",
            height: "auto",
            transition: "0.3s",
            "&:hover": { transform: "translateY(-4px)", boxShadow: 4 },
          }}
        >
          <CardContent sx={{ p: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ color: "#666", fontWeight: 600, fontSize: { xs: 16, sm: 18 } }}
                >
                  {item.title}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: "bold", mt: 1, color: "#111", fontSize: { xs: 22, sm: 26 } }}
                >
                  {item.value}
                </Typography>
              </Box>

              <Box
                sx={{
                  backgroundColor: item.color,
                  borderRadius: "12px",
                  p: 1.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: item.iconColor,
                }}
              >
                {item.icon}
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
