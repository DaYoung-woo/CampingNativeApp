import useStore from "@/store/store";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontistoIcon from 'react-native-vector-icons/Fontisto';
import { SettingsScreenNavigationProp } from "@/types/route";
import { useNavigation } from "@react-navigation/native";


interface TopBarProps {
  leftIcon?: { uri: string } | undefined;
  leftClick?: () => void;
  leftIsProfile?: boolean;
  rightIcon?: React.ReactElement | { uri: string };
  rightClick?: () => void;
  rightIsProfile?: boolean;
  title?: string
}

const TopBar: React.FC<TopBarProps> = ({
  leftIcon,
  leftClick,
  leftIsProfile = false,
  rightIcon,
  rightClick,
  rightIsProfile = false,
  title,
}) => {
  const {userInfo} = useStore();
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  return (
    <View style={styles.wrapper}>
      {leftIcon ? (
        <TouchableOpacity
          onPress={() => {
            if (leftClick) {
              leftClick();
            }
          }}
        >
          {leftIsProfile ? (
            <Image
              source={leftIcon}
              style={[styles.icon, { width: 40, height: 40 }]}
            />
          ) : (
            <Image source={leftIcon} style={styles.icon} />
          )}
        </TouchableOpacity>
      ) : (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <FontistoIcon name="tent" size={28} color="#386641" style={{marginRight: 8}} />
          <Text style={{ fontSize: 18, color: "#386641" }}>캠핑투게더</Text>
        </View>
      )}
      {title && <Text style={styles.title}>{title}</Text>}
      

      {rightIcon || rightIsProfile ? (
        <TouchableOpacity
          onPress={() => {
            if (rightClick) rightClick()
            else navigation.navigate('Profile', {init: false})
          }}
        >
          {rightIsProfile ? (
            userInfo.profile ?
            <Image
              source={{ uri: userInfo.profile }} 
              style={[styles.icon, { width: 36, height: 36 }]}
            />
            : <Icon name="account-circle" size={36} color="#AEB6B9" />
          ) : (
            <>
              {React.isValidElement(rightIcon) ? rightIcon : <Image source={rightIcon as { uri: string }} style={styles.icon} /> }
            </>
          )}
        </TouchableOpacity>
      ) : (
        <View style={styles.iconWrapper}></View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    // 그림자 스타일
    shadowColor: "#000", // 그림자 색상
    shadowOffset: { width: 0, height: 4 }, // 그림자의 위치
    shadowOpacity: 0.3, // 그림자의 투명도
    shadowRadius: 8, // 그림자의 반경
    elevation: 8, // Android에서 그림자 깊이
    zIndex: 1,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 34,
    height: 34,
    borderRadius: 100,
  },
  title: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 16,
  }
});

export default TopBar;
