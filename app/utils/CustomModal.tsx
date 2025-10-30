"use client";
import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  children: React.ReactNode;
};

const CustomModal: React.FC<Props> = ({ open, setOpen, children }) => {
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      // ✅ prevent MUI from blocking pointer events or scroll
      disableEnforceFocus
      disableAutoFocus
      disableRestoreFocus
      keepMounted
      slotProps={{
        backdrop: {
          style: { backgroundColor: "rgba(0,0,0,0.4)", zIndex: 1200 },
        },
      }}
      sx={{
        zIndex: 1300, // ensure above backdrop
        pointerEvents: "auto", // ✅ ensure clicks work
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: 420,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          zIndex: 1301,
          pointerEvents: "auto", // ✅ crucial for clickable elements
        }}
      >
        {children}
      </Box>
    </Modal>
  );
};

export default CustomModal;
