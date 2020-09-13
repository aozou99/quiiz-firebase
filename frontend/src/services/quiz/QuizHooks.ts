import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import { useState, useEffect } from "react";
import imageUrl from "utils/helper/imageUrl";
import { getCounter } from "utils/helper/counter";
import { useAuthState } from "react-firebase-hooks/auth";
import { pagingQuiz } from "services/quiz/pagingQuiz";

type parameters = {
  channelId?: string;
  lastQuizId?: string;
};
export const usePagenateQuiz = (parameters?: parameters) => {
  const [apiOptions, setApiOptions] = useState(parameters);
  const [quizzes, setFirstDocuments] = useState<any>([]);
  const [loaded, setLoaded] = useState(false);
  const [hasNext, setHasNext] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoaded(false);
    pagingQuiz(apiOptions).then((res) => {
      if (mounted) {
        setFirstDocuments((pre: any[]) => [...pre, ...res.quizzes]);
        setHasNext(res.hasNext);
        setLoaded(true);
      }
    });
    return () => {
      mounted = false;
    };
  }, [apiOptions]);

  useEffect(() => {
    if (parameters?.lastQuizId !== apiOptions?.lastQuizId) {
      setApiOptions(parameters);
    }
  }, [parameters, apiOptions]);

  return { quizzes, loaded, hasNext };
};

export const useFetchThumbnailUrl = (
  uri: string,
  size: "256x144" | "640x360"
) => {
  const [imgSrc, setImgSrc] = useState();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    imageUrl(uri, size).then((path) => {
      if (mounted) {
        setImgSrc(path);
        setLoaded(true);
      }
    });
    return () => {
      mounted = false;
    };
  }, [uri, size]);

  return { imgSrc, loaded };
};

export const useFetchLike = (quizId: string, likeClick: boolean) => {
  const [isLike, setIsLike] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  useEffect(() => {
    let mounted = true;
    const uid = firebase.auth().currentUser?.uid;
    if (!uid) return;
    Promise.all([
      firebase
        .firestore()
        .collection("users")
        .doc(uid)
        .collection("likedQuizzes")
        .doc(quizId)
        .get()
        .then((snapshot) => {
          // いいね状態を反映
          if (mounted) {
            setIsLike(snapshot.exists);
          }
        }),
      getCounter(
        firebase
          .firestore()
          .collection("users")
          .doc(uid)
          .collection("quizzes")
          .doc(quizId)
          .collection("counters")
          .doc("likedUsers")
      ).then((conunt) => {
        if (mounted) {
          setLikeCount(conunt);
        }
      }),
    ]).finally(() => {
      if (mounted) {
        setLoaded(true);
      }
    });

    return () => {
      mounted = false;
    };
  }, [quizId, likeClick]);
  return { isLike, loaded, likeCount, setLikeCount };
};

export const usePagenateLikeQuizzes = (parameters: {
  lastLikeId?: string;
  perCount?: number;
}) => {
  const [apiOptions, setApiOptions] = useState(parameters);
  const [loaded, setLoaded] = useState(false);
  const [likedQuizzes, setLikedQuizzes] = useState<any>([]);
  const [user, loading] = useAuthState(firebase.auth());
  const [hasNext, setHasNext] = useState(false);
  useEffect(() => {
    let mounted = true;
    setLoaded(false);
    if (!loading && user) {
      firebase
        .functions()
        .httpsCallable("pagingMyLikeQuiz")(apiOptions)
        .then((res) => {
          if (mounted) {
            setLikedQuizzes((pre: any[]) => [
              ...pre,
              ...(res.data?.quizzes || []),
            ]);
            setHasNext(res.data?.hasNext);
            setLoaded(true);
          }
        })
        .catch(() => {
          if (mounted) {
            setLikedQuizzes([]);
            setLoaded(true);
          }
        });
    } else if (!loading && !user) {
      setLikedQuizzes([]);
      setLoaded(true);
    }

    return () => {
      mounted = false;
    };
  }, [user, loading, apiOptions]);

  useEffect(() => {
    if (parameters?.lastLikeId !== apiOptions?.lastLikeId) {
      setApiOptions(parameters);
    }
  }, [parameters, apiOptions]);
  return { loaded, likedQuizzes, setLikedQuizzes, hasNext };
};
