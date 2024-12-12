// src/pages/global/SideBar.jsx

import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

// Material-UI Components
import {
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip,
} from "@mui/material";

// Material-UI Icons
import BadgeIcon from "@mui/icons-material/Badge";
import SailingIcon from "@mui/icons-material/Sailing";
import GridViewIcon from "@mui/icons-material/GridView";
import ArrowRightOutlinedIcon from "@mui/icons-material/ArrowRightOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu"; // Import MenuIcon

import logo from "../../assets/Urim_logo.png"; // Ensure the path is correct

import { useState } from "react";

export default function SideBar({ onLogout, collapsed, onToggle }) { // Accept 'onToggle' as prop
  const location = useLocation();
  const navigate = useNavigate();

  const checkActive = (path) => {
    return location.pathname === path;
  };

  // State for Logout Dialog
  const [open, setOpen] = useState(false);

  // Logout handler with confirmation
  const handleLogoutClick = () => {
    console.log("Logout button clicked");
    setOpen(true);
  };

  const confirmLogout = () => {
    console.log("Confirming logout");
    setOpen(false);
    if (onLogout) {
      onLogout();
      console.log("onLogout called");
    } else {
      console.log("onLogout is not defined");
    }
    navigate("/login");
    console.log("Navigated to /login");
  };

  const cancelLogout = () => {
    console.log("Logout cancelled");
    setOpen(false);
  };

  return (
    <Sidebar
      collapsed={collapsed}
      backgroundColor="black"
      style={{
        height: "100vh",
        width: collapsed ? "80px" : "250px",
        transitionProperty: "width",
        transitionTimingFunction: "ease-in-out",
        transitionDuration: "0.5s",
      }}
    >
      <Box display="flex" flexDirection="column" height="100%">
        {/* Header with MenuIcon and ICC */}
        <Box
          display="flex"
          alignItems="center"
          padding="1rem"
          sx={{ backgroundColor: "#896801" }}
        >
          {/* MenuIcon acts as the toggle button */}
          <Tooltip title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"} placement="right">
            <Button
              onClick={onToggle}
              sx={{
                color: "white",
                minWidth: "unset",
                padding: "0.5rem",
                marginRight: collapsed ? "0" : "0.5rem",
              }}
            >
              <MenuIcon />
            </Button>
          </Tooltip>
          {!collapsed && (
            <Typography
              variant="h1"
              fontSize="2.5rem"
              color="white"
              textAlign="center"
              sx={{ flexGrow: 1 }}
            >
              ICC
            </Typography>
          )}
        </Box>

        {/* Logout Confirmation Dialog */}
        <Dialog
          open={open}
          onClose={cancelLogout}
          aria-labelledby="logout-dialog-title"
          aria-describedby="logout-dialog-description"
        >
          <DialogTitle id="logout-dialog-title">{"Confirm Logout"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="logout-dialog-description">
              Are you sure you want to logout?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={cancelLogout} color="primary">
              Cancel
            </Button>
            <Button onClick={confirmLogout} color="primary" autoFocus>
              Logout
            </Button>
          </DialogActions>
        </Dialog>

        {/* Menu Items Container */}
        <Box flexGrow={1} overflow="auto">
          <Menu
            menuItemStyles={{
              button: ({ active }) => ({
                color: active ? "#FFFFFF" : "#A9A7A7",
                background: "#070000",
                "&:hover": {
                  background: "#070000",
                },
              }),
            }}
          >
            <MenuItem
              component={<NavLink to="/" />}
              icon={<GridViewIcon />}
              active={checkActive("/")}
            >
              {!collapsed && "Dashboard"}
            </MenuItem>
            <SubMenu
              label={!collapsed ? "Member Management" : ""}
              icon={<BadgeIcon />}
              defaultOpen
              active={checkActive("/member-management")}
            >
              <MenuItem
                component={<NavLink to="/retantionRate" />}
                active={checkActive("/retantionRate")}
                icon={<ArrowRightOutlinedIcon />}
              >
                {!collapsed && "Retention"}
              </MenuItem>
              <MenuItem
                component={<NavLink to="/addMember" />}
                active={checkActive("/addMember")}
                icon={<ArrowRightOutlinedIcon />}
              >
                {!collapsed && "Add Member"}
              </MenuItem>
              <MenuItem
                component={<NavLink to="/baptism" />}
                active={checkActive("/baptism")}
                icon={<ArrowRightOutlinedIcon />}
              >
                {!collapsed && "Baptism"}
              </MenuItem>
              <MenuItem
                component={<NavLink to="/attendance" />}
                active={checkActive("/attendance")}
                icon={<ArrowRightOutlinedIcon />}
              >
                {!collapsed && "Attendance"}
              </MenuItem>
              <MenuItem
                component={<NavLink to="/discipleship" />}
                active={checkActive("/discipleship")}
                icon={<ArrowRightOutlinedIcon />}
              >
                {!collapsed && "Discipleship"}
              </MenuItem>
              <MenuItem
                component={<NavLink to="/demographics" />}
                active={checkActive("/demographics")}
                icon={<ArrowRightOutlinedIcon />}
              >
                {!collapsed && "Demographics"}
              </MenuItem>
            </SubMenu>
            <SubMenu
              label={!collapsed ? "Ministries" : ""}
              icon={<SailingIcon />}
            >
              <MenuItem
                component={<NavLink to="/fellowshipMinistry" />}
                active={checkActive("/fellowshipMinistry")}
                icon={<ArrowRightOutlinedIcon />}
              >
                {!collapsed && "Fellowship Ministry"}
              </MenuItem>
              <MenuItem
                component={<NavLink to="/serviceMinistry" />}
                active={checkActive("/serviceMinistry")}
                icon={<ArrowRightOutlinedIcon />}
              >
                {!collapsed && "Service Ministry"}
              </MenuItem>
              <MenuItem
                component={<NavLink to="/createMinistry" />}
                active={checkActive("/createMinistry")}
                icon={<ArrowRightOutlinedIcon />}
              >
                {!collapsed && "Create Ministry"}
              </MenuItem>
            </SubMenu>
          </Menu>
        </Box>

        {/* Logo at the Bottom and Logout Button */}
        <Box
          padding="2rem"
          textAlign="center"
          sx={{ backgroundColor: "black" }}
        >
          <img
            src={logo}
            alt="Logo"
            style={{ maxWidth: "100%", height: "auto" }}
          />
          <Tooltip title={collapsed ? "Logout" : ""} placement="top">
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={handleLogoutClick}
              sx={{
                textTransform: "none",
                borderColor: "white",
                fontSize: "0.81rem",
                color: "white",
                "&:hover": {
                  borderColor: "white",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
                width: collapsed ? "100%" : "45%",
                marginTop: "1rem",
              }}
            >
              {!collapsed && "Logout"}
            </Button>
          </Tooltip>
        </Box>
      </Box>
    </Sidebar>
  );
}
