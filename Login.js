import React, {Component} from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableHighlight,
  View, Platform
} from 'react-native';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {DismissKeyboardView} from "./DismissKeyboardView";
import {Button, Card, Icon} from "react-native-elements"
import {getPermissionAsync, pickImage} from "./ImageHelper";

const USERNAME = "Name";
const PICTURE = "Picture";

class UsernamePage extends Component {
  state = {
    user: ""
  };

  render() {
    return (
        <DismissKeyboardView style={{flex: 1}}>
          <KeyboardAvoidingView style={{flex: 1, justifyContent: "center"}}
                                behavior={Platform.OS === "ios" && "padding"}>
            <Card containerStyle={{borderColor: "blue"}}
                  title={"Summer Clown Olympic Games"}
                  titleStyle={{fontSize: 25}}
            >
              <View style={{justifyContent: "center"}}>
                <TextInput
                    placeholder={"Name"}
                    placeholderTextColor={"gray"}
                    multiline={true}
                    onChangeText={user => this.setState({user})}
                    style={{
                      width: "100%",
                      fontSize: 20,
                      minHeight: 30,
                      borderBottomWidth: 1,
                      borderBottomColor: "gray",
                      marginBottom: 10
                    }}
                />
                <Button
                    buttonStyle={{backgroundColor: "blue"}}
                    raised={true}
                    icon={<Icon color={this.state.user ? "white" : "grey"}
                                style={{marginLeft: 10}} name={"sign-in"}
                                type={"font-awesome"}/>}
                    iconRight
                    title={"LOGIN"}
                    titleStyle={{fontSize: 15}}
                    disabled={!this.state.user}
                    onPress={() => this.props.navigation.navigate(PICTURE,
                        {user: this.state.user})}
                />
              </View>
            </Card>
          </KeyboardAvoidingView>
        </DismissKeyboardView>
    );
  }
}

class ProfilePicPage extends Component {
  state = {
    profilePicUri: ""
  };

  async setProfilePic() {
    await getPermissionAsync();
    const image = await pickImage();
    image && this.setState({profilePicUri: image.uri});
  }

  render() {
    return (
        <View style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 250
        }}>
          <Card containerStyle={{borderColor: "blue"}}>
            <View style={{justifyContent: "space-between"}}>
              {this.state.profilePicUri ?
                  <TouchableHighlight onPress={this.setProfilePic.bind(this)}>
                    <Image
                        source={{uri: this.state.profilePicUri}}
                        style={{width: 200, height: 200}}
                    />
                  </TouchableHighlight>
                  :
                  <TouchableHighlight
                      onPress={this.setProfilePic.bind(this)}
                      underlayColor={"grey"}
                      style={{
                        width: 200,
                        height: 200,
                        borderWidth: 2,
                        borderColor: "grey",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                  >
                    <Text>Add Photo</Text>
                  </TouchableHighlight>
              }
              <Button
                  containerStyle={{paddingTop: 10}}
                  title={"NEXT"}
                  titleStyle={{fontSize: 15}}
                  buttonStyle={{backgroundColor: "blue"}}
                  raised={true}
                  icon={<Icon size={20} color={"white"} style={{marginLeft: 10}}
                              name={"arrow-right"} type={"font-awesome"}/>}
                  iconRight
                  onPress={() => this.props.login(this.props.route.params.user,
                      this.state.profilePicUri)}
              />
            </View>
          </Card>
        </View>
    );
  }
}

const Stack = createStackNavigator();

export default class Login extends Component {
  render() {
    return (
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name={USERNAME} component={UsernamePage}
                          options={{headerShown: false}}/>
            <Stack.Screen name={PICTURE}>
              {props => <ProfilePicPage {...props} login={this.props.login}/>}
            </Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
    );
  }
}
