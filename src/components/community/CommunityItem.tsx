import React, { useState } from 'react'
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { View } from 'react-native'
import { SettingsScreenNavigationProp } from '../router/Router';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { formatDate } from '@/utils/date';
import useStore from '@/store/store';
import { setLikeCommunitySpb } from '@/supaBase/api/community';
import Carousel, { ICarouselInstance, Pagination } from "react-native-reanimated-carousel";
import { useSharedValue } from 'react-native-reanimated';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
const width = Dimensions.get('screen').width

const CommunityItem = ({id}: {id: number}) => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const {setCommunities, communities, userInfo} = useStore();
  const item = {...communities.find((el: Community) => el.id === id)}
  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  const [showFullText, setShowFullText] = useState(false);
  const [isContentLong, setIsContentLong] = useState(false); // 긴 글인지 여부
  const [textLayoutLines, setTextLayoutLines] = useState(0); // 실제 텍스트 라인 수
  
  const handleMove = (id: number) => {
    navigation.navigate("CommunityDetail", { CommunityId: id });
  };

  const handleLike = async() => {
    const res = await setLikeCommunitySpb(userInfo.user_id, item.id, !!item.is_liked)
    if(res) {
      const newCommunities = communities.map((el: Community) =>{
        return el.id === item.id ? 
          {...el, is_liked: !item.is_liked, like_count: !!item.is_liked ? item.like_count - 1 : item.like_count + 1} :
          el
      });
      setCommunities(newCommunities);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        {
          item.profile ?
          <Image source={{uri: item.profile}} style={styles.profileImage}/> :
          <Icon name="account-circle" size={44} color="#AEB6B9" style={{marginRight: 4}}/>
        }
        <Text style={styles.nickname}>{item.nickname}</Text>
      </View>
      {
        item?.images?.length ? 
        <View>
          <Carousel
            loop={false}
            data={item?.images}
            renderItem={({ item }: {item: string}) => {
              return (
                <Image
                  source={{uri: item}}
                  style={styles.thumbImage}
                />
              );
            }}
            width={width}
            height={width - 28} 
            onProgressChange={progress}
          />
          <Pagination.Basic
            progress={progress}
            data={item?.images ? item?.images : []}
            dotStyle={{ backgroundColor: "rgba(0,0,0,0.1)", borderRadius: 100 }}
            containerStyle={{ gap: 5, marginTop: 10 }}
          />
        </View>:
        <View></View>
      }
      <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
      {/* <Text style={styles.contents} numberOfLines={2}>{item.contents}</Text> */}
      <Text
        style={styles.contents}
        numberOfLines={showFullText ? undefined : 2} // 전체 표시 여부에 따라 라인 제한
        onTextLayout={(e) => {
          const {lines} = e.nativeEvent;
          setTextLayoutLines(lines.length); // 현재 표시된 라인 수 저장
          setIsContentLong(lines.length > 2); // 두 줄 이상이면 긴 글로 설정
        }}
      >
        {item.contents}
      </Text>

            {/* 더보기 버튼: 2줄 이상이고, 전체 글을 표시하지 않을 때만 보여줌 */}
            {isContentLong && !showFullText && (
        <TouchableOpacity onPress={() => setShowFullText(true)}>
          <Text style={styles.moreButton}>더보기</Text>
        </TouchableOpacity>
      )}

      {/* 글 접기 버튼: 전체 글을 표시한 상태에서 보여줌 */}
      {showFullText && (
        <TouchableOpacity onPress={() => setShowFullText(false)}>
          <Text style={styles.moreButton}>접기</Text>
        </TouchableOpacity>
      )}



      <View style={{flexDirection: 'row', marginTop: 16, justifyContent: 'space-between', alignContent: 'center', alignItems: 'center'}}>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}} onPress={handleLike}>
            <Icon name={item.is_liked ? 'heart' : 'heart-outline'} size={24} color={item.is_liked ? 'red' : '#AEB6B9'} style={{marginRight: 2}}/>
            <Text>{item.like_count}</Text>
          </TouchableOpacity>
          <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 8}}>
            <Icon name="comment-outline" size={24} color="#AEB6B9" style={{marginRight: 2, lineHeight: 24}}/>
            <Text>{item.reply_count}</Text>
          </View> 
        </View>
        <Text style={{lineHeight: 24}}>{formatDate(item.create_date).split(' ')[0]}</Text>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    margin: 4,
    marginHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#fff",
    padding: 16
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 40, 
    height: 40, 
    marginRight: 8, 
    borderRadius: 100
  },
  nickname: {
    color: "#333",
    fontSize: 14,
    fontWeight: "500"
  },
  thumbImage: {
    width: width - 56,
    height: width - 56,
    resizeMode: "cover",
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    marginVertical: 8
  },
  contentContainer: {},
  title: {
    color: "#333",
    fontSize: 18,
    fontWeight: 'bold',  
  },
  contents: {
    fontSize: 16,
    color: '#333',
    marginTop: 4
  },
  moreButton: {
    fontSize: 14,
    color: '#1e90ff',
    marginTop: 5,
  },
});

export default CommunityItem