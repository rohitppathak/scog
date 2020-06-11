import React, {Component} from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Keyboard,
  RefreshControl,
  SafeAreaView,
  ScrollView,
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
import {FastField, Formik} from "formik";
import {Info} from "./Info";
import axios from "axios";
import moment from 'moment';
import {HOST} from "./env";

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
                       value={this.props.title}
                       onChangeText={this.props.changeTitle}
                       onFocus={() => this.props.selectQuestion()}/>
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
        title: "",
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
              ListFooterComponent={
                <Button title={"Submit Task"} containerStyle={{padding: 15}}
                        onPress={async () => {
                          const questions = this.state.questions.map(q => {
                            return q.answerStyle === "sa" ?
                                {
                                  answerStyle: q.answerStyle,
                                  required: q.required,
                                  title: q.title
                                } :
                                {
                                  answerStyle: q.answerStyle,
                                  required: q.required,
                                  options: q.options,
                                  title: q.title
                                };
                          });
                          const task = {
                            type: "Form",
                            description: "Give your suggestions",
                            authorId: this.props.userId,
                            createdDate: Date(),
                            questions
                          };
                          const createdTask = (await axios.post(`${HOST}/tasks`,
                              task)).data;
                          const result = (await axios.put(
                              `${HOST}/users/${createdTask._id}`)).data;
                          this.props.navigation.goBack();
                        }}/>
              }
              renderItem={({item, index}) =>
                  (<Question
                      key={index}
                      selected={index === this.state.selectedQuestionIndex}
                      answerStyle={item.answerStyle}
                      title={item.title}
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
                      changeTitle={text => {
                        item.title = text;
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

class Form extends Component {
  state = {
    initialValues: {},
    validationSchema: {}
  };

  componentDidMount() {
    const initialValues = {};
    const task = this.props.route.params.task
        || this.props.route.params.notification.data.task;
    task.questions.forEach(q => {
      if (q.answerStyle === "sa") {
        initialValues[q._id] = task.completed ? task.answers[q._id] : "";
      } else if (q.answerStyle === "mc") {
        initialValues[q._id] = task.completed ? task.answers[q._id] : "";
      } else if (q.answerStyle === "cb") {
        initialValues[q._id] = task.completed ? task.answers[q._id] : [];
      }
    });
    this.setState({
      initialValues
    });
  }

  render() {
    if (!Object.entries(this.state.initialValues).length) {
      return null;
    }
    const task = this.props.route.params.task
        || this.props.route.params.notification.data.task;
    const questions = task.questions;
    const userId = this.props.route.params.userId;
    return (
        <Formik initialValues={this.state.initialValues}
                onSubmit={async (values, {setSubmitting}) => {
                  setSubmitting(true);
                  const result = (await axios.post(
                      `${HOST}/users/${userId}/tasks/${task._id}`,
                      values)).data;
                  setSubmitting(false);
                  this.props.navigation.goBack();
                }}
                validateOnBlur={false}
                validateOnChange={true}
                validateOnMount={true}
        >
          {({handleChange, handleBlur, handleSubmit, values, setFieldValue, errors, touched, isValid, validateField, ...props}) => {
            return (
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
                            title={task.completed ? "Edit Answers"
                                : "Submit"}/>
                      </View>}
                    renderItem={({item: q}) => {
                      return (
                          <FastField key={q._id} name={q._id}
                                     validate={value => validateQuestion(q,
                                         value)}>
                            {({meta}) => (
                                <SafeAreaView>
                                  <Card title={
                                    <View>
                                      <View style={{
                                        alignSelf: "center",
                                        flexDirection: "row"
                                      }}>
                                        <Text
                                            style={{fontSize: 20}}>{q.title}</Text>
                                        {q.required && <Text style={{
                                          fontSize: 20,
                                          color: "red"
                                        }}> *</Text>}
                                      </View>
                                      {meta.error && meta.touched &&
                                      <Text
                                          style={{
                                            alignSelf: "center",
                                            color: "red",
                                            fontStyle: "italic"
                                          }}>{meta.error}</Text>}
                                      <Divider style={{marginTop: 15}}/>
                                    </View>}>
                                    {q.answerStyle === "sa" ? <View
                                            style={{flex: 1}}>
                                          <TextInput
                                              onChangeText={handleChange(q._id)}
                                              onBlur={handleBlur(q._id)}
                                              value={meta.value}
                                              placeholder={"Your answer here"}
                                              style={{
                                                marginTop: 15,
                                                paddingBottom: 3,
                                                paddingTop: 0,
                                                fontSize: 16
                                              }}/>
                                          <Divider/>
                                        </View> :
                                        q.options.map((option, optionIndex) => (
                                            <View key={optionIndex}
                                                  style={{flex: 1}}>
                                              <Button
                                                  title={option} type={"clear"}
                                                  icon={<Icon
                                                      name={q.answerStyle
                                                      === "mc"
                                                          ? (meta.value
                                                          === option
                                                              ? "circle"
                                                              : "circle-thin")
                                                          :
                                                          (meta.value.indexOf(
                                                              option)
                                                          !== -1
                                                              ? "square"
                                                              : "square-o")}
                                                      type={"font-awesome"}/>}
                                                  onPress={() => {
                                                    if (q.answerStyle
                                                        === "mc") {
                                                      setFieldValue(q._id,
                                                          option);
                                                    } else {
                                                      const i = meta.value.indexOf(
                                                          option);
                                                      if (i !== -1) {
                                                        setFieldValue(q._id,
                                                            meta.value.slice(0,
                                                                i).concat(
                                                                meta.value.slice(
                                                                    i + 1)));
                                                      } else {
                                                        setFieldValue(q._id,
                                                            meta.value.concat(
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
                                                    paddingRight: 20,
                                                    color: "black",
                                                    textAlign: "left"
                                                  }}/>
                                              <Divider/>
                                            </View>
                                        ))}
                                  </Card>
                                </SafeAreaView>
                            )}
                          </FastField>
                      )
                    }}
                >
                </FlatListKeyboard>
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
  state = {
    responseInfoOpen: false,
    submitted: [],
    notSubmitted: [],
    questionMap: {},
    refreshing: false
  };

  async fetchData() {
    const task = this.props.route.params.task
        || this.props.route.params.notification.data.task;
    const {submitted, notSubmitted, questionMap} = (await axios.get(
        `${HOST}/tasks/${task._id}`)).data;
    this.setState({submitted, notSubmitted, questionMap});
  }

  async refresh() {
    this.setState({refreshing: true});
    await this.fetchData();
    this.setState({refreshing: false});
  }

  async componentDidMount() {
    await this.fetchData();
  }

  render() {
    const task = this.props.route.params.task
        || this.props.route.params.notification.data.task;
    const authorId = task.authorId;
    const userId = this.props.route.params.userId;
    return (
        <FlatList
            refreshControl={<RefreshControl refreshing={this.state.refreshing}
                                            onRefresh={this.refresh.bind(
                                                this)}/>}
            ListHeaderComponent={(
                <SafeAreaView>
                  <Card
                      title={<Button containerStyle={this.state.responseInfoOpen
                      && {
                        borderBottomWidth: 1,
                        borderColor: "lightgray",
                        paddingBottom: 10
                      }} type={"clear"} title={"Response Information"}
                                     onPress={() => this.setState(
                                         {responseInfoOpen: !this.state.responseInfoOpen})}/>}>
                    {this.state.responseInfoOpen &&
                    <View>
                      <View style={{flexDirection: "row"}}>
                        <View style={{
                          borderRightWidth: 1,
                          borderColor: "lightgray",
                          padding: 10,
                          justifyContent: "center",
                          width: 120
                        }}>
                          <Text style={{
                            textAlign: "center",
                            fontSize: 18,
                            fontWeight: "bold"
                          }}>Answered</Text>
                        </View>
                        <View>
                          {this.state.submitted.length
                              ? this.state.submitted.map(
                                  submittedUser =>
                                      <View key={submittedUser.id} style={{
                                        padding: 10
                                      }}>
                                        <Text style={{
                                          fontSize: 18
                                        }}>{submittedUser.id === userId ? "You"
                                            : submittedUser.name}</Text>
                                      </View>) :
                              <View style={{
                                padding: 10
                              }}>
                                <Text style={{
                                  fontSize: 18,
                                  fontStyle: "italic",
                                  color: "#c6c6c6"
                                }}>No Users</Text>
                              </View>}
                        </View>
                      </View>
                      <View style={{
                        flexDirection: "row",
                        borderTopWidth: 1,
                        borderBottomWidth: 1, borderColor: "lightgray"
                      }}>
                        <View style={{
                          borderRightWidth: 1,
                          borderColor: "lightgray",
                          padding: 10,
                          justifyContent: "center",
                          width: 120
                        }}>
                          <Text style={{
                            textAlign: "center",
                            fontSize: 18,
                            fontWeight: "bold"
                          }}>Incomplete</Text>
                        </View>
                        <View>
                          {this.state.notSubmitted.length
                              ? this.state.notSubmitted.map(
                                  notSubmittedUser =>
                                      <View key={notSubmittedUser.id} style={{
                                        padding: 10
                                      }}>
                                        <Text style={{
                                          fontSize: 18
                                        }}>{notSubmittedUser.id === userId
                                            ? "You"
                                            : notSubmittedUser.name}</Text>
                                      </View>) :
                              <View style={{
                                padding: 10
                              }}>
                                <Text style={{
                                  fontSize: 18,
                                  fontStyle: "italic",
                                  color: "#c6c6c6"
                                }}>No Users</Text>
                              </View>}
                        </View>
                      </View>
                    </View>}
                  </Card>
                </SafeAreaView>
            )}
            ListFooterComponent={authorId === userId && (
                <SafeAreaView style={{paddingTop: 15, flexDirection: "row"}}>
                  <View style={{flex: 1}}/>
                  <Button type={"clear"} title={"Delete Form"}
                          titleStyle={{color: "red"}}
                          onPress={() => Alert.alert("Confirm delete",
                              "Are you sure you want to delete this task?",
                              [{
                                text: "Cancel",
                                style: "cancel"
                              },
                                {
                                  text: "Delete",
                                  style: "destructive",
                                  onPress: async () => {
                                    await axios.delete(
                                        `${HOST}/tasks/${task._id}`);
                                    this.props.navigation.goBack();
                                  }
                                }])}/>
                  <View style={{flex: 1}}/>
                </SafeAreaView>
            )}
            data={this.state.notSubmitted.some(
                notSubmittedUser => notSubmittedUser.id === userId) ? []
                : Object.entries(this.state.questionMap)}
            renderItem={({item}) => {
              const questionId = item[0];
              const questionInfo = item[1];
              const labels = Object.keys(questionInfo.options);
              const data = Object.values(questionInfo.options);
              const max = Math.max(...data);
              const sum = data.reduce((a, b) => a + b, 0);
              return (
                  <SafeAreaView style={{zIndex: 0}}>
                    <Card containerStyle={{zIndex: 0}} key={questionId}
                          title={questionInfo.title}>
                      {sum === 0 ? <Text
                              style={{
                                textAlign: "center",
                                fontStyle: "italic",
                                color: "#cdcdcd"
                              }}>No
                            Responses</Text> :
                          <SafeAreaView
                              style={{display: "flex", flexDirection: "row"}}>
                            <View style={{maxWidth: "30%"}}>
                              {labels.map((label, optionIndex) =>
                                  <View key={optionIndex} style={{
                                    height: 50,
                                    justifyContent: "center",
                                    margin: 5,
                                    zIndex: labels.length - optionIndex
                                  }}>
                                    <Info
                                        label={() => <Text
                                            style={{textAlign: "right"}}
                                            numberOfLines={2}>{label}</Text>}
                                        body={() => <View style={{
                                          position: "absolute",
                                          backgroundColor: "black",
                                          right: 5,
                                          padding: 5,
                                          overflow: "scroll"
                                        }}><Text
                                            style={{color: "white"}}>{label}</Text></View>}
                                    />
                                  </View>)}
                            </View>
                            <View style={{flex: 1, borderLeftWidth: 1}}>
                              {data.map((bar, barIndex) => {
                                return <View key={barIndex} style={{
                                  flex: 1,
                                  marginVertical: 5,
                                  height: 50,
                                  flexDirection: "row"
                                }}>
                                  <View style={{
                                    flex: max ? bar / max : max,
                                    backgroundColor: "pink",
                                    marginVertical: 10
                                  }}/>
                                  <View style={{
                                    maxWidth: 100,
                                    justifyContent: "center",
                                    paddingLeft: 5
                                  }}><Text>{bar} ({(bar * 100 / sum).toFixed(
                                      0)}%)</Text></View>
                                  <View style={{
                                    flex: 1 - (max ? bar / max : max),
                                    backgroundColor: "transparent"
                                  }}/>
                                </View>
                              })}
                            </View>
                          </SafeAreaView>
                      }
                    </Card>
                  </SafeAreaView>
              )
            }}/>
    )
  }
}

const months = ["June", "July", "August"];
const monthDays = [30, 31, 31];
const monthIndices = [5, 6, 7];
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const calendars = [];
months.forEach((month, monthIndex) => {
  const firstDay = new Date(2020, monthIndices[monthIndex], 1).getDay();
  const calendar = [];
  let counter = 1;
  for (let row = 0; row < 6 && counter <= monthDays[monthIndex]; row++) {
    calendar[row] = [];
    for (let col = 0; col < 7; col++) {
      calendar[row][col] = -1;
      if (row === 0 && col >= firstDay) {
        // Fill in rows only after the first day of the month
        calendar[row][col] = counter++;
      } else if (row > 0 && counter <= monthDays[monthIndex]) {
        // Fill in rows only if the counter's not greater than
        // the number of days in the month
        calendar[row][col] = counter++;
      }
    }
  }
  calendars[monthIndex] = calendar;
});

class Availability extends Component {
  state = {
    selectedDays: {}
  };

  handlePress({monthIndex, day}) {
    monthIndex = monthIndices[monthIndex];
    const selector = `${monthIndex}-${day}`;
    const currentStatus = this.state.selectedDays[selector];
    const nextStatus = currentStatus ? null : {month: monthIndex, day};
    this.setState({selectedDays: {...this.state.selectedDays, [selector]: nextStatus}});
  }

  handleLongPress({monthIndex, day}) {
    monthIndex = monthIndices[monthIndex];
    const asArray = Object.entries(this.state.selectedDays);
    const [lastInsertedSelector, lastInsertedValue] = asArray[asArray.length - 1];
    const toInsert = {};
    let insertedDay = lastInsertedValue.day;
    while (insertedDay <= day) {
      toInsert[`${monthIndex}-${insertedDay}`] = {month: monthIndex, day: insertedDay};
      insertedDay += 1;
    }
    this.setState({selectedDays: {...this.state.selectedDays, ...toInsert}});
  }

  render() {
    const today = new Date();
    const todayMonthIndex = today.getMonth();
    const todayDateIndex = today.getDate();
    return (
        <SafeAreaView>
          <ScrollView>
            {calendars.map((calendar, monthIndex) => (
                <Card title={months[monthIndex]}
                      dividerStyle={{marginBottom: 0}}
                      containerStyle={{padding: 0, paddingTop: 15}}>
                  <View style={{
                    flexDirection: "row",
                    display: "flex"
                  }}>
                    {days.map((day, dayIndex) => (
                        <View style={{
                          flex: 1,
                          aspectRatio: 1,
                          justifyContent: "center",
                          borderRightWidth: dayIndex === 6 ? 0 : 1,
                          borderColor: "lightgray"
                        }}>
                          <Text style={{textAlign: "center"}}>
                            {day}
                          </Text>
                        </View>))}
                  </View>
                  {calendar.map(week => (
                      <View style={{
                        flexDirection: "row",
                        display: "flex",
                        borderTopWidth: 1,
                        borderColor: "lightgray"
                      }}>
                        {week.map((day, dayIndex) => (
                            <View style={{
                              flex: 1,
                              aspectRatio: 1,
                              justifyContent: "center",
                              borderRightWidth: dayIndex === week.length - 1 ? 0
                                  : 1,
                              borderColor: "lightgray"
                            }}>
                              <Button
                                  type={"clear"}
                                  disabled={todayMonthIndex
                                  >= monthIndices[monthIndex] && todayDateIndex
                                  > day || day === -1}
                                  onPress={() => this.handlePress({monthIndex, day})}
                                  onLongPress={() => this.handleLongPress({monthIndex, day})}
                                  buttonStyle={{
                                    backgroundColor: this.state.selectedDays[`${monthIndices[monthIndex]}-${day}`]
                                        ? "lightblue" : "white",
                                    textAlign: "center",
                                    height: "100%"
                                  }}
                                  titleStyle={{
                                    color: todayMonthIndex
                                    >= monthIndices[monthIndex]
                                    && todayDateIndex > day ? "lightgray"
                                        : "black",
                                  }}
                                  title={day === -1 ? "" : day}>
                              </Button>
                            </View>))}
                      </View>
                  ))}
                </Card>))}
          </ScrollView>
        </SafeAreaView>
    )
  }
}

class TasksContent extends Component {
  state = {
    cards: [],
    userMap: {},
    selectedIndex: 0,
    refreshing: false,
    columns: Math.round(deviceWidth() / 150) - 1
  };

  handleNotification() {
    const {notification} = this.props;
    if (notification) {
      const {data} = notification;
      if (data.page === "TasksContent") {
        this.setState({selectedIndex: data.selectedIndex});
      } else {
        this.props.navigation.push(data.page,
            {notification, userId: this.props.userId});
      }
      this.props.resetNotification();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.notification !== prevProps.notification) {
      this.handleNotification();
    }
  }

  async fetchData() {
    const cards = (await axios.get(
        `${HOST}/users/${this.props.userId}/tasks`)).data;
    const users = (await axios.get(`${HOST}/users`)).data;
    const userMap = {};
    users.forEach(user => userMap[user._id] = user);
    this.setState({cards, userMap});
  }

  async componentDidMount() {
    await this.fetchData.call(this);
    this.willFocus = this.props.navigation.addListener("focus",
        async () => await this.fetchData.call(this));
    Dimensions.addEventListener("change", this.calculateColumns.bind(this));
    this.handleNotification();
  }

  componentWillUnmount() {
    this.willFocus();
    Dimensions.removeEventListener("change", this.calculateColumns);
  }

  async refresh() {
    this.setState({refreshing: true});
    await this.fetchData();
    this.setState({refreshing: false});
  }

  cardInfoMessage(card) {
    let message = "";
    if (this.state.userMap[card.authorId]) {
      message += `Created by ${card.authorId
      === this.props.userId ? "you"
          : this.state.userMap[card.authorId].name}${card.createdDate
      && ` ${moment(card.createdDate).fromNow()}`}`;
    } else if (card.createdDate) {
      message += `Created ${moment(
          card.createdDate).fromNow()}`;
    }
    return message;
  }

  calculateColumns() {
    this.setState({columns: Math.round(deviceWidth() / 150) - 1});
  }

  render() {
    const {columns} = this.state;
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
              key={this.state.columns}
              data={(() => {
                const cards = this.state.cards.filter(card => {
                  return (this.state.selectedIndex === 0 && !card.completed) ||
                      (this.state.selectedIndex === 1 && card.completed) ||
                      (this.state.selectedIndex === 2);
                });
                let lastRowCols = cards.length % columns;
                while (lastRowCols > 0 && lastRowCols < columns) {
                  cards.push({empty: true});
                  lastRowCols += 1;
                }
                return cards;
              })()}
              numColumns={columns}
              refreshControl={<RefreshControl refreshing={this.state.refreshing}
                                              onRefresh={this.refresh.bind(
                                                  this)}/>}
              renderItem={({item, index}) => {
                if (item.empty) {
                  return <View key={index} style={{flex: 1, padding: 15}}/>;
                } else {
                  return (
                      item ? <TouchableWithoutFeedback
                          key={item._id}
                          onPress={() => this.props.navigation.navigate(
                              this.state.selectedIndex !== 2 ? item.type
                                  : "Results", {
                                task: item,
                                userId: this.props.userId
                              })}>
                        <SafeAreaView style={{
                          flex: 1,
                          margin: 0,
                          marginBottom: 15
                        }}>
                          <Card
                              title={item.type}
                              image={cardTypeMap[item.type].image}
                              imageProps={{
                                style: {
                                  width: "100%",
                                  aspectRatio: 1
                                }
                              }}
                              containerStyle={{
                                flex: 1
                              }}
                          >
                            <View>
                              <Text
                                  style={{}}>{item.description}</Text>
                              <Text
                                  style={{
                                    paddingTop: 5,
                                    fontStyle: "italic",
                                    color: "#cdcdcd"
                                  }}>{this.cardInfoMessage.call(this,
                                  item)}</Text>
                            </View>
                          </Card>
                        </SafeAreaView>
                      </TouchableWithoutFeedback> : null)
                }
              }}
              keyExtractor={item => item._id}
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
                <TasksStack.Screen name={"Tasks"}
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
                                   })}>
                  {props => <TasksContent {...props}
                                          notification={this.props.notification}
                                          resetNotification={this.props.resetNotification}
                                          userId={this.props.userId}/>}
                </TasksStack.Screen>
                <TasksStack.Screen name={"New Task"}
                                   options={{
                                     headerLeft: ({onPress}) => (
                                         <Button title={"Cancel"}
                                                 onPress={onPress}
                                                 type={"clear"}
                                                 titleStyle={{color: "red"}}/>)
                                   }}>
                  {props => <AddTask {...props} userId={this.props.userId}/>}
                </TasksStack.Screen>
              </TasksStack.Navigator>}
            </FullStack.Screen>
            <FullStack.Screen name={"Form"} component={Form}/>
            <FullStack.Screen name={"Results"} component={Results}/>
            <FullStack.Screen name={"Availability"} component={Availability}/>
          </FullStack.Navigator>
        </NavigationContainer>
    )
  }
}

const deviceWidth = () => {
  return Dimensions.get("window").width;
};

const cardTypeMap = {
  "Form": {image: require("./images/question.jpg"), screen: "Form"},
  "Availability": {image: require("./images/clock.jpg"), screen: "Form"}
};

const buttonGroupSelectedColor = "#2089dc";
const buttonGroupDisabledColor = "grey";
