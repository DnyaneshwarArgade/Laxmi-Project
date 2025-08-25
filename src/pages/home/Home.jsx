import React, { useEffect } from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { countGetData } from "../../store/components/Dashboard/count";
import { useDispatch, useSelector } from "react-redux";

export default function DashboardCards() {
  const dispatch = useDispatch();
  const { login } = useSelector((state) => state?.login);
  const { count, isLoading } = useSelector((state) => state?.dashboard?.count);

  // Token object
  const data = {
    token: login?.token,
  };

  useEffect(() => {
    dispatch(countGetData(data));
  }, [dispatch, login?.token]);

  // Card Config
  const cardData = [
    {
      title: "Total Orders",
      value: count?.total_orders || 0,
      icon: <ShoppingCartIcon fontSize="large" />,
      color: "#e3f2fd",
      iconColor: "#1976d2",
    },
    {
      title: "Completed Orders",
      value: count?.completed_orders || 0,
      icon: <CheckCircleIcon fontSize="large" />,
      color: "#e8f5e9",
      iconColor: "#2e7d32",
    },
    {
      title: "Total Customers",
      value: count?.total_customers || 0,
      icon: <PeopleIcon fontSize="large" />,
      color: "#fff3e0",
      iconColor: "#ef6c00",
    },
    {
      title: "Total Items",
      value: count?.total_items || 0,
      icon: <AccessTimeIcon fontSize="large" />,
      color: "#f3e5f5",
      iconColor: "#6a1b9a",
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "#f4f6f8",
        p: 4,
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 3,
          maxWidth: "900px",
          width: "100%",
        }}
      >
        {cardData.map((item, index) => (
          <Card
            key={index}
            sx={{
              borderRadius: "16px",
              background: "#fff",
              boxShadow: "0 2px 10px rgba(178, 175, 175, 0.1)",
              height: 180,
              width: "100%",
            }}
          >
            <CardContent sx={{ height: "100%" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                {/* Text */}
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{ color: "#666", fontWeight: 600, fontSize: 18 }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: "bold", mt: 1, color: "#111" }}
                  >
                    {isLoading ? "..." : item.value}
                  </Typography>
                </Box>

                {/* Icon */}
                <Box
                  sx={{
                    backgroundColor: item.color,
                    borderRadius: "12px",
                    p: 2,
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
    </Box>
  );
}
