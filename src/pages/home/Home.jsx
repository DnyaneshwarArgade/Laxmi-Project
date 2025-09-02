import React, { useEffect } from "react";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { countGetData } from "../../store/components/Dashboard/count";
import { useDispatch, useSelector } from "react-redux";

export default function DashboardCards() {
  const dispatch = useDispatch();
  const { login } = useSelector((state) => state?.login);
  const { count, isLoading } = useSelector((state) => state?.dashboard?.count);

  const data = {
    token: login?.token,
  };

  useEffect(() => {
    dispatch(countGetData(data));
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

  if (isLoading) {
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
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        gap: { xs: 2, sm: 3, md: 4 },
        maxWidth: "1200px",
        width: "100%",
        p: { xs: 2, sm: 3, md: 4 },
        bgcolor: "linear-gradient(135deg, #f9fbff 0%, #eef3f9 100%)", // ✅ Light background
        mx: "auto",
        minHeight: "70vh",
      }}
    >
      {cardData.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          whileHover={{ scale: 1.04 }}
          transition={{ duration: 0.7, delay: index * 0.2 }}
          style={{ width: "100%", maxWidth: 350 }}
        >
          <Card
            elevation={0}   // ✅ Shadow काढण्यासाठी
            sx={{
              borderRadius: "20px",
              background: "#fff",
              border: "1px solid #f0f0f0",
              height: "auto",
              transition: "0.3s",
              position: "relative",
              overflow: "hidden",
              boxShadow: "none",  // ✅ अजून खात्रीसाठी
              "&:hover": {
                // हवे असल्यास hover ला काही style देऊ शकतो
              },
            }}
          >

            <CardContent sx={{ p: 3 }}>
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
                    sx={{
                      color: "#444",
                      fontWeight: 700,
                      fontSize: { xs: 18, sm: 20 },
                      letterSpacing: 1,
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: "bold",
                      mt: 1,
                      color: "#222",
                      fontSize: { xs: 32, sm: 38 },
                    }}
                  >
                    <CountUp end={item.value} duration={1.5} separator="," />
                  </Typography>
                </Box>

                <Box
                  sx={{
                    background: `linear-gradient(135deg, ${item.color} 60%, #fff 100%)`,
                    borderRadius: "16px",
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: item.iconColor,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                  }}
                >
                  {item.icon}
                </Box>
              </Box>
            </CardContent>
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                height: "6px",
                //background: `linear-gradient(90deg, ${item.iconColor} 0%, transparent 100%)`,
                opacity: 0.2,
              }}
            />
          </Card>
        </motion.div>
      ))}
    </Box>
  );
}
