import React, {Component} from "react";
import {View} from 'react-native';
import {BottomNavigation} from "react-native-material-ui";
import Tasks from "./Tasks";

export default class LoggedIn extends Component {
  state = {
    active: "tasks"
  };

  render() {
    return (
        <View style={{flex: 1}}>
          <Tasks/>
          <BottomNavigation
              active={this.state.active}
              hidden={false}
              style={{container: {height: 70}}}
          >
            <BottomNavigation.Action
                key="tasks"
                icon="assignment"
                label="Tasks"
                onPress={() => this.setState({active: "tasks"})}
            />
            <BottomNavigation.Action
                key="people"
                icon="people"
                label="People"
                onPress={() => this.setState({active: 'people'})}
            />
            <BottomNavigation.Action
                key="bookmark-border"
                icon="bookmark-border"
                label="Bookmark"
                onPress={() => this.setState({active: 'bookmark-border'})}
            />
            <BottomNavigation.Action
                key="settings"
                icon="settings"
                label="Settings"
                onPress={() => this.setState({active: 'settings'})}
            />
          </BottomNavigation>
        </View>
    );
  }
}
