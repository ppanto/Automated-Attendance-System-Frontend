import React from 'react'
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import Collapse from "@material-ui/core/Collapse";
import {Link} from 'react-router-dom';
import SettingsIcon from "@material-ui/icons/Settings";
import DashboardIcon from '@material-ui/icons/Dashboard';
import BusinessIcon from '@material-ui/icons/Business';
import PersonIcon from '@material-ui/icons/Person';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import TitleIcon from '@material-ui/icons/Title';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import ScheduleIcon from '@material-ui/icons/Schedule';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AssessmentIcon from '@material-ui/icons/Assessment';
import AdjustIcon from '@material-ui/icons/Adjust';
import TimerIcon from '@material-ui/icons/Timer';
import AirplanemodeActiveIcon from '@material-ui/icons/AirplanemodeActive';
import ContactMailIcon from '@material-ui/icons/ContactMail';
import DateRangeIcon from '@material-ui/icons/DateRange';
import LocationOffIcon from '@material-ui/icons/LocationOff';
import BarChartIcon from '@material-ui/icons/BarChart';
import TimelineIcon from '@material-ui/icons/Timeline';
import TableChartIcon from '@material-ui/icons/TableChart';

import './SideMenu.css';

function SidebarItem({ depthStep = 10, depth = 0, expanded, item, ...rest }) {
    const [collapsed, setCollapsed] = React.useState(true);
    const { linkText, label, items, Icon, onClick: onClickProp } = item;
  
    function toggleCollapse() {
      setCollapsed(prevValue => !prevValue);
    }
  
    function onClick(e) {
      if (Array.isArray(items)) {
        toggleCollapse();
      }
      if (onClickProp) {
        onClickProp(e, item);
      }
    }
  
    let expandIcon;
  
    if (Array.isArray(items) && items.length) {
      expandIcon = !collapsed ? (
        <ExpandLessIcon
          className={
            // eslint-disable-next-line
            "sidebar-item-expand-arrow" + " sidebar-item-expand-arrow-expanded"
          }
        />
      ) : (
        <ExpandMoreIcon className="sidebar-item-expand-arrow" />
      );
    }
  
    return (
      <>
      {typeof(linkText) === 'undefined' ? (
        <ListItem
        className="sidebar-item"
        onClick={onClick}
        button
        dense
        {...rest}
      >
        
        <div
          style={{ paddingLeft: depth * depthStep }}
          className="sidebar-item-content"
        >
          {Icon && <Icon className="sidebar-item-icon" /*fontSize="small"*/ />}
          <div className="sidebar-item-text">{label}</div>
        </div>
        {expandIcon}
      </ListItem>
      ) : (
        <Link to={`${linkText}`}>
        <ListItem
          className="sidebar-item"
          onClick={onClick}
          button
          dense
          {...rest}
        >
          
          <div
            style={{ paddingLeft: depth * depthStep }}
            className="sidebar-item-content"
          >
            {Icon && <Icon className="sidebar-item-icon" /*fontSize="small"*/ />}
            <div className="sidebar-item-text">{label}</div>
          </div>
          {expandIcon}
        </ListItem>
        </Link>
      )}
        <Collapse in={!collapsed} timeout="auto" unmountOnExit>
          {Array.isArray(items) ? (
            <List disablePadding dense>
              {items.map((subItem, index) => (
                <React.Fragment key={`${subItem.name}${index}`}>
                  {subItem === "divider" ? (
                    <Divider style={{ margin: "6px 0" }} />
                  ) : (
                    <SidebarItem
                      depth={depth + 1}
                      depthStep={depthStep}
                      item={subItem}
                    />
                  )}
                </React.Fragment>
              ))}
            </List>
          ) : null}
        </Collapse>
      </>
    );
  }
function SideMenu({ depthStep, depth, expanded }) {
    const items = [
        { name: "dashboard", label: "Dashboard", Icon: DashboardIcon, linkText:'' },
        {
          name: "organization",
          label: "Organization",
          Icon: BusinessIcon,
          items: [
            { name: "employee", label: "Employee", Icon:PersonIcon, linkText: '/employee' },
            { name: "department", label: "Department", Icon:AccountBalanceIcon, linkText: '/department' },
            { name: "title", label: "Title", Icon: TitleIcon, linkText: '/title' },
            { name: "account", label: "User Accounts", Icon: AccountBoxIcon , linkText:'/user'},
          ]
        },
        { 
          name: "workschedule", 
          label: "Work Schedule",
          Icon: ScheduleIcon,
          items: [
            { name: "shifts", label: "Shifts", Icon:TimerIcon, linkText: '/shift-type' },
            { name: "shiftmapper", label: "Shift Mapper", Icon: DateRangeIcon, linkText: '/shift'  },
          ] 
        },
        { 
            name: "leavetracker", 
            label: "Leave Tracker",
            Icon: ExitToAppIcon,
            items: [
              { name: "leaves", label: "Leaves", Icon: LocationOffIcon, linkText: '/leave' },
              { name: "leavetypes", label: "Leave Types", Icon: AdjustIcon, linkText: '/leave-type' },
              { name: "holidays", label: "Holidays", Icon: AirplanemodeActiveIcon, linkText: '/holiday' },
            ] 
          },
        { name: "reports", label: "Reports", Icon: AssessmentIcon, items: 
          [
          { name: "daily", label: "Daily Report", Icon:TimelineIcon, linkText: '/report/daily' },
          { name: "workTime", label: "Time Report", Icon:TableChartIcon, linkText: '/report/work-time' },
          { name: "charts", label: "Charts", Icon: BarChartIcon, linkText: '/report/charts' },
          ] 
        },
        "divider",
        {
          name: "settings",
          label: "Settings",
          Icon: SettingsIcon,
          items: [
            { name: "profile", label: "Profile", Icon: ContactMailIcon, linkText: '/settings/profile' },
          ]
        }
      ];

    return (
        <div className='sideMenu'>
            <List disablePadding dense>
                    {items.map((sidebarItem, index) => (
                    <React.Fragment key={`${sidebarItem.name}${index}`}>
                        {sidebarItem === "divider" ? (
                        <Divider style={{ margin: "6px 0" }} />
                        ) : (
                        <SidebarItem
                            depthStep={depthStep}
                            depth={depth}
                            expanded={expanded}
                            item={sidebarItem}
                        />
                        )}
                    </React.Fragment>
                    ))}
                </List>
        </div>
    )
}

export default SideMenu;
