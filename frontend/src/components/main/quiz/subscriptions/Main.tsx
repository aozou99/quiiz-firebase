import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase/app";
import "firebase/auth";
import { GuestDescription } from "components/common/content/GuestDescription";
import SubscriptionsIcon from "@material-ui/icons/Subscriptions";
import { SubscChannels } from "components/main/quiz/subscriptions/sub/SubscChannels";

const Main: React.FC = () => {
  const [user, loading] = useAuthState(firebase.auth());

  return (
    <>
      {!loading && user && <SubscChannels />}
      {!loading && !user && (
        <GuestDescription
          icon={<SubscriptionsIcon style={{ fontSize: 120 }} color="action" />}
          title="新作クイズをお見逃しなく"
          caption="ログインすると、お気に入りのチャンネルの最新情報をチェックできます"
        />
      )}
    </>
  );
};

export default Main;
