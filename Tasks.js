import React, {Component} from "react";
import {
  FlatList,
  Keyboard,
  SafeAreaView,
  Switch,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View, Dimensions
} from 'react-native';
import RNPickerSelect from "react-native-picker-select";
import {Button, ButtonGroup, Card, Divider, Icon} from "react-native-elements"
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import * as Yup from "yup";
import {FastField, Formik} from "formik";

const FullStack = createStackNavigator();
const TasksStack = createStackNavigator();

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

class FlatListKeyboard extends Component {
  state = {
    keyboardSpace: 0
  };

  updatePadding(frames) {
    this.setState({
      keyboardSpace: frames.endCoordinates.height
          + (this.props.extraScrollHeight || 0)
    })
  }

  resetPadding(frames) {
    this.setState({keyboardSpace: 0})
  }

  componentDidMount() {
    Keyboard.addListener("keyboardWillShow", this.updatePadding.bind(this));
    Keyboard.addListener("keyboardWillHide", this.resetPadding.bind(this));
  }

  componentWillUnmount() {
    Keyboard.removeListener("keyboardWillShow");
    Keyboard.removeListener("keyboardWillHide");
  }

  render() {
    return (
        <FlatList {...this.props} automaticallyAdjustContentInsets={false}
                  contentInset={{bottom: this.state.keyboardSpace}}/>
    )
  }
}

class AddTask extends Component {
  answerChoices = [{label: "Multiple Choice", value: "mc"},
    {label: "Short Answer", value: "sa"},
    {label: "Checkboxes", value: "cb"}];

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
        <View style={{flex: 1}}>
          <FlatListKeyboard
              keyboardShouldPersistTaps={"handled"}
              extraScrollHeight={-70}
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
                        this.setState(
                            {questions, selectedQuestionIndex: index});
                      }}
                  />)}/>
        </View>
    )
  }
}

const questions = [
  {
    id: "0",
    text: "What do you love about SCOG?",
    type: "shortAnswer",
    required: true
  },
  {
    id: "1",
    text: "What do you hate about SCOG?",
    type: "shortAnswer",
    required: true
  },
  {
    id: "2",
    text: "Who is the MVP?",
    type: "multipleChoice",
    required: true,
    options: ["Rohit", "Ben", "Greg", "Other"]
  },
  {
    id: "3",
    text: "Who is the 4th man?",
    type: "multipleChoice",
    required: true,
    options: ["Julien", "Morey", "Tierney", "Other"]
  },
  {
    id: "4",
    text: "Which sports did you like?",
    type: "checkbox",
    required: true,
    options: ["Soccer", "Volleyball", "Basketball", "Badminton", "Smash"]
  },
  {
    id: "5",
    text: "Which sports did you not like?",
    type: "checkbox",
    required: true,
    options: ["Soccer", "Volleyball", "Basketball", "Badminton", "Smash"]
  }
];

class Form extends Component {
  state = {
    initialValues: {},
    validationSchema: {}
  };

  componentDidMount() {
    const initialValues = {};
    const validationSchema = {};
    questions.forEach(q => {
      if (q.type === "shortAnswer") {
        initialValues[q.id] = "";
      } else if (q.type === "multipleChoice") {
        initialValues[q.id] = "";
      } else if (q.type === "checkbox") {
        initialValues[q.id] = [];
      }
      validationSchema[q.id] = Yup.string();
      if (q.required) {
        validationSchema[q.id] = validationSchema[q.id].required(
            "Required");
      }
    });
    this.setState({
      initialValues,
      validationSchema: Yup.object().shape(validationSchema)
    });
  }

