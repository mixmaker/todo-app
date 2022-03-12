import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";

const Task = ({ text, completed, index, deleteTask }) => {
  const found = completed.find((element) => element === index);
  return (
    <View style={styles.item}>
      <View style={styles.itemLeft}>
        <View style={styles.square}></View>
        <Text
          style={
            found === undefined
              ? styles.itemText
              : { ...styles.itemText, textDecorationLine: "line-through" }
          }
        >
          {text}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => deleteTask(index)}
        style={styles.circular}
      ></TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  square: {
    width: 24,
    height: 24,
    backgroundColor: "#55bcf6",
    opacity: 0.4,
    borderRadius: 5,
    marginRight: 15,
  },
  itemText: {
    maxWidth: "80%",
  },
  circular: {
    width: 12,
    height: 12,
    borderColor: "#55bcf6",
    borderWidth: 2,
    borderRadius: 5,
  },
});

export default Task;
