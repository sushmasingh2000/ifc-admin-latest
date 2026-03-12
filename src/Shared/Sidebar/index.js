import { ExpandLess, ExpandMore, Logout } from '@mui/icons-material';
import {
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import classNames from 'classnames';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { all_Data } from '../../mockdata/MockData';

const Sidebar = () => {
  const navigate = useNavigate();
  const [openSlide, setOpenSlide] = useState(true);
  const [openCollapse, setOpenCollapse] = useState({});

  const handleCollapse = (navLink) => {
    setOpenCollapse((prevState) => ({
      ...prevState,
      [navLink]: !prevState[navLink],
    }));
  };

  return (
    <List
      className={`${
        openSlide ? '!min-w-[16vw] max-w-[16vw]' : '!w-auto'
      }  shadow-md   !h-screen  !relative !overflow-y-auto !bg-[#00008B] !p-2 glass !text-white`}
    >
      <ListItem className=" !flex !justify-center">
        {openSlide ? (
          <p className='text-white p-4  rounded-lg'>IFC Trade</p>
          // <img alt="" className=" h-24 w-44 rounded-lg" src={bala} />
        ) : (
           <p className='text-white p-4 rounded-lg'>IFC Trade</p>
        // <img alt="" className="!w-14 h-16 py-8 rounded-lg" src={bala} />
        )}
      </ListItem>
      <Divider />

      {all_Data?.map((nav) => (
        <React.Fragment key={nav.id}>
          <ListItemButton
            onClick={() => {
              navigate(nav.navLink);
              if (nav.subcomponent?.length > 0) {
                handleCollapse(nav.navLink);
              }
            }}
            className={classNames(
              '!rounded-lg !p-2',
              window.location.pathname === nav.navLink &&
                '!text-[#0561FC] !bg-white !p-1 !rounded-l-full'
            )}
          >
            <ListItemIcon
              className="!text-yellow-500"
              sx={{ minWidth: '32px', mr: 1, ml: 3 }}
            >
              {nav.navIcon}
            </ListItemIcon>
            <ListItemText
              primary={nav.navItem}
              primaryTypographyProps={{
                className: '!text-base  !leading-tight',
              }}
            />
            {nav.subcomponent?.length > 0 && (
              <span>
                {openCollapse[nav.navLink] ? <ExpandLess /> : <ExpandMore />}
              </span>
            )}
          </ListItemButton>
          <Collapse in={openCollapse[nav.navLink]} timeout="auto" unmountOnExit>
            <div className="relative pl-6">
              <div className="absolute left-3.5 top-0 bottom-0 w-px bg-[#E2E8F0]" />
              <List
                component="div"
                disablePadding
                className="!text-sm !text-center"
              >
                {nav.subcomponent?.map((subNav) => (
                  <ListItemButton
                    key={subNav.id}
                    onClick={() => navigate(subNav.navLink)}
                    className={classNames(
                      'relative !rounded-none !mt-1 !p-1 !pl-8 ',
                      window.location.pathname === subNav.navLink &&
                        '!text-[#0561FC] !text-xs !text-center !bg-white !rounded-l-full'
                    )}
                    sx={{ pl: 4 }}
                  >
                    <span className="absolute -left-[14px] top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full" />
                    {/* <ListItemIcon className="!text-yellow-500 !text-sm">
                      {subNav.navIcon}
                    </ListItemIcon> */}
                    <ListItemText
                      primary={subNav.navItem}
                      primaryTypographyProps={{
                        className: '!text-sm !text-center !leading-tight',
                      }}
                    />
                  </ListItemButton>
                ))}
              </List>
            </div>
          </Collapse>
        </React.Fragment>
      ))}
      <List>
        <ListItemButton
          onClick={() => {
            localStorage.clear();
            sessionStorage.clear();
            navigate('/');
          }}
        >
          <ListItemIcon
            className="!text-yellow-500 "
            sx={{ minWidth: '32px', mr: 1, ml: 3 }}
          >
            <Logout />
          </ListItemIcon>
          <ListItemText primary={'Logout'} className="!text-white" />
        </ListItemButton>
      </List>
    </List>
  );
};

export default Sidebar;
