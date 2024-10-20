import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  
  Dimensions,
} from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { formatDate } from "@/utils/date";
import { addReplySpb, deleteReplySpb, getReplysSpb, updateReplySpb } from "@/supaBase/api/reply";
import useStore from "@/store/store";
import DynamicTextInput from "../common/DynamicTextInput";

const Replys: React.FC<{ communityId: number }> = ({ communityId }) => {
  const [replys, setReplys] = useState<ReplyType[]>([]);
  const [reply, setReply] = useState('');
  const [editId, setEditId] = useState(0);
  const [editReply, setEditReply] = useState('');
  const {userInfo, setCommunities, communities} = useStore();

  useEffect(() => {
    getReplys();
  }, [communityId]);

  const getReplys = async () => {
    const data = await getReplysSpb(communityId);
    setReplys(data);
  };

  const addReply = async() => {
    const data = await addReplySpb({
      community_id: communityId,
      user_id: userInfo.user_id,
      reply
    });
    if(data) {
      setReplys([data, ...replys])
      setReply('')
      setCommunities(communities.map((el: Community) => el.id === communityId ? {...el, reply_count: el.reply_count + 1} : el))
    }
  }

  const deleteReply = async(id: number) => {
    const data = await deleteReplySpb(id);
    setReplys(replys.filter(el => el.id !== id))
  }

  const updateReply = async() => {
    const data = await updateReplySpb(editId, editReply);
    setReplys(replys.map((el: ReplyType) => el.id === editId ? {...el, reply: editReply} : el))
    setEditId(0)
    setEditReply('')
  }
  
  return (
    <View style={styles.replyContainer}>
      <FlatList
        data={replys}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={
          <View>
            <View style={styles.contentsWrapper}>
              <Text style={styles.title}>댓글</Text>
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <DynamicTextInput setText={setReply} text={reply}/>
              </View>
              <TouchableOpacity style={styles.sendButton} onPress={addReply}>
                <Text style={styles.sendButtonText}>등록</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
        renderItem={({item}) => (
          <View style={styles.commentWrapper}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
              <View style={styles.profileContainer}>
                {
                  item?.profile?.profile ?
                  <Image source={{uri: item?.profile?.profile}} style={styles.profileImage}/> :
                  <Icon name="account-circle" size={36} color="#AEB6B9" style={{marginRight: 4, marginLeft: -2,}}/>
                }
                <Text style={styles.nickname}>{item?.profile?.nickname || ''}</Text>
              </View>
              {
                item.user_id === userInfo.user_id && (
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableOpacity onPress={() => {setEditId(item.id); setEditReply(item.reply)}}>
                      <Icon name="pencil" size={20} color="#169b9a" style={{marginRight: 4}}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteReply(item.id)}>
                      <Icon name="delete" size={20} color="#ef4957" style={{marginRight: 4}}/>
                    </TouchableOpacity>
                  </View>
                )
              }
            </View>
            {
              editId === item.id ? (
                <View>
                  <View style={styles.inputContainer}>
                    <View style={styles.replyInputWrapper}>
                      <DynamicTextInput setText={setEditReply} text={editReply}/>
                    </View>
                    <TouchableOpacity style={styles.sendButton} onPress={updateReply}>
                      <Text style={styles.sendButtonText}>수정</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity onPress={() => {setEditId(0); setEditReply('')}}>
                    <Text style={{paddingLeft: 12, marginTop:4}}>취소</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <Text style={{color: '#333', fontSize: 16}}>{item.reply}</Text>
              )
            }
          </View>
        )}
        style={{paddingBottom: 100}}
      />
    </View>
  );
};

const width = Dimensions.get("window").width; 

const styles = StyleSheet.create({
  replyContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 12,
    paddingTop: 8,
    marginBottom: 12,
  },
  contentsWrapper: {
    marginHorizontal: 12,
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  inputContainer: {
    width: '100%',
    backgroundColor: "#FFF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'flex-start',
    borderRadius: 12,
    marginTop: 8,
  },  
  inputWrapper: {
    width: width - 124, 
    marginLeft: 4,
  },
  sendButton: {
    width: 80,
    alignItems: "center",
    backgroundColor: "#6a994e",
    padding: 14,
    borderRadius: 10,
  },
  sendButtonText: {
    fontWeight: "600",
    fontSize: 16,
    color: "#FFF",
  },
  commentWrapper: {
    marginHorizontal: 8,
    marginTop: 12,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  nickname: {
    color: "#333",
    fontSize: 14,
    fontWeight: "600"
  },
  replyInputWrapper: {
    width: width - 140, 
    marginLeft: 4,
  },
  nickName: {
    color: "#333",
    fontWeight: "500",
  },
  profileImage: {
    width: 32, 
    height: 32, 
    marginRight: 8, 
    borderRadius: 100
  },
});
export default Replys;
