import { createSlice } from "@reduxjs/toolkit";
import { dispatch } from "..";
import { APIParams, ActionParams } from "../../types/Api";
import { PATH } from "../../constants/endpoints";
import { API } from "../../services/api";

export type InitialState = {
  error: null;
  loading: boolean;
  profileUserInfo?: any;
  userList?: any;
  profile?: any;
  page: number;
  totalPage: number;
};

const initialState: InitialState = {
  error: null,
  loading: false,
  profileUserInfo: {},
  userList: [],
  profile: null,
  page: 1,
  totalPage: 1,
};

export const slice = createSlice({
  name: "user",
  initialState,
  reducers: {
    hasError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },

    startLoading(state) {
      state.loading = true;
    },

    stopLoading(state) {
      state.loading = false;
    },
    setUsers(state, action) {
      state.userList = action.payload.users;
    },
    getAllUsers(state, action) {
      state.userList = action.payload;
    },
    setProfile(state, action) {
      state.profile = action.payload.result;
    },
    setSearchUserInfo(state, action) {
      state.profileUserInfo = action.payload;
    },
    setTotalPage(state, action) {
      state.totalPage = action.payload;
    },
    setIncreasePage(state) {
      if (state.page < state.totalPage) {
        state.page = state.page + 1;
      } else {
        state.page = state.totalPage;
      }
    },
    setDecreasePage(state) {
      if (state.page > 1) {
        state.page = state.page - 1;
      } else {
        state.page = 1;
      }
    },
  },
});

export const { setIncreasePage, setDecreasePage } = slice.actions;

export function getUser(params: ActionParams) {
  return async () => {
    const { successCallback = () => {} }: any = params;

    const options: APIParams = {
      method: "GET",
      endpoint: PATH.user.getUser,
      isToken: true,
      payload: {},
    };

    try {
      const [ok, response] = await API(options);
      if (!ok || !response) return;
      dispatch(slice.actions.setProfile(response));
      successCallback();
    } catch (error) {
    } finally {
      dispatch(slice.actions.stopLoading());
    }
  };
}

export function getAllUsers(params: ActionParams) {
  return async () => {
    const { payload } = params;
    dispatch(slice.actions.startLoading());
    const options: APIParams = {
      method: "POST",
      endpoint: PATH.user.getAllUsers,
      payload: payload,
      isToken: true,
    };

    try {
      const [ok, response] = await API(options);
      dispatch(slice.actions.getAllUsers(response.data));
      dispatch(slice.actions.setTotalPage(response.totalPages));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.stopLoading());
    } finally {
      dispatch(slice.actions.stopLoading());
    }
  };
}

export function getProfileInfo(params: ActionParams) {
  return async () => {
    const { payload }: any = params;
    dispatch(slice.actions.startLoading());

    const options: APIParams = {
      method: "POST",
      endpoint: PATH.user.getProfileInfo,
      isToken: true,
      payload: payload,
    };

    try {
      const [ok, response] = await API(options);
      if (!ok || !response) return;

      dispatch(slice.actions.setSearchUserInfo(response));
    } catch (error) {
    } finally {
      dispatch(slice.actions.stopLoading());
    }
  };
}

export function followUser(params: ActionParams) {
  return async () => {
    const {
      successCallback = () => {},
      errorCallback = () => {},
      payload,
    } = params;

    dispatch(slice.actions.startLoading());

    const options: APIParams = {
      method: "POST",
      endpoint: PATH.user.followUser,
      isToken: false,
      payload,
    };

    try {
      const [ok, response] = await API(options);
      if (!ok || !response) return errorCallback(response.message);
      successCallback(response);
    } catch (error) {
      errorCallback(error);
    } finally {
      dispatch(slice.actions.stopLoading());
    }
  };
}

export function removeFollow(params: ActionParams) {
  return async () => {
    const {
      successCallback = () => {},
      errorCallback = () => {},
      payload,
    } = params;

    dispatch(slice.actions.startLoading());

    const options: APIParams = {
      method: "POST",
      endpoint: PATH.user.removeFollow,
      isToken: false,
      payload,
    };

    try {
      const [ok, response] = await API(options);
      if (!ok || !response) return errorCallback(response.message);
      successCallback(response);
    } catch (error) {
      errorCallback(error);
    } finally {
      dispatch(slice.actions.stopLoading());
    }
  };
}

export function removeFollowing(params: ActionParams) {
  return async () => {
    const {
      successCallback = () => {},
      errorCallback = () => {},
      payload,
    } = params;

    dispatch(slice.actions.startLoading());

    const options: APIParams = {
      method: "POST",
      endpoint: PATH.user.removeFollowing,
      isToken: false,
      payload,
    };

    try {
      const [ok, response] = await API(options);
      if (!ok || !response) return errorCallback(response.message);
      successCallback(response);
    } catch (error) {
      errorCallback(error);
    } finally {
      dispatch(slice.actions.stopLoading());
    }
  };
}