  render() {
    if (!Object.entries(this.state.initialValues).length) {
      return null;
    }
    return (
        <Formik initialValues={this.state.initialValues}
            // validationSchema={this.state.validationSchema}
                onSubmit={values => console.log(values)}
                validateOnBlur={false}
                validateOnChange={true}
                validateOnMount={true}
        >
          {({handleChange, handleBlur, handleSubmit, values, setFieldValue, errors, touched, isValid, validateField, ...props}) => {
            return (
                <View>
                  <FlatListKeyboard
                      keyboardShouldPersistTaps={"handled"}
                      extraScrollHeight={-70}
                      keyboardDismissMode={"interactive"}
                      data={questions}
                      ListFooterComponent={
                        <View style={{paddingTop: 20, paddingBottom: 30}}>
                          {Object.keys(errors).length > 0 && <Text style={{
                            paddingBottom: 10,
                            alignSelf: "center",
                            color: "red",
                            fontStyle: "italic"
                          }}>Missing required questions above</Text>}
                          <Button
                              style={{alignSelf: "center"}}
                              onPress={handleSubmit}
                              disabled={Object.keys(errors).length !== 0}
                              title={"Submit"}/>
                        </View>}
                      renderItem={({item: q}) => (
                          <FastField key={q.id} name={q.id}
                                     validate={value => validateQuestion(q,
                                         value)}>
                            {({field, form, meta}) => (
                                <Card key={q.id}
                                      title={
                                        <View>
                                          <View style={{
                                            alignSelf: "center",
                                            flexDirection: "row"
                                          }}>
                                            <Text
                                                style={{fontSize: 20}}>{q.text}</Text>
                                            {q.required && <Text style={{
                                              fontSize: 20,
                                              color: "red"
                                            }}> *</Text>}
                                          </View>
                                          {errors[q.id] && touched[q.id] &&
                                          <Text
                                              style={{
                                                alignSelf: "center",
                                                color: "red",
                                                fontStyle: "italic"
                                              }}>{errors[q.id]}</Text>}
                                          <Divider style={{marginTop: 15}}/>
                                        </View>}>
                                  {q.type === "shortAnswer" ? <View
                                          style={{flex: 1}}>
                                        <TextInput onChangeText={handleChange(q.id)}
                                                   onBlur={handleBlur(q.id)}
                                                   value={values[q.id]}
                                                   placeholder={"Your answer here"}
                                                   style={{
                                                     marginTop: 15,
                                                     paddingBottom: 3,
                                                     paddingTop: 0,
                                                     fontSize: 16
                                                   }}/>
                                        <Divider/>
                                      </View> :
                                      q.options.map((option, index) => (
                                          <View key={index} style={{flex: 1}}>
                                            <Button
                                                title={option} type={"clear"}
                                                icon={<Icon name={q.type
                                                === "multipleChoice"
                                                    ? (values[q.id] === option
                                                        ? "circle"
                                                        : "circle-thin")
                                                    :
                                                    (values[q.id].indexOf(
                                                        option)
                                                    !== -1
                                                        ? "square"
                                                        : "square-o")}
                                                            type={"font-awesome"}/>}
                                                onPress={() => {
                                                  if (q.type
                                                      === "multipleChoice") {
                                                    setFieldValue(q.id, option);
                                                  } else {
                                                    const value = values[q.id];
                                                    const i = value.indexOf(
                                                        option);
                                                    if (i !== -1) {
                                                      setFieldValue(q.id,
                                                          value.slice(0,
                                                              i).concat(
                                                              value.slice(
                                                                  i + 1)));
                                                    } else {
                                                      setFieldValue(q.id,
                                                          value.concat(
                                                              [option]));
                                                    }
                                                  }
                                                }}
                                                buttonStyle={{
                                                  padding: 0,
                                                  justifyContent: "flex-start",
                                                  paddingBottom: 10,
                                                  paddingTop: 10
                                                }}
                                                containerStyle={{flex: 1}}
                                                titleStyle={{
                                                  fontSize: 16,
                                                  paddingLeft: 10,
                                                  color: "black"
                                                }}/>
                                            <Divider/>
                                          </View>
                                      ))}
                                </Card>
                            )}
                          </FastField>
                      )}
                  >
                  </FlatListKeyboard>
                </View>
            )
          }}
        </Formik>
    )
  }
}

const validateQuestion = (question, value) => {
  if (question.required && !value.length) {
    return "Required";
  }
};

