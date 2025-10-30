"use client";

import React, { FC, useEffect, useMemo, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Button, Modal, Tooltip } from "@mui/material";
import { AiOutlineDelete, AiOutlineMail } from "react-icons/ai";
import { useTheme } from "next-themes";
import Loader from "../../Loader/Loader";
import { format } from "timeago.js";
import {
  useBlockUserMutation,
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
  useDeleteByAdminMutation as useDeleteUserMutation,
} from "@/redux/features/auth/authApi";
import { styles } from "@/app/styles/style";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/features/store";

type Props = {
  isTeam?: boolean;
};

const ADMIN_EMAIL = "rahuldixit010796@gmail.com";

const AllUsers: FC<Props> = ({ isTeam }) => {
  const { theme } = useTheme();
  const [active, setActive] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("admin");
  const [open, setOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState("");

  // current logged-in user (for self-protection)
  const currentUserEmail = useSelector(
    (s: RootState) => s.auth.user?.email
  );

  const { isLoading, data, refetch } = useGetAllUsersQuery(
    undefined,
    { refetchOnMountOrArgChange: true }
  );

  const [blockUser, { isLoading: isBlocking }] = useBlockUserMutation();
  const [updateUserRole, { error: updateError, isSuccess }] =
    useUpdateUserRoleMutation();
  const [deleteUser, { isSuccess: deleteSuccess, error: deleteError }] =
    useDeleteUserMutation({});

  useEffect(() => {
    if (updateError && "data" in (updateError as any)) {
      toast.error((updateError as any).data?.message || "Failed to update role");
    }
    if (isSuccess) {
      refetch();
      toast.success("User role updated successfully");
      setActive(false);
    }
    if (deleteSuccess) {
      refetch();
      toast.success("User deleted successfully");
      setOpen(false);
    }
    if (deleteError && "data" in (deleteError as any)) {
      toast.error((deleteError as any).data?.message || "Failed to delete user");
    }
  }, [updateError, isSuccess, deleteSuccess, deleteError, refetch]);

  // ------- Rows (NO DUPLICATES) -------
  const rows = useMemo(() => {
    const list = Array.isArray(data?.users) ? data!.users : [];
    const onlyAdmins = isTeam ? list.filter((u: any) => u.role === "admin") : list;

    return onlyAdmins.map((item: any) => ({
      id: item._id,
      name: item.name,
      email: item.email,
      role: item.role,
      courses:
        item.courses?.length ??
        item.purchasedCourses?.length ??
        item.orders?.length ??
        0,
      created_at: format(item.createdAt),
      isBlocked: !!item.isBlocked,
    }));
  }, [data, isTeam]);

  const isAdminSelfRow = (rowEmail: string) =>
    rowEmail === ADMIN_EMAIL || rowEmail === currentUserEmail;

  // ------- Actions -------
  const handleBlock = async (id: string, rowEmail: string, currentlyBlocked: boolean) => {
    if (isAdminSelfRow(rowEmail)) {
      toast.error("Admin cannot block himself");
      return;
    }
    try {
      await blockUser({ id, block: !currentlyBlocked }).unwrap();
      toast.success(!currentlyBlocked ? "User blocked" : "User unblocked");
      refetch();
    } catch (e: any) {
      toast.error(e?.data?.message || "Failed to update block status");
    }
  };

  const handleSubmitRole = async () => {
    await updateUserRole({ email, role });
  };

  const handleDelete = async () => {
    if (!userIdToDelete) return;
    try {
      await deleteUser(userIdToDelete).unwrap();
      // success handled in effect
    } catch (e: any) {
      toast.error(e?.data?.message || "Failed to delete user");
    }
  };

  // ------- Columns -------
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 0.3 },
    { field: "name", headerName: "Name", flex: 0.5 },
    { field: "email", headerName: "Email", flex: 0.5 },
    { field: "role", headerName: "Role", flex: 0.4 },
    { field: "courses", headerName: "Purchased Courses", flex: 0.45 },
    { field: "created_at", headerName: "Joined At", flex: 0.45 },
    {
      field: "block",
      headerName: "Blocked",
      flex: 0.35,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const disabled = isAdminSelfRow(params.row.email);
        const checkbox = (
          <input
            type="checkbox"
            checked={!!params.row.isBlocked}
            onClick={(e) => e.stopPropagation()} // don't toggle row selection
            onChange={() =>
              handleBlock(params.row.id, params.row.email, params.row.isBlocked)
            }
            style={{
              width: 18,
              height: 18,
              cursor: disabled ? "not-allowed" : "pointer",
              opacity: disabled ? 0.6 : 1,
            }}
            disabled={disabled || isBlocking}
          />
        );

        return disabled ? (
          <Tooltip title="Admin cannot block himself">{checkbox}</Tooltip>
        ) : (
          checkbox
        );
      },
    },
    {
      field: "delete",
      headerName: "Delete",
      flex: 0.25,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const disabled = isAdminSelfRow(params.row.email);
        const btn = (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              if (disabled) {
                toast.error("Admin cannot delete himself");
                return;
              }
              setUserIdToDelete(params.row.id);
              setOpen(true);
            }}
            disabled={disabled}
            size="small"
            sx={{
              minWidth: 0,
              opacity: disabled ? 0.6 : 1,
              pointerEvents: "auto",
            }}
          >
            <AiOutlineDelete
              className="dark:text-white text-black"
              size={20}
            />
          </Button>
        );
        return disabled ? (
          <Tooltip title="Admin cannot delete himself">{btn}</Tooltip>
        ) : (
          btn
        );
      },
    },
    {
      field: "mailto",
      headerName: "Email Link",
      flex: 0.25,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <a
          href={`mailto:${params.row.email}`}
          onClick={(e) => e.stopPropagation()}
          title={`Email ${params.row.email}`}
        >
          <AiOutlineMail className="dark:text-white text-black" size={20} />
        </a>
      ),
    },
  ];

  return (
    <div className="mt-[120px]">
      {isLoading ? (
        <Loader />
      ) : (
        <Box m="20px">
          {isTeam && (
            <div className="w-full flex justify-end">
              <div
                className={`${styles.button} !w-[200px] !rounded-[10px] dark:bg-[#57c7a3] !h-[35px] dark:border dark:border-[#ffffff6c]`}
                onClick={() => setActive(true)}
              >
                Add New Member
              </div>
            </div>
          )}

          <Box
            m="40px 0 0 0"
            height="80vh"
            sx={{
              "& .MuiDataGrid-root": { border: "none", outline: "none" },
              "& .css-pqjvzy-MuiSvgIcon-root-MuiSelect-icon": {
                color: theme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-sortIcon": {
                color: theme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-row": {
                color: theme === "dark" ? "#fff" : "#000",
                borderBottom:
                  theme === "dark"
                    ? "1px solid #ffffff30!important"
                    : "1px solid #ccc!important",
              },
              "& .MuiTablePagination-root": {
                color: theme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "none!important",
              },
              "& .name-column--cell": {
                color: theme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: theme === "dark" ? "#3e4396" : "#A4A9FC",
                borderBottom: "none",
                color: theme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: theme === "dark" ? "#1F2A40" : "#F2F0F0",
              },
              "& .MuiDataGrid-footerContainer": {
                color: theme === "dark" ? "#fff" : "#000",
                borderTop: "none",
                backgroundColor: theme === "dark" ? "#3e4396" : "#A4A9FC",
              },
              "& .MuiCheckbox-root": {
                color:
                  theme === "dark" ? `#b7ebde !important` : `#000 !important`,
              },
              "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                color: `#fff !important`,
              },
            }}
          >
            <DataGrid
              rows={rows}
              columns={columns}
              getRowId={(r) => r.id}
              // prevent row selection when clicking custom cells (like checkbox)
              disableRowSelectionOnClick
              // do NOT show the leading checkbox column
              checkboxSelection={false}
              autoHeight={false}
            />
          </Box>

          {/* Add member (admin only) */}
          {active && (
            <Modal
              open={active}
              onClose={() => setActive(false)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white dark:bg-slate-900 rounded-[8px] shadow p-4 outline-none">
                <h1 className={`${styles.title}`}>Add New Member</h1>
                <div className="mt-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email..."
                    className={`${styles.input}`}
                  />
                  <select
                    className={`${styles.input} !mt-6`}
                    onChange={(e: any) => setRole(e.target.value)}
                    value={role}
                  >
                    <option value="admin">Admin</option>
                    <option value="instructor">Instructor</option>
                    <option value="student">Student</option>
                  </select>
                  <br />
                  <div
                    className={`${styles.button} my-6 !h-[30px]`}
                    onClick={handleSubmitRole}
                  >
                    Submit
                  </div>
                </div>
              </Box>
            </Modal>
          )}

          {/* Delete confirm */}
          {open && (
            <Modal
              open={open}
              onClose={() => setOpen(false)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[450px] bg-white dark:bg-slate-900 rounded-[8px] shadow p-4 outline-none">
                <h1 className={`${styles.title}`}>
                  Are you sure you want to delete this user?
                </h1>
                <div className="flex w-full items-center justify-between mb-6 mt-4">
                  <div
                    className={`${styles.button} !w-[120px] h-[30px] bg-[#57c7a3]`}
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </div>
                  <div
                    className={`${styles.button} !w-[120px] h-[30px] bg-[#d63f3f]`}
                    onClick={handleDelete}
                  >
                    Delete
                  </div>
                </div>
              </Box>
            </Modal>
          )}
        </Box>
      )}
    </div>
  );
};

export default AllUsers;
