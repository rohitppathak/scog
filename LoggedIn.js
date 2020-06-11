import React, {Component} from "react";
import {Vibration, View} from 'react-native';
import {BottomNavigation} from "react-native-material-ui";
import Tasks from "./Tasks";
import {Notifications} from "expo";

export default class LoggedIn extends Component {
  state = {
    active: "tasks",
    notification: null
  };

  _handleNotification = notification => {
    Vibration.vibrate();
    this.setState({notification, active: notification.data.tab});
  };

  componentDidMount() {
    this._notificationSubscription = Notifications.addListener(
        this._handleNotification);
  }

  resetNotification() {
    this.setState({notification: null});
  }

  render() {
    return (
        <View style={{flex: 1}}>
          {this.state.active === "tasks" && <Tasks
              userId={this.props.userId} user={this.props.user}
              notification={this.state.notification}
              resetNotification={this.resetNotification.bind(this)}
              profilePicUri={this.props.profilePicUri}/>}
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