class Results extends Component {
  render() {
    const labels = ["Finna", "Gonna", "Super", "Duper"];
    const data = [14, 56, 23, 44];
    const max = Math.max(...data);
    const sum = data.reduce((a, b) => a + b, 0);
    return (
        <SafeAreaView style={{display: "flex", flexDirection: "row"}}>
          <View style={{maxWidth: 100}}>
            {labels.map(label => <View style={{
              height: 50,
              justifyContent: "center",
              padding: 5
            }}><Text>{label}</Text></View>)}
          </View>
          <View style={{flex: 1}}>
            {data.map(bar => {
              return <View style={{
                flex: 1,
                margin: 5,
                height: 50,
                flexDirection: "row"
              }}>
                <View style={{flex: bar / max, backgroundColor: "pink"}}/>
                <View style={{
                  maxWidth: 100,
                  justifyContent: "center"
                }}><Text>{bar} ({(bar * 100 / sum).toFixed(2)}%)</Text></View>
                <View style={{
                  flex: 1 - bar / max,
                  backgroundColor: "transparent"
                }}/>
              </View>
            })}
          </View>
        </SafeAreaView>
    )
  }
}

class TasksContent extends Component {
  state = {
    selectedIndex: 0
  };

  render() {
    return (
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
              data={(() => {
                const columns = Math.round(Dimensions.get("window").width / 150) - 1;
                let lastRowCols = cards.length % columns;
                while (lastRowCols > 0 && lastRowCols < columns) {
                  cards.push({empty: true});
                  lastRowCols += 1;
                }
                return cards;
              })()}
              numColumns={Math.round(Dimensions.get("window").width / 150) - 1}
              renderItem={({item}) => {
                console.log(item);
                if (item.empty) return <View style={{flex: 1, padding: 15}}/>;
                else return (
                  item ? <TouchableWithoutFeedback
                      onPress={() => this.props.navigation.navigate("Form")}>
                    <Card
                        title={item.title}
                        image={item.image}
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
                      <Text
                          style={{textAlign: "center"}}>{item.description}</Text>
                    </Card>
                  </TouchableWithoutFeedback> : null)}
              }
              keyExtractor={item => item.key}
          />
        </View>
    )
  }
}

export default class Tasks extends Component {
  render() {
    return (
        <NavigationContainer>
          <FullStack.Navigator>
            <FullStack.Screen name={"Tasks Home"}
                              options={{headerShown: false}}>
              {props => <TasksStack.Navigator mode={"modal"}>
                <TasksStack.Screen name={"Tasks"} component={TasksContent}
                                   options={({navigation}) => ({
                                     headerRight: () => (<Icon
                                         color={"blue"}
                                         name={"create"}
                                         size={14}
                                         raised
                                         iconStyle={{fontSize: 20}}
                                         containerStyle={{marginRight: 15}}
                                         reverse
                                         onPress={() => navigation.navigate(
                                             "New Task")}/>)
                                   })}/>
                <TasksStack.Screen name={"New Task"} component={AddTask}
                                   options={{
                                     headerLeft: ({onPress}) => (
                                         <Button title={"Cancel"}
                                                 onPress={onPress}
                                                 type={"clear"}
                                                 titleStyle={{color: "red"}}/>)
                                   }}/>
              </TasksStack.Navigator>}
            </FullStack.Screen>
            <FullStack.Screen name={"Form"} component={Results}/>
          </FullStack.Navigator>
        </NavigationContainer>
    )
  }
}

const cards = [
  {
    title: "Availability",
    image: require("./images/clock.jpg"),
    description: "Input your availability for the summer",
    key: "0",
    screen: "Form"
  },
  {
    title: "Form",
    description: "Give your suggestions",
    image: require("./images/question.jpg"),
    screen: "Form",
    key: "1"
  },
  {
    title: "Results",
    description: "See the results",
    key: "2",
    image: require("./images/question.jpg"),
    screen: "Form"
  },
  {
    title: "Results",
    description: "See the results",
    key: "3",
    image: require("./images/question.jpg"),
    screen: "Form"
  },{
    title: "Availability",
    image: require("./images/clock.jpg"),
    description: "Input your availability for the summer",
    key: "4",
    screen: "Form"
  },
  {
    title: "Form",
    description: "Give your suggestions",
    image: require("./images/question.jpg"),
    screen: "Form",
    key: "5"
  },
  {
    title: "Results",
    description: "See the results",
    key: "6",
    image: require("./images/question.jpg"),
    screen: "Form"
  }
];

const buttonGroupSelectedColor = "#2089dc";
const buttonGroupDisabledColor = "grey";
