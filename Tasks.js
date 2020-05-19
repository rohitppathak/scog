import React, {Component} from "react";
import {
  findNodeHandle,
  FlatList,
  Keyboard,
  Switch,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import RNPickerSelect from "react-native-picker-select";
import {Button, ButtonGroup, Card, Divider, Icon} from "react-native-elements"
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {KeyboardAwareFlatList} from "react-native-keyboard-aware-scroll-view";

const Stack = createStackNavigator();

class Question extends Component {
  answerHovered = "mc";

  render() {
    return (
        <TouchableWithoutFeedback onPress={() => {
          Keyboard.dismiss();
          this.props.selectQuestion();
        }}>
          <Card containerStyle={{
            borderColor: this.props.selected ? "blue" : "lightgray"
          }}>
            <TextInput multiline={true} style={{paddingBottom: 5, fontSize: 20}}
                       placeholder={"Question"} scrollEnabled={false}
                       onFocus={event => {
                         this.props.selectQuestion();
                         this.props.scrollRef.props.scrollToFocusedInput(
                             findNodeHandle(event.target),
                             (this.props.options.length + 1) * 44 + 33.5 + 10
                             + 42 + 15 + 44 + 70);
                       }}/>
            <Divider style={{marginBottom: 10}}/>
            <RNPickerSelect
                onOpen={this.props.selectQuestion}
                onValueChange={
                  answerHovered => this.answerHovered = answerHovered}
                onDonePress={() => this.props.selectAnswerStyle(
                    this.answerHovered)}
                placeholder={{}}
                style={{
                  inputIOS: {
                    fontSize: 16,
                    paddingVertical: 6,
                    paddingHorizontal: 5,
                    borderWidth: 1,
                    borderColor: 'lightgray',
                    borderRadius: 4,
                    color: 'black',
                    paddingRight: 30
                  }, iconContainer: {
                    top: 5, right: 12
                  }
                }}
                Icon={() => (<Icon name={"chevron-down"}
                                   size={20}
                                   type={"font-awesome"}/>)}
                items={this.props.answerChoices}/>
            {this.props.answerStyle === "sa" ?
                <View style={{flex: 1, paddingTop: 10}}>
                  <Text style={{
                    paddingBottom: 3,
                    paddingTop: 0,
                    fontSize: 16,
                    color: "lightgray"
                  }} onPress={() => {
                    Keyboard.dismiss();
                    this.props.selectQuestion();
                  }}>Short Answer</Text>
                  <Divider/>
                </View>
                : this.props.options.map((option, index) => (
                    <View key={index}
                          style={{marginVertical: 10, flexDirection: "row"}}>
                      <Icon color={"lightgray"}
                            name={this.props.answerStyle === "mc"
                                ? "circle-thin"
                                : "square-o"}
                            type={"font-awesome"}/>
                      <View style={{flex: 1, paddingLeft: 10}}>
                        <TextInput
                            onChangeText={text => this.props.changeOptionText(
                                index,
                                text)}
                            onFocus={event => {
                              this.props.selectQuestion();
                              this.props.scrollRef.props.scrollToFocusedInput(
                                  findNodeHandle(event.target),
                                  (this.props.options.length - index) * 44
                                  + 42 + 15 + 44 + 70);
                            }}
                            editable={index !== this.props.otherIndex}
                            accessible={false}
                            value={option}
                            scrollEnabled={false}
                            multiline={true} style={{
                          paddingBottom: 3,
                          paddingTop: 0,
                          fontSize: 16
                        }} placeholder={`Option ${index + 1}`}
                            key={index}
                            autoFocus={true}/>
                        <Divider/>
                      </View>
                      {this.props.options.length > 1 &&
                      <Icon name={"times"} type={"font-awesome"} color={"gray"}
                            onPress={() => this.props.removeOption(index)}/>}
                    </View>
                ))}
            {this.props.answerStyle !== "sa" && <View
                style={{marginVertical: 10, flexDirection: "row"}}>
              <Icon color={"lightgray"}
                    name={this.props.answerStyle === "mc" ? "circle-thin"
                        : "square-o"}
                    type={"font-awesome"}/>
              <View style={{flex: 1, paddingLeft: 10}}>
                <Text style={{
                  paddingBottom: 3,
                  paddingTop: 0,
                  fontSize: 16,
                  color: "lightgray"
                }} onPress={this.props.addOption}>Add option</Text>
                <Divider/>
              </View>
              {!this.props.otherIndex && <View
                  style={{flex: 1, paddingLeft: 10, flexDirection: "row"}}>
                <Text style={{paddingTop: 2, fontSize: 16}}>or </Text>
                <Button title={"add \"Other\""} type={"clear"}
                        titleStyle={{fontSize: 16, color: "navy"}}
                        buttonStyle={{padding: 0}}
                        onPress={this.props.addOtherOption}/>
              </View>}
            </View>}
            {this.props.selected &&
            <View>
              <Divider/>
              <View style={{paddingTop: 10, flexDirection: "row"}}>
                <Icon name={"plus"} type={"font-awesome"}
                      onPress={this.props.addQuestion}
                      containerStyle={{flex: 1}}/>
                <Icon name={"trash"} type={"font-awesome"}
                      onPress={() => !this.props.restrictDeleting
                          && this.props.removeQuestion()}
                      containerStyle={{flex: 1}}
                      color={this.props.restrictDeleting ? "lightgray"
                          : "black"}/>
                <View style={{
                  flex: 1,
                  borderLeftWidth: 1,
                  borderLeftColor: "#e1e8ee"
                }}/>
                <Text style={{
                  paddingRight: 10,
                  alignSelf: "center"
                }}>REQUIRED</Text>
                <Switch value={this.props.required}
                        onValueChange={this.props.toggleRequired}
                        style={{flex: 1}}/>
              </View>
            </View>}
          </Card>
        </TouchableWithoutFeedback>)
  }
}

class AddTask extends Component {
  answerChoices = [{label: "Multiple Choice", value: "mc"},
    {label: "Short Answer", value: "sa"},
    {label: "Checkboxes", value: "cb"}];
  scrollRef: {props: {scrollToFocusedInput: () => {}}}

  state = {
    selectedQuestionIndex: 0,
    questions: [
      {
        answerStyle: this.answerChoices[0].value,
        options: [""],
        otherIndex: null,
        required: false
      }
    ]
  };

  render() {
    return (
        <KeyboardAwareFlatList
            keyboardShouldPersistTaps={"handled"}
            innerRef={ref => this.scrollRef = ref}
            style={{flex: 1}}
            extraScrollHeight={-70}
            extraHeight={70}
            enableAutomaticScroll={false}
            enableResetScrollToCoords={false}
            keyboardDismissMode={"interactive"}
            data={this.state.questions}
            renderItem={({item, index}) =>
                (<Question
                    selected={index === this.state.selectedQuestionIndex}
                    answerStyle={item.answerStyle}
                    options={item.options}
                    otherIndex={item.otherIndex}
                    required={item.required}
                    answerChoices={this.answerChoices}
                    scrollRef={this.scrollRef}
                    restrictDeleting={this.state.questions.length === 1}
                    selectAnswerStyle={answerStyle => {
                      item.answerStyle = answerStyle;
                      this.setState({questions: this.state.questions});
                    }}
                    changeOptionText={(optionIndex, text) => {
                      item.options[optionIndex] = text;
                      this.setState({questions: this.state.questions});
                    }}
                    removeOption={optionIndex => {
                      item.options = item.options.filter(
                          (option, iterIndex) => optionIndex !== iterIndex);
                      item.otherIndex = optionIndex
                      === item.otherIndex ? null
                          : item.otherIndex;
                      this.setState({
                        questions: this.state.questions,
                        selectedQuestionIndex: index
                      });
                    }}
                    addOption={() => {
                      item.options.push("");
                      this.setState({
                        questions: this.state.questions,
                        selectedQuestionIndex: index
                      });
                    }}
                    addOtherOption={() => {
                      item.otherIndex = item.options.length;
                      item.options.push("Other");
                      this.setState({
                        questions: this.state.questions,
                        selectedQuestionIndex: index
                      });
                    }}
                    selectQuestion={() => this.setState(
                        {selectedQuestionIndex: index})}
                    addQuestion={() => {
                      const {questions} = this.state;
                      questions.push({
                        answerStyle: this.answerChoices[0].value,
                        options: [""],
                        otherIndex: null,
                        required: false
                      });
                      this.setState({questions});
                    }}
                    removeQuestion={() => {
                      const {questions} = this.state;
                      questions.splice(index, 1);
                      this.setState({questions});
                    }}
                    toggleRequired={() => {
                      const {questions} = this.state;
                      questions[index].required = !questions[index].required;
                      this.setState({questions, selectedQuestionIndex: index});
                    }}
                />)}/>
    )
  }
}

export default class Tasks extends Component {
  state = {
    selectedIndex: 0
  };

  render() {
    return (
        <NavigationContainer>
          <Stack.Navigator mode={"modal"}>
            <Stack.Screen name={"Tasks"} options={({navigation}) => ({
              headerRight: () => (<Icon
                  color={"blue"}
                  name={"create"}
                  size={14}
                  raised
                  iconStyle={{fontSize: 20}}
                  containerStyle={{marginRight: 15}}
                  reverse
                  onPress={() => navigation.navigate("New Task")}/>)
            })}>
              {props =>
                  <View style={{flex: 1}}>
                    <ButtonGroup
                        selectedButtonStyle={{backgroundColor: buttonGroupSelectedColor}}
                        buttons={[{
                          element: () => (<Icon
                              color={this.state.selectedIndex === 0
                                  ? buttonGroupSelectedColor
                                  : buttonGroupDisabledColor}
                              name={"hourglass-half"}
                              type={"font-awesome"}
                              size={14}
                              iconStyle={{fontSize: 20}}
                              reverse={this.state.selectedIndex === 0}/>)
                        }, {
                          element: () => (<Icon
                              color={this.state.selectedIndex === 1
                                  ? buttonGroupSelectedColor
                                  : buttonGroupDisabledColor}
                              name={"check-square-o"}
                              type={"font-awesome"}
                              size={14}
                              iconStyle={{fontSize: 24}}
                              reverse={this.state.selectedIndex === 1}/>)
                        }, {
                          element: () => (<Icon
                              color={this.state.selectedIndex === 2
                                  ? buttonGroupSelectedColor
                                  : buttonGroupDisabledColor}
                              name={"list-ul"}
                              type={"font-awesome"}
                              size={14}
                              iconStyle={{fontSize: 20}}
                              reverse={this.state.selectedIndex === 2}/>)
                        }]}
                        onPress={selectedIndex => this.setState(
                            {selectedIndex})}
                        selectedIndex={this.state.selectedIndex}
                        containerStyle={{
                          height: 40,
                          marginHorizontal: 0,
                          marginVertical: 0
                        }}/>
                    <FlatList
                        data={this.state.selectedIndex ? [] : cards}
                        renderItem={({item}) => (
                            <View style={{
                              flexDirection: "row"
                            }}>
                              <Card
                                  title={item[0].title}
                                  image={item[0].image}
                                  imageProps={{
                                    style: {
                                      width: "100%",
                                      aspectRatio: 1
                                    }
                                  }}
                                  containerStyle={{
                                    flex: 1,
                                    margin: 0,
                                    marginHorizontal: 15,
                                    marginBottom: 15
                                  }}
                              >
                                <Text style={{textAlign: "center"}}>Input your
                                  availability for the summer</Text>
                              </Card>
                              {item[1] ?
                                  <Card
                                      title={item[1].title}
                                      image={item[1].image}
                                      imageProps={{
                                        style: {
                                          width: "100%",
                                          aspectRatio: 1
                                        }
                                      }}
                                      containerStyle={{
                                        flex: 1,
                                        margin: 0,
                                        marginHorizontal: 15,
                                        marginBottom: 15
                                      }}
                                  >
                                    <Text style={{textAlign: "center"}}>Input
                                      your
                                      availability for the summer</Text>
                                  </Card> :
                                  <View style={{flex: 1, padding: 15}}/>}
                            </View>)
                        }
                        keyExtractor={item => item[0].key}
                    />
                  </View>}
            </Stack.Screen>
            <Stack.Screen name={"New Task"} component={AddTask}
                          options={{
                            headerLeft: ({onPress}) => (
                                <Button title={"Cancel"} onPress={onPress}
                                        type={"clear"}
                                        titleStyle={{color: "red"}}/>)
                          }}/>
          </Stack.Navigator>
        </NavigationContainer>
    );
  }
}

const cards = [
  [
    {
      title: "Availability",
      image: require("./images/clock.jpg"),
      key: "0"
    },
    {
      title: "Availability",
      image: require("./images/clock.jpg")
    }
  ],
  [
    {
      title: "Availability",
      image: require("./images/clock.jpg"),
      key: "1"
    },
    {
      title: "Availability",
      image: require("./images/clock.jpg")
    }
  ],
  [
    {
      title: "Availability",
      image: require("./images/clock.jpg"),
      key: "2"
    },
    {
      title: "Availability",
      image: require("./images/clock.jpg")
    }
  ],
  [
    {
      title: "Availability",
      image: require("./images/clock.jpg"),
      key: "3"
    }
  ]
];

const buttonGroupSelectedColor = "#2089dc";
const buttonGroupDisabledColor = "grey";
