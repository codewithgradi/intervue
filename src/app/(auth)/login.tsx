import LoginPage from "@/components/ui/login";
import { StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function LoginScreen() {
  return (
    <SafeAreaProvider style ={styles.container}>
      <LoginPage  />
    </SafeAreaProvider>
  );
}


const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:"center",
    alignItems:"center"
  }
})