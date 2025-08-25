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

  console.log("count", count);

  const data = {
    token: login?.token,
  };

  useEffect(() => {
    dispatch(countGetData(data));
  }, [dispatch, login?.token]);

  // Safely extract values from API
  const totalCustomers = count?.data?.today?.total_customers || 0;
  const totalItems = count?.data?.today?.total_items || 0;
  const completedOrders = count?.data?.orders?.complete || 0;
  const pendingOrders = count?.data?.orders?.pending || 0;

  // UI Cards
  const cardData = [
    {
      title: "Total Customers",
      value: totalCustomers,
      icon: <PeopleIcon fontSize="large" />,
      color: "#E3F2FD",
      iconColor: "#1976D2",
    },
    {
      title: "Total Items",
      value: totalItems,
      icon: <ShoppingCartIcon fontSize="large" />,
      color: "#FFF3E0",
      iconColor: "#F57C00",
    },
    {
      title: "Completed Orders",
      value: completedOrders,
      icon: <CheckCircleIcon fontSize="large" />,
      color: "#E8F5E9",
      iconColor: "#388E3C",
    },
    {
      title: "Pending Orders",
      value: pendingOrders,
      icon: <AccessTimeIcon fontSize="large" />,
      color: "#FCE4EC",
      iconColor: "#C2185B",
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
