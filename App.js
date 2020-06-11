import React, {Component} from 'react';
import {AsyncStorage} from 'react-native';
import {Notifications} from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import Login from "./Login";
import LoggedIn from "./LoggedIn";
import axios from 'axios';
import {HOST} from "./env";

console.disableYellowBox = true;

export default class App extends Component {
  state = {
    userId: "",
    user: "",
    profilePicUri: "",
    expoPushToken: ""
  };

  registerForPushNotificationsAsync = async () => {
    if (Constants.isDevice) {
      const {status: existingStatus} = await Permissions.getAsync(
          Permissions.NOTIFICATIONS);
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const {status} = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      const token = await Notifications.getExpoPushTokenAsync();
      console.log(token);
      this.setState({expoPushToken: token});
    } else {
      alert('Must use physical device for Push Notifications');
    }
  };

  async componentDidMount() {
    this.registerForPushNotificationsAsync();
    const userId = await getData("userId") || "";
    if (userId) {
      const {name, profilePicUri, _id} = (await axios.get(
          `${HOST}/users/${userId}`)).data;
      this.setState({userId: _id, user: name, profilePicUri});
    }
  }

  render() {
    return (
        this.state.user ?
            <LoggedIn userId={this.state.userId} user={this.state.user}
                      profilePicUri={this.state.profilePicUri}/>
            :
            <Login
                login={async (user, profilePicUri) => {
                  const result = (await axios.post(`${HOST}/users`, {
                    name: user,
                    profilePicUri: profilePicUri
                  })).data;
                  await storeData("userId", result._id);
                  this.setState(
                      {user: result.name, profilePicUri: result.profilePicUri});
                }}
            />
    );
  }
}

const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.log("error storing data");
    throw e;
  }
};

const getData = async (key) => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (e) {
    console.log("error reading value");
    throw e;
  }
};
