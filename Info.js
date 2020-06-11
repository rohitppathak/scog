import {
  TouchableHighlight,
  View,
  Text,
  TouchableWithoutFeedback,
    Dimensions
} from "react-native";
import React, {Component} from "react";

export class Info extends Component {
  state = {
    open: false
  };

  render() {
    const Label = this.props.label;
    const Body = this.props.body;
    const width = Dimensions.get("window").width;
    const height = Dimensions.get("window").height;
    return (
        <View style={{
          flexDirection: "column",
          position: "relative",
          ...this.props.style
        }}>
          <TouchableHighlight underlayColor={"white"} onPress={() => this.setState({open: !this.state.open})}>
            <Label/>
          </TouchableHighlight>
          {this.state.open && <View><Body/></View>}
        </View>
    )
  }
}
