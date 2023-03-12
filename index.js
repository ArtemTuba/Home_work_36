import { getUserByName, getUserInfractions } from './user-api.js';

const getReasonForWorstInfractionLinkified = (username, callback) => {
  getUserByName(username, user => {
    getUserInfractions(user.id, result => {
      let foundIndex = 0;
      for (let i = result.length - 1; i >= 0; i--) {
        foundIndex = result[i].points > result[foundIndex].points ? i : foundIndex;
      }
      const { reason } = result[foundIndex];
      callback(reason.replace(/\bhttps:\/\/\S+/, match => `<a href="${match}">${match}</a>`));
    });
  });
};

const getReasonForMostRecentInfractionLinkified = (name, callback) => {
  getUserByName(name, user => {
    getUserInfractions(user.id, result => {
      let foundIndex = 0;
      for (let i = 1; i < result.length; i++) {
        foundIndex = result[i].id > result[foundIndex].id ? i : foundIndex;
      }
      const { reason } = result[foundIndex];
      callback(reason.replace(/\bhttps:\/\/\S+/, match => `<a href="${match}">${match}</a>`));
    });
  });
};

export const getRelevantInfractionReasons = username =>
  new Promise(resolve => {
    getReasonForWorstInfractionLinkified(username, worst => {
      getReasonForMostRecentInfractionLinkified(username, mostRecent => {
        resolve({ mostRecent, worst });
      });
    });
  });