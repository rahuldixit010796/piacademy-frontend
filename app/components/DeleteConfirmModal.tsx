"use client";

import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const DeleteConfirmModal: React.FC<Props> = ({ open, onClose, onConfirm }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="delete-account-title"
      aria-describedby="delete-account-description"
      slotProps={{
        backdrop: {
          style: { backgroundColor: "rgba(0,0,0,0.4)" },
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 360,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <h2 id="delete-account-title" className="text-lg font-semibold mb-2">
          Delete Account
        </h2>
        <p
          id="delete-account-description"
          className="text-sm text-gray-600 mb-4"
        >
          Are you sure you want to delete your account? This action is
          irreversible.
        </p>
        <div className="flex justify-end gap-3">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button onClick={onConfirm} variant="contained" color="error">
            Delete
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default DeleteConfirmModal;
