export const PATH = {
  auth: {
    register: "user/signup",
    login: "user/signin",
    loginTwitter: "success",
    sendForgotPasswordOTP: "user/forgot-password/otp",
    verifyForgotPasswordOTP: "user/forgot-password/otp/verify",
    resetPassword: "user/reset-password",
    verifyEmail: "auth/verify-email",
    resetPasswordByVerfToken: "auth/reset-password/",
    logout: "auth/logout",
  },

  user: {
    preferences: "user/preferences/create",
    favoritegame: "user/favorite-games/create",
    getUser: "user/getUser",
    getProfileInfo: "user/profile/get",
    getAllUsers: "user/getAllUsers",
    updateProfile: "user/profile/update",
    updatePassword: "user/password/update",
    followUser: "user/follower/create",
    removeFollow: "user/follower/delete",
    removeFollowing: "user/following/delete",
    blockUser: "user/block/create",
    unBlockUser: "user/block/delete",
    deactiveAccount: "user/deactivate",
    reportUser: "user/report/create",
  },

  theNextLeg: {
    root: "the-next-leg",
    imagine: "the-next-leg/imagine",
    webhook: "the-next-leg/webhook",
  },

  design: {
    root: "design",
  },

  post: {
    create: "post/video/create",
    get: "post/video/get",
    getTrendingPosts: "post/video/trending/get",
    getFollowingPosts: "post/video/following/get",
    delete: "post/video/delete",
  },

  clip: {
    create: "clip/video/create",
    get: "clip/video/get",
    delete: "clip/video/delete",
  },

  story: {
    create: "stories/story/create",
    get: "stories/story/get",
    getFollowingStories: "stories/story/following/get",
    getCurrentUserStories: "stories/story/user/get",
    getUser: "stories/story/get-user",
    delete: "stories/story/delete",
  },
  reaction: {
    create: "post/video/reaction/create",
    delete: "post/video/reaction/delete",
  },

  clipReaction: {
    create: "clip/video/reaction/create",
    delete: "clip/video/reaction/delete",
  },

  comment: {
    create: "post/comment/create",
  },

  music: {
    getAllMusic: "music/get/all",
  },
  chat: {
    init: "v1/chat/init",
    getUserMessages: "v1/chat/messages/get",
  },

  bookmark: {
    create: "post/bookmark/create",
    get: "post/bookmark/get",
    remove: "post/bookmark/remove",
  },
};
