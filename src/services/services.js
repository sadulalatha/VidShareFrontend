import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const request = axios.create({ baseURL, withCredentials: "include" });
 
// auth services
export const loginAsync = (creds) => request.post("/auth/login", creds);
export const registerAsync = (creds) => request.post("/auth/register", creds);

// channel services
export const getChannelAsync = (channelId) =>  
  request.get(`/channels/${channelId}`);


export const updateChannelAsync = (channelId, data) =>
  request.put(`/channels/${channelId}`, data);

export const subscribeChannelAsync = (channelId) =>
  request.put(`/channels/subscribe/${channelId}`);

export const unsubscribeChannelAsync = (channelId) =>
  request.put(`/channels/unsubscribe/${channelId}`);

// videos services

export const getVideosAsync = (search = "") => request.get(`/videos${search}`);



export const getVideosByChannelIdAsync = (channelId, page = 1, pageSize = 10) =>
  request.get(`/videos/channel/${channelId}`, {
    params: { page, pageSize }
  });




export const getVideoAsync = (videoId) => request.get(`/videos/${videoId}`);





export const createVideoAsync = (data) => request.post(`/videos`, data);

export const updateVideoAsync = (videoId, data) =>
  request.put(`/videos/${videoId}`, data);

export const deleteVideoAsync = (videoId) =>
  request.delete(`/videos/${videoId}`);

export const likeVideoAsync = (videoId) =>
  request.put(`/videos/like/${videoId}`, { videoId });

export const dislikeVideoAsync = (videoId) =>
  request.put(`/videos/dislike/${videoId}`, { videoId });


//comments

export const getCommentsAsync = (videoId) => 
  request.get(`/comments/video/${videoId}`);

export const addCommentAsync = (videoId, desc, channelId) => 
  request.post(`/comments/video/${videoId}`, { desc,channelId }); 


export const deleteCommentAsync = (commentId) => 
  request.delete(`/comments/${commentId}`);

export const likeCommentAsync = (commentId) => 
  request.post(`/comments/${commentId}/like`,{});

export const dislikeCommentAsync = (commentId) => 
  request.post(`/comments/${commentId}/dislike`, {});







// upload services
export const uploadCoverAsync = (cover) =>
    request.post("/uploads/covers", cover);
  
  export const uploadProfileAsync = (profile) =>
    request.post("/uploads/profiles", profile);
  
  export const uploadVideoAsync = (video) =>
    request.post("/uploads/videos", video);
  
  export const uploadBannerAsync = (banner) =>
    request.post("/uploads/banners", banner);


  // helps
export const getProfileUrl = (profile) => {
  return `${baseURL}/medias/profiles/${profile}`;
};

export const getBannerUrl = (banner) => {
  return `${baseURL}/medias/banners/${banner}`;
};

export const getCoverUrl = (cover) => {
  return `${baseURL}/medias/covers/${cover}`;
};

export const getVideoUrl = (video) => {
  return `${baseURL}/medias/videos/${video}`;
};


//watch history


export const getWatchHistoryAsync = () => request.get(`${baseURL}/history/get`);

export const addToWatchHistoryAsync = (videoId) =>
  request.post(`${baseURL}/history/add`, { videoId });

export const clearWatchHistoryAsync = () => request.delete(`${baseURL}/history/clear`);

export const deleteEntryAsync = (historyId) =>
  request.delete(`${baseURL}/history/delete/${historyId}`);


