import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  Keyboard,
  FlatList,
  Alert,
} from "react-native";
import Task from "./components/Task";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppLoading from "expo-app-loading";

export default function App() {
  const [task, setTask] = useState();
  const [taskItems, setTaskItems] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("storedTasks");
      if (JSON.parse(jsonValue).length > 0) {
        setTaskItems(JSON.parse(jsonValue));
      } else {
        setTaskItems([
          "Add a todo to get started",
          "Click on the text to mark as done",
          "Click on the circle at the right to delete",
        ]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddTask = () => {
    if (task) {
      Keyboard.dismiss();
      const newTaskItems = [...taskItems, task];
      AsyncStorage.setItem("storedTasks", JSON.stringify(newTaskItems))
        .then(() => {
          setTaskItems(newTaskItems);
          setTask(null);
        })
        .catch((err) => console.log(err));
    } else {
      Alert.alert(
        "Cannot add empty task",
        "Please write something to add as task",
        [{ text: "ok", style: "cancel" }]
      );
    }
  };

  const completeTask = (indexno) => {
    const find = completed.includes(indexno);
    if (find === false) setCompleted([...completed, indexno]);
    else if (find === true) {
      completed.splice(completed.indexOf(indexno), 1);
      setCompleted([...completed]);
    }
  };
  const deleteTask = (index) => {
    taskItems.splice(index, 1);
    AsyncStorage.setItem("storedTasks", JSON.stringify(taskItems))
      .then(() => {
        setTaskItems([...taskItems]);
      })
      .catch((err) => console.log(err));
  };
  const renderItem = ({ item, index }) => (
    <TouchableOpacity onPress={() => completeTask(index)}>
      <Task
        text={item}
        index={index}
        completed={completed}
        deleteTask={deleteTask}
      />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <AppLoading
        startAsync={getData}
        onFinish={() => setLoading(false)}
        onError={console.warn}
      />
    );
  } else {
    return (
      <View style={styles.container}>
        <StatusBar />
        <View style={styles.tasksWrapper}>
          <Text style={styles.sectionTitle}>Today's tasks</Text>
          <View style={styles.items}>
            {taskItems.length > 0 ? (
              <FlatList
                data={taskItems}
                keyExtractor={(item, index) => index}
                renderItem={renderItem}
              />
            ) : (
              <Text>Use the text field at bottom to add a task</Text>
            )}
          </View>
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.writeTextWrapper}
        >
          <TextInput
            style={styles.input}
            placeholder={"Write a task"}
            value={task}
            onChangeText={setTask}
            // doesnt work on press enter
            // onSubmitEditing={(event) => {
            //   console.log(event.nativeEvent.text);
            //   setTask(event.nativeEvent.text);
            // }}
          />
          <TouchableOpacity onPress={handleAddTask}>
            <View style={styles.addWrapper}>
              <Text style={styles.addText}>+</Text>
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e8eaed",
  },
  tasksWrapper: {
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  items: {
    marginTop: 30,
    marginBottom: 120,
  },
  writeTextWrapper: {
    position: "absolute",
    bottom: 15,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    width: 290,
    height: 60,
    backgroundColor: "#fff",
    borderRadius: 60,
    borderColor: "#c0c0c0",
    borderStyle: "solid",
    borderWidth: 1,
    fontSize: 16,
  },
  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: "#fff",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#c0c0c0",
    borderWidth: 1,
  },
  addText: {
    fontSize: 24,
  },
});
