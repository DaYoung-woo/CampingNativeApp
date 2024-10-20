import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Linking,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import TopBar from "@/components/common/TopBar";
import CheckCircle from "@/assets/icons/CheckCircle.svg";
import Button from "@/components/common/Button";
const backIcon = require("@/assets/icons/Back.png");

const Camping = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { campingInfo } = route.params as { campingInfo: CampingType };
  const moveCall = (number: string) => {
    Linking.openURL(`tel:${number.split("-").join("")}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TopBar
          leftIcon={backIcon}
          leftClick={navigation.goBack}
          title="캠핑장 상세 정보"
        />
      </View>

      {/* 추가 프로퍼티들 출력 */}
      <ScrollView>
        {campingInfo.firstImageUrl ? (
          <Image
            source={{ uri: `${campingInfo.firstImageUrl}` }}
            style={styles.thumbImage}
          />
        ) : (
          <View style={styles.thumbImage}>
            <Text style={styles.noImageText}>이미지가 없습니다</Text>
          </View>
        )}
        <View>
          <View style={styles.divNmContainer}>
            <Text style={styles.mangeDivNm}>{campingInfo.facltDivNm}</Text>
            <Text style={styles.mangeDivNm}>{campingInfo.mangeDivNm}</Text>
          </View>
          <Text style={styles.addrbox}>
            {campingInfo.addr1} {campingInfo.addr2}
          </Text>
          <Text style={styles.facltNm}>{campingInfo.facltNm}</Text>
          {campingInfo.caravInnerFclty.length ? (
            <View style={styles.caravInnerFcltyContainer}>
              <View style={styles.caravInnerFcltyTitle}>
                <CheckCircle color="#555" width={20} height={20} />
                <Text style={styles.caravInnerFcltyTitleText}>
                  편의 시설/서비스
                </Text>
              </View>
              <Text style={styles.caravInnerFclty}>
                {campingInfo.caravInnerFclty.split(",").join(" ")}
              </Text>
            </View>
          ) : (
            <></>
          )}
          {campingInfo.resveCl ? (
            <>
              <View style={styles.caravInnerFcltyContainer}>
                <View style={styles.caravInnerFcltyTitle}>
                  <CheckCircle color="#555" width={20} height={20} />
                  <Text style={styles.caravInnerFcltyTitleText}>예약 방법</Text>
                </View>
                <Text style={styles.caravInnerFclty}>
                  {campingInfo.resveCl}
                </Text>
              </View>
            </>
          ) : (
            <></>
          )}
        </View>
        <Text style={styles.intro}>{campingInfo.intro}</Text>
      </ScrollView>
      <View style={styles.btnWrapper}>
        <Button label="전화걸기" onPress={() => moveCall(campingInfo.tel)} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  topBar: { backgroundColor: "#fff" },
  thumbImage: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  addrbox: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 16,
    color: "#555",
  },
  divNmContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  facltNm: {
    fontSize: 20,
    paddingHorizontal: 16,
    paddingVertical: 4,
    color: "#000",
    fontWeight: '600'
  },
  mangeDivNm: {
    marginRight: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 100,
    backgroundColor: "#cdd993",
    color: "#386641",
  },
  intro: {
    paddingHorizontal: 16,
    paddingTop: 28,
    paddingBottom: 16,
    fontSize: 16,
    color: "#555",
    marginBottom: 30,
  },
  caravInnerFcltyContainer: {
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  caravInnerFclty: {
    paddingVertical: 4,
    paddingLeft: 4,
    fontSize: 16,
  },
  caravInnerFcltyTitle: {
    flexDirection: "row",
  },
  caravInnerFcltyTitleText: {
    lineHeight: 20,
    color: "#555",
    paddingLeft: 4,
    fontSize: 16,
    fontWeight: '600'
  },
  resveCl: {
    paddingHorizontal: 16,
  },
  btnWrapper: {
    backgroundColor: "#fff",
    height: 88,
    position: "static",
    bottom: 0,
    paddingHorizontal: 12,
    //marginVertical: 8,
    paddingBottom: 8,
  },
  noImageText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    paddingTop: 112,
  },
});
export default Camping;
