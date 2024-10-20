import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { FlatList, SafeAreaView, StyleSheet, Text } from "react-native";
import { CommunityProps } from "@/types/route";
import { getCommunitiesSpb } from "@/supaBase/api/community";
import TopBar from "@/components/common/TopBar";
import CommunityItem from "@/components/community/CommunityItem";
import useStore from "@/store/store";
import Replys from "@/components/community/Replys";
import SkeletonCommunityItem from "@/components/skeleton/SkeletonCommunityItem";
import BottomSheet from "@/components/common/BottomSheet";

const Community = ({ route }: CommunityProps) => {
  const { setCommunities, communities } = useStore();
  const [refresh, setRefresh] = useState(false);
  const [reached, setReached] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [communityId, setCommunityId] = useState(0);
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef<FlatList>(null); // FlatList의 ref 생성
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (route?.params?.refresh) {
      //pullDown();
      flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
    }
  }, [route?.params?.refresh]);
  
  let isFinish = false

  // callbacks
  const handlePresentModalPress = useCallback((newCommunityId: number) => {
    setCommunityId(newCommunityId);
    setShow(true)
  }, []);

  useEffect(() => {
    fetchCommunitysData();
  }, []);

  const fetchCommunitysData = async (page?: number) => {
    setLoading(true);
    const data = await getCommunitiesSpb(page || pageNo);
    if (data) {
      if(page === 1) setCommunities(data);
      else setCommunities([...communities, ...data]);
      if(data.length < 10) isFinish = true
    } else {
      isFinish = true
    }
    setLoading(false);
  };

  const handleEndReached = () => {
    if(isFinish || reached) return
    setReached(true)
    setPageNo((prev) => {
      fetchCommunitysData(prev + 1);
      return prev + 1;
    });
  };


  const pullDown = async() => {
    setCommunities([])
    setRefresh(true);
    setReached(false);
    await fetchCommunitysData(1);
    setPageNo(1)
    setRefresh(false);
  };

  const skeletonData = Array(5).fill({});

  return (
    <SafeAreaView style={styles.wrapper}>
      <TopBar rightIsProfile={true} />
      <FlatList
        data={loading ? skeletonData : communities}
        keyExtractor={(item, index) =>
          loading ? `skeleton-${index}` : item.id.toString()
        }
        renderItem={({ item }) =>
          loading ? (
            <SkeletonCommunityItem />
          ) : (
            <CommunityItem
              id={item.id}
              handlePresentModalPress={handlePresentModalPress}
            />
          )
        }
        style={{ marginBottom: 70, paddingBottom: 80 }}
        onRefresh={pullDown}
        refreshing={refresh}
        onEndReached={handleEndReached}
        ref={flatListRef}
      />
      <BottomSheet isShow={show} setIsShow={setShow} size={0.9} component={<Replys communityId={communityId} />} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#efefef",
  },
  topWrapper: {
    flexDirection: "row",
    marginHorizontal: 12,
    marginVertical: 6,
    justifyContent: "space-between",
    alignItems: "center",
  },
  userWrapper: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 3,
  },
  iconWrapper: {
    width: 25,
    height: 25,
    backgroundColor: "rgba(87, 51, 83, 0.2)",
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  icon1: {
    width: 15,
    height: 12,
  },
  icon2: {
    width: 15,
    height: 15,
  },
});

export default Community;
