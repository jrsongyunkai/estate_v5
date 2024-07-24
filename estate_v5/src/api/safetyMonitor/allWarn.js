import request from '@/plugins/request';

export const getDetailOfProject = (params) => {
  return request.POST('/project/main/v2/alarmDetailOfProject.as', params);
};
export const getDetailOfTypeStats = (params) => {
  return request.POST('/project/main/v2/alarmOfTypeStats.as', params);
};
export const getfindMaintenance = (params) => {
  return request.POST('/maintenance/findMaintenance.as', params);
};
export const updateMaintenance = (params) => {
  return request.POST('/maintenance/updateMaintenance.as', params);
};
export const modifyBoxsChnlClearAlarm = (params) => {
  return request.POST('/boxProperties/modifyBoxsChnlClearAlarm.as', params);
};
export const modifyBoxsChnlRemoteMute = (params) => {
  return request.POST('/boxProperties/modifyBoxsChnlRemoteMute.as', params);
};
export const queryBoxDetails = (params) => {
  return request.POST('/box/queryBoxDetails.as', params);
};
export const modifyMacRate = (params) => {
  return request.POST('/project/main/ctl/boxes/rate.as', params);
};
export const alarmUrgePush = (params) => {
  return request.POST('/alarm/urge4Push.as', params);
};
