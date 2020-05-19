import React, {Component} from 'react';
import {AsyncStorage, StyleSheet} from 'react-native';
import Login from "./Login";
import LoggedIn from "./LoggedIn";

export default class App extends Component {
  state = {
    user: "",
    profilePicUri: ""
  };

  async componentDidMount() {
    // await AsyncStorage.removeItem("user");
    // await AsyncStorage.removeItem("profilePicUri");
    const user = await getData("user") || "";
    const profilePicUri = await getData("profilePicUri") || null;
    console.log(user, profilePicUri);
    this.setState({user, profilePicUri});
  }

  render() {
    return (
        this.state.user ?
            <LoggedIn/>
            :
            <Login
                login={async (user, profilePicUri) => {
                  await storeData("user", user);
                  await storeData("profilePicUri", profilePicUri);
                  this.setState({user, profilePicUri});
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
