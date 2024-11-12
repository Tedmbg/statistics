import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { NavLink, useLocation } from "react-router-dom";

// mui componets
import { Typography } from "@mui/material";

// icons
import BadgeIcon from '@mui/icons-material/Badge';
import SailingIcon from '@mui/icons-material/Sailing';
import GridViewIcon from '@mui/icons-material/GridView';
import ArrowRightOutlinedIcon from '@mui/icons-material/ArrowRightOutlined';

export default function SideBar(isvisible) {
  const location = useLocation();
  
  const checkActive = (path) => {
    return location.pathname === path;
  };

  console.log(isvisible.isvisible)
  

  return (
    <Sidebar
      style={{

        position:"sticky",
        left: 0,
        top: 0,
        height: "100vh",
        display:isvisible.isvisible? "block":"none"

      }}
      backgroundColor="primary"
      border="none"
      color="#A9A7A7"   
           
    >

      <Typography 
        variant="h1" 
        fontSize="2.5rem"
        color="white"
        textAlign="center"
        padding=".2em 0 0.5em 0 "
      >ICC</Typography>


      <Menu
        menuItemStyles={{
          button: ({ active }) => {
            return {
              color: active ? '#FFFFFF' : '#A9A7A7',
              background: "#070000",
              "&:hover": {
                background: "#070000",
              },
            };
          },
        }}
      >
        <MenuItem
          component={<NavLink to="/" />}
          icon={<GridViewIcon />}
          active={checkActive("/")}
        >
          Dashboard
        </MenuItem>
        <SubMenu
          label="Member Management"
          icon={<BadgeIcon />}
          defaultOpen
          active={checkActive("/member-management")}
        >
          <MenuItem
            component={<NavLink to="retantionRate" />}
            active={checkActive("/retantionRate")}
            icon={<ArrowRightOutlinedIcon />}
          >
            Retention
          </MenuItem>
          <MenuItem
            component={<NavLink to="addMember" />}
            active={checkActive("/addMember")}
            icon={<ArrowRightOutlinedIcon />}
          >
            Add Member
          </MenuItem>
          <MenuItem
            component={<NavLink to="baptism" />}
            active={checkActive("/baptism")}
            icon={<ArrowRightOutlinedIcon />}
          >
            Baptism
          </MenuItem>
          <MenuItem
            component={<NavLink to="attendance" />}
            active={checkActive("/attendance")}
            icon={<ArrowRightOutlinedIcon />}
          >
            Attendance
          </MenuItem>
          <MenuItem
            component={<NavLink to="discipleship" />}
            active={checkActive("/discipleship")}
            icon={<ArrowRightOutlinedIcon />}
          >
            Discipleship
          </MenuItem>
          <MenuItem
            component={<NavLink to="demographics" />}
            active={checkActive("/demographics")}
            icon={<ArrowRightOutlinedIcon />}
          >
            Demographics
          </MenuItem>
        </SubMenu>
        <SubMenu label="Ministries" icon={<SailingIcon />}>
          <MenuItem
            component={<NavLink to="fellowshipMinistry" />}
            active={checkActive("/fellowshipMinistry")}
            icon={<ArrowRightOutlinedIcon />}
          >
            Fellowship Ministry
          </MenuItem>
          <MenuItem
            component={<NavLink to="serviceMinistry" />}
            active={checkActive("/serviceMinistry")}
            icon={<ArrowRightOutlinedIcon />}
          >
            Service Ministry
          </MenuItem>
          <MenuItem
            component={<NavLink to="createMinistry" />}
            active={checkActive("/createMinistry")}
            icon={<ArrowRightOutlinedIcon />}
          >
            Create Ministry
          </MenuItem>
        </SubMenu>
      </Menu>
    </Sidebar>
  );
}
