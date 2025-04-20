import React, { useEffect, useState } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom"; // if you're using React Router
import kmt from "./assets/kmt.png"; // adjust path as needed

function ScanPage() {
  const navigate = useNavigate(); // required for redirecting

  const [user, setUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [coffee, setCoffee] = useState(false);
  const [entry, setEntry] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("user_id");
    const token = localStorage.getItem("token"); // Fetch the token from localStorage

    if (!userId) {
      alert("Error! please scan the QR code again");
    }

    console.log("senidnig: ", token);
    if (userId) {
      fetch(`https://nxt-qr-scanner.onrender.com/scan/${userId}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send token as Bearer token
        },
      })
        .then((res) => {
          if (res.status === 401) {
            // Unauthenticated, redirect to login
            console.log("NAVIGATING");
            navigate(`/login?userId=${userId}`);
            return null;
          }
          return res.json();
        })
        .then((data) => {
          console.log(data); // Inspect the data structure
          setUser(data);
          setCoffee(data.coffee);
          setEntry(data.entrance); // Check if entrance is in the response
        })
        .catch(console.error);
    }
  }, []);

  const handleSubmit = () => {
    setSubmitting(true);
    const token = localStorage.getItem("token"); // Fetch the token from localStorage

    let step = "entry";
    if (entry) {
      step = "coffee";
    }
    fetch(`https://nxt-qr-scanner.onrender.com/submit/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Send token as Bearer token
      },
      body: JSON.stringify({
        id: user.usr_id,
        step: step,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to submit");
        }
        return res.json();
      })
      .then((data) => {
        navigate("/success");
      })
      .catch((err) => {
        console.error(err);
        alert("Something went wrong.");
        setSubmitting(false);
      });
  };

  const renderMessage = () => {
    console.log("CURRENT IS", user.name, coffee, entry);
    if (coffee && entry) {
      return <p>has already claimed their coffee!</p>;
    }
    if (entry) {
      return <p>Ready to claim your coffee?</p>;
    }
    return <p>Confirm entrance?</p>;
  };

  if (!user)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 4,
      }}
    >
      {/* Banner */}
      <Box sx={{ mb: 4 }}>
        <img
          src={kmt} // Replace with your logo path
          alt="Logo"
          style={{ width: "300px", height: "auto" }} // Adjust width as needed
        />
      </Box>
      <Box
        sx={{
          width: "100%",
          backgroundColor: user.vip ? "#a67c00" : "#a9a9a9",
          textAlign: "center",
          py: 4,
          borderRadius: 2,
          boxShadow: 2,
          mb: 4,
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)", // dark shadow for contrast
          fontWeight: "bold",
        }}
      >
        <Typography variant="h4" component="h1" color="white">
          {user.name}
          {user.vip ? "  (VIP)" : ""}
        </Typography>
      </Box>
      {entry == true && coffee == true ? (
        // Red Banner if coffee already claimed
        <Box
          sx={{
            width: "100%",
            backgroundColor: "#f44336",
            color: "#fff",
            textAlign: "center",
            py: 3,
            borderRadius: 2,
            boxShadow: 2,
          }}
        >
          <Typography variant="h6">
            You’ve already claimed your coffee ☕
          </Typography>
        </Box>
      ) : (
        <>
          {/* Question and Image */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              {renderMessage()}
            </Typography>
            {entry == true && (
              <img
                src="https://png.pngtree.com/png-clipart/20210309/original/pngtree-coffee-logo-png-image_5898135.jpg"
                alt="coffee"
                style={{ width: 90, height: 90, marginLeft: 12 }}
              />
            )}
          </Box>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={submitting || user.name == null}
            variant="contained"
            color="success"
            sx={{
              padding: "10px 20px",
              textTransform: "none",
              boxShadow: 2,
            }}
          >
            {submitting ? "Submitting..." : "Confirm"}
          </Button>
        </>
      )}
    </Box>
  );
}

export default ScanPage;
