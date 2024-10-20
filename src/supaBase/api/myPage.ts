import uuid from "react-native-uuid";
import supabase from "../supabaseClient";
import { showInfo } from "./alert";
import { getSignInUserId } from "./auth";

// 회원 정보 조회 API 함수
export const getUserSpb = async (
  boolean: boolean = true
): Promise<UserEditData | void> => {
  try {
    const uid = await getSignInUserId();

    if (!uid) {
      showInfo("error", "uid 값을 찾지 못했습니다.");
      return;
    }
    const { data, error } = await supabase
      .from("profile")
      .select("*")
      .eq("user_id", uid)
      .single();

    if (error) {
      showInfo("error", error.message);
      return;
    }

    return data;
  } catch (error) {
    showInfo("error", (error as Error).message);
    return;
  }
};

// 회원 정보 수정 API 함수
export const setUserSpb = async ({
  nickname,
  email,
  introduce,
}: {
  nickname: string;
  email: string;
  introduce: string;
}): Promise<boolean> => {
  try {
    const uid = await getSignInUserId();
    if (!uid) {
      showInfo("error", "uid 값을 찾지 못했습니다.");
      return false;
    }

    const { error } = await supabase
      .from("profile")
      .update({ nickname, email, introduce })
      .eq("user_id", uid);

    if (error) {
      showInfo("error", error.message);
      return false;
    }

    showInfo("success", "프로필 수정에 성공하였습니다.");
    return true;
  } catch (error) {
    showInfo("error", (error as Error).message);
    return false;
  }
};

export const uploadImageSpb = async (image: ImageFile, isProfileBucket: boolean): Promise<string> => {
  const bucket = isProfileBucket ? "profileBucket" : "communityBucket"
  const path = isProfileBucket ? 'profile-images/' : ''
  const { error: uploadError } = await supabase.storage
    .from(bucket) // 버킷 이름
    .upload(`${path}${image.name}`, image, {
      contentType: image.type,
    });

  if (uploadError) {
    console.error("업로드 오류:", uploadError.message);
    return "";
  }

  // 파일의 URL 생성
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(`${path}${image.name}`);

  return data.publicUrl;
};

export const setProfileImagePathSpb = async (profile, uid) => {
  // profile 테이블의 profile 컬럼을 업데이트합니다.
  const { data, error } = await supabase
    .from("profile")
    .update({ profile })
    .eq("user_id", uid);
  if (error) {
    showInfo("error", "프로필 이미지 업로드 하는데 실패하였습니다.");
    return false;
  }
  showInfo("success", "프로필 이미지가 성공적으로 업데이트되었습니다.");
  return true;
};


export const addProfileSpb = async ({nickname, introduce, profile}: User) => {
  return await supabase
  .from("profile")
  .insert({ nickname, introduce, profile });
}

export const updateProfileSpb = async ({nickname, introduce, profile, user_id}: User) => {
  return await supabase
  .from("profile")
  .update({ nickname, introduce, profile })
  .eq("user_id", user_id);
}