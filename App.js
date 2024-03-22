import { StatusBar } from "expo-status-bar";
import { Button, View, Image, Text, Share } from "react-native";
import { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";

export default function App() {
  //State tradicional para armazenarf a referência da foto (quando existir)
  const [foto, setFoto] = useState(null);

  //State de checagem de permissão de uso (através do hook useCameraPermission)
  const [status, requestPermission] = ImagePicker.useCameraPermissions();

  useEffect(() => {
    async function verificaPermissoes() {
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      requestPermission(cameraStatus === "granted");
    }
  });

  const escolherFoto = async () => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5,
    });
    if (!resultado.canceled) {
      setFoto(resultado.assets[0].uri);
    }
  };
  console.log(foto);

  const acessarCamera = async () => {
    const imagem = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      aspect: [16, 9],
      quality: 0.5,
    });
    if (!imagem.canceled) {
      await MediaLibrary.saveToLibraryAsync(imagem.assets[0].uri);
      setFoto(imagem.assets[0].uri);
    }
  };

  const compartilharFoto = () => {
    Share.share({
      message: "Verifique a imagem!",
      url: foto.uri,
    });
  };
  return (
    <>
      <StatusBar />
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Button onPress={escolherFoto} title="Escolher foto" />
        <Button onPress={acessarCamera} title="Tirar uma nova foto" />

        {foto && (
          <View>
            <Image source={{ uri: foto }} style={{ width: 300, height: 300 }} />
            <Button onPress={compartilharFoto} title="Compartilhar foto" />
          </View>
        )}
      </View>
    </>
  );
}