export function blockUser(params: ActionParams) {
  return async () => {
    const {
      successCallback = () => {},
      errorCallback = () => {},
      payload,
    } = params;

    dispatch(slice.actions.startLoading());

    const options: APIParams = {
      method: "POST",
      endpoint: PATH.user.blockUser,
      isToken: false,
      payload,
    };

    try {
      const [ok, response] = await API(options);
      if (!ok || !response) return errorCallback(response.message);
      successCallback(response);
    } catch (error) {
      errorCallback(error);
    } finally {
      dispatch(slice.actions.stopLoading());
    }
  };
}

export function unBlockUser(params: ActionParams) {
  return async () => {
    const {
      successCallback = () => {},
      errorCallback = () => {},
      payload,
    } = params;

    dispatch(slice.actions.startLoading());

    const options: APIParams = {
      method: "POST",
      endpoint: PATH.user.unBlockUser,
      isToken: false,
      payload,
    };

    try {
      const [ok, response] = await API(options);
      if (!ok || !response) return errorCallback(response.message);
      successCallback(response);
    } catch (error) {
      errorCallback(error);
    } finally {
      dispatch(slice.actions.stopLoading());
    }
  };
}

export function deactivateAccount(params: ActionParams) {
  return async () => {
    const {
      successCallback = () => {},
      errorCallback = () => {},
      payload,
    } = params;

    dispatch(slice.actions.startLoading());

    const options: APIParams = {
      method: "POST",
      endpoint: PATH.user.deactiveAccount,
      isToken: false,
      payload,
    };

    try {
      const [ok, response] = await API(options);
      if (!ok || !response) return errorCallback(response.message);
      successCallback(response.message);
    } catch (error) {
      errorCallback(error);
    } finally {
      dispatch(slice.actions.stopLoading());
    }
  };
}

export function updateTutorial(params: ActionParams) {
  return async () => {
    const {
      successCallback = () => {},
      errorCallback = () => {},
      payload,
    } = params;

    dispatch(slice.actions.startLoading());

    const options: APIParams = {
      method: "GET",
      endpoint: "users",
      isToken: false,
      payload,
    };

    try {
      const [ok, response] = await API(options);
      if (!ok || !response) return;

      successCallback();
    } catch (error) {
    } finally {
      dispatch(slice.actions.stopLoading());
    }
  };
}

export function addUser(params: ActionParams) {
  return async () => {
    const {
      successCallback = () => {},
      errorCallback = () => {},
      payload,
    } = params;

    dispatch(slice.actions.startLoading());

    const options: APIParams = {
      method: "POST",
      endpoint: "users/create",
      isToken: false,
      payload,
    };

    try {
      const [ok, response] = await API(options);
      if (!ok || !response) return;
      successCallback(response);
    } catch (error) {
    } finally {
      dispatch(slice.actions.stopLoading());
    }
  };
}

export function reportUser(params: ActionParams) {
  const {
    successCallback = () => {},
    errorCallback = () => {},
    payload,
  } = params;
  return async () => {
    dispatch(slice.actions.startLoading());

    const options: APIParams = {
      method: "POST",
      endpoint: PATH.user.reportUser,
      payload: payload,
      isToken: false,
    };
    try {
      const [ok, response] = await API(options);
      if (!ok || !response) return errorCallback(response.message);

      successCallback(response.message);
    } catch (error) {
      errorCallback();
    } finally {
      dispatch(slice.actions.stopLoading());
    }
  };
}

export function getSingleUser(params: ActionParams) {
  return async () => {
    const {
      successCallback = () => {},
      errorCallback = () => {},
      paramspayload,
    }: any = params;

    const options: APIParams = {
      method: "GET",
      endpoint: `users/userById?id=${paramspayload?.id}`,
      isToken: false,
      payload: {},
    };

    try {
      const [ok, response] = await API(options);
      if (!ok || !response) return;
      dispatch(slice.actions.setProfile(response));
      successCallback();
    } catch (error) {
    } finally {
      dispatch(slice.actions.stopLoading());
    }
  };
}

export function getOtherUser(params: ActionParams) {
  return async () => {
    const {
      successCallback = () => {},
      errorCallback = () => {},
      payload,
    }: any = params;

    dispatch(slice.actions.startLoading());
    const options: APIParams = {
      method: "GET",
      endpoint: `users/userById?id=${payload?.id}&otherid=${payload?.otherid}`,
      isToken: false,
      payload: {},
    };

    try {
      const [ok, response] = await API(options);
      if (!ok || !response) return;
      successCallback(response);
    } catch (error) {
    } finally {
      dispatch(slice.actions.stopLoading());
    }
  };
}

export function updateUser(params: ActionParams) {
  return async () => {
    const {
      successCallback = () => {},
      errorCallback = () => {},
      payload,
    } = params;

    dispatch(slice.actions.startLoading());

    const options: APIParams = {
      method: "POST",
      endpoint: "users/updateUser",
      isToken: false,
      payload,
    };

    let paramspayload: any = { id: payload };
    try {
      const [ok, response] = await API(options);
      if (!ok || !response) return;
      successCallback(response);
      let params: any = {
        paramspayload,
      };
      dispatch(getSingleUser(params));
    } catch (error) {
    } finally {
      dispatch(slice.actions.stopLoading());
    }
  };
}

export default slice.reducer;
