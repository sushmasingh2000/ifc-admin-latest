import { ExpandLess, ExpandMore, Menu as MenuIcon } from '@mui/icons-material';
import {
  AppBar,
  Box,
  Collapse,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import classNames from 'classnames';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { all_Data } from '../../mockdata/MockData';

export default function MobileNavigation() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [openCollapse, setOpenCollapse] = React.useState({});
  const navigate = useNavigate();

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleCollapse = (navLink) => {
    setOpenCollapse((prevState) => ({
      ...prevState,
      [navLink]: !prevState[navLink],
    }));
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" className="!bg-opacity-50">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon className="!text-white" />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
            className="!text-white"
          >
IFC Trade          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          className="!bg-[#00008B] !text-white h-full overflow-y-auto"
        >
          <List>
            {all_Data?.map((nav) => (
              <React.Fragment key={nav.id}>
                <ListItemButton
                  onClick={() => {
                    if (nav.subcomponent?.length > 0) {
                      handleCollapse(nav.navLink);
                    } else {
                      navigate(nav.navLink);
                      setDrawerOpen(false);
                    }
                  }}
                  className={classNames(
                    '!rounded-lg !p-2',
                    window.location.pathname === nav.navLink &&
                      '!text-[#0561FC] !bg-white !p-1 !rounded-l-full'
                  )}
                >
                  <ListItemText
                    primary={nav.navItem}
                    primaryTypographyProps={{
                      className: '!text-base !ml-4 !leading-tight',
                    }}
                  />
                  {nav.subcomponent?.length > 0 && (
                    <span>
                      {openCollapse[nav.navLink] ? (
                        <ExpandLess />
                      ) : (
                        <ExpandMore />
                      )}
                    </span>
                  )}
                </ListItemButton>

                <Collapse
                  in={openCollapse[nav.navLink]}
                  timeout="auto"
                  unmountOnExit
                >
                  <div className="relative pl-6">
                    <div className="absolute left-3.5 top-0 bottom-0 w-px bg-[#E2E8F0]" />
                    <List component="div" disablePadding>
                      {nav.subcomponent?.map((subNav) => (
                        <ListItemButton
                          key={subNav.id}
                          onClick={() => {
                            navigate(subNav.navLink);
                            setDrawerOpen(false);
                          }}
                          className={classNames(
                            'relative !rounded-none !mt-1 !p-1 !pl-8 !ml-[0.12rem]',
                            window.location.pathname === subNav.navLink &&
                              '!text-[#0561FC] !text-xs !text-center !bg-white !rounded-l-full'
                          )}
                        >
                          <span className="absolute -left-[15px] top-1/2  -translate-y-1/2 w-2 h-2 bg-white rounded-full" />
                          <ListItemText
                            primary={subNav.navItem}
                            primaryTypographyProps={{
                              className: '!text-base  !leading-tight',
                            }}
                          />
                        </ListItemButton>
                      ))}
                    </List>
                  </div>
                </Collapse>
              </React.Fragment>
            ))}

            <ListItemButton
              onClick={() => {
                localStorage.clear();
                sessionStorage.clear();
                navigate('/');
                setDrawerOpen(false);
              }}
            >
              <ListItemText primary="Logout" className="!text-white" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}
