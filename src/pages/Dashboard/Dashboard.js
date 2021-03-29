import React, {useState} from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { Link, Route, BrowserRouter, Switch } from "react-router-dom";
import {Tabular} from "./Tabular"
import {Tabular2} from "./Tabular2"
import {Timeline} from "./Timeline"

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  }
}))

export const Dashboard = (props) => {
  const classes = useStyles()
  const {trackChange} = props
  const [value, setValue] = useState(0)

  const [searchByEmployeeFilter, setSearchByEmployeeFilter] = useState('');
  const [dateFilter, setDateFilter] = useState(new Date());

  const allTabs = ['/', '/tabular', '/tabular2'];
  return (
    <BrowserRouter>
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={(event, index) => { setValue(index) }}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="Timeline" value={0} component={Link} to={allTabs[0]} /> 
            <Tab label="Tabular View" value={1} component={Link} to={allTabs[1]} />
            <Tab label="Tabular View By Action" value={2} component={Link} to={allTabs[2]} />
          </Tabs>
        </AppBar>

        <Switch>
          <Route
            exact path={allTabs[0]}
            render={(props) => (
              <Timeline 
                {...props}
                searchByEmployeeFilter={searchByEmployeeFilter}
                setSearchByEmployeeFilter={setSearchByEmployeeFilter}
                dateFilter={dateFilter}
                setDateFilter={setDateFilter}
                trackChange={trackChange}
              />
            )}
          />
          <Route
            path={allTabs[1]}
            render={(props) => (
              <Tabular
                {...props}
                searchByEmployeeFilter={searchByEmployeeFilter}
                setSearchByEmployeeFilter={setSearchByEmployeeFilter}
                dateFilter={dateFilter}
                setDateFilter={setDateFilter}
                trackChange={trackChange}
              />
            )}
          />
          <Route
            path={allTabs[2]}
            render={(props) => (
              <Tabular2 
                {...props}
                searchByEmployeeFilter={searchByEmployeeFilter}
                setSearchByEmployeeFilter={setSearchByEmployeeFilter}
                startDate={dateFilter}
                setStartDate={setDateFilter}
                trackChange={trackChange}
              />
            )}
          />
        </Switch>
      </div>
    </BrowserRouter>
    );
}