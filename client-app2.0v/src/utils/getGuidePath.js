import { GUIDELABEL, GUIDES } from '../layouts/service/guide/Guide';
import API from './axios';

function goToHomeDashboard(projectGuide) {
  if (projectGuide.label === 'Faire son prévisionnel financier') {
    return '/projet/guide/faire-son-previsionnel-financier';
  }
  if (projectGuide.label === 'Faire son business plan') {
    return '/projet/guide/faire-son-business-plan';
  }
  if (projectGuide.label === 'Trouver son financement') {
    return '/projet/guide/trouver-son-financement';
  }
  if (projectGuide.label === 'Faire ses choix de création') {
    return '/projet/guide/faire-choix-creation-entreprise';
  }
  if (projectGuide.label === 'Créer sa micro-entreprise') {
    return '/projet/guide/creer-sa-micro-entreprise';
  }
  if (projectGuide.label === 'Immatriculer son entreprise') {
    return '/projet/guide/immatriculer-son-entreprise/immatriculez-votre-entreprise/lancez';
  }
  return '/guide';
}
async function updateGuideLandmark(projectGuide, projectLandmark) {
  return new Promise((resolve, reject) => {
    API.put(`v1/workstation/guide/${projectGuide.id}/guide_landmark/status/${projectLandmark.id}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
async function updateGuideStatus(projectGuide) {
  return new Promise((resolve, reject) => {
    API.put(`v1/workstation/guides/status/${projectGuide.id}`)
      .then(() => {
        resolve(projectGuide);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export async function getGuidePath(p) {
  const projectGuide = p;
  if (projectGuide.status === 'finished') {
    window.location.href = goToHomeDashboard(projectGuide);
  }
  const guide = GUIDELABEL[projectGuide.label];
  let landmarkLabel;
  let landmark;
  let projectLandmark;
  let achievement;
  let achievementLabel;
  /* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */
  for (let i = 0; i < GUIDES[guide].landmarks.length; i++) {
    const l = GUIDES[guide].landmarks[i];
    const sl = projectGuide.landmarks.find((landmark) => landmark.label === l.label);
    if (sl.status === 'running') {
      projectLandmark = sl;
      landmarkLabel = sl.label;
      break;
    }
  }
  if (typeof landmarkLabel === 'undefined') {
    const uGuide = await updateGuideStatus(projectGuide);
    window.location.href = goToHomeDashboard(uGuide);
  } else {
    /* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */
    for (let i = 0; i < projectLandmark.achievements.length; i++) {
      if (projectLandmark.achievements[i].status === 'running') {
        achievementLabel = projectLandmark.achievements[i].label;
        break;
      }
    }
    if (typeof achievementLabel === 'undefined') {
      const uGuide = await updateGuideLandmark(projectGuide, projectLandmark);
      getGuidePath(uGuide);
    } else {
      landmark = GUIDES[guide].landmarks.find((landmark) => landmark.label === landmarkLabel);
      achievement = landmark.achievements.find((achievement) => achievement.label === achievementLabel);
      const rootPath = GUIDES[guide].root_url;
      const subPath = landmark.end_point;
      const endPoint = achievement.end_point;
      const url = `/projet/guide/${rootPath}/${subPath}/${endPoint}`;

      window.location.href = url;
    }
  }
}
export function linearGetPath(currentProjectGuide, currentLandmark, currentAchievement) {
  let path = '';
  let landmark;
  let achievement = null;
  const guide = GUIDELABEL[currentProjectGuide.label];
  const rootPath = GUIDES[guide].root_url;
  const projectGuide = GUIDES[guide];
  /* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */
  for (let i = 0; i < projectGuide.landmarks.length; i++) {
    if (projectGuide.landmarks[i].label === currentLandmark) {
      /* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */
      for (let j = 0; j < projectGuide.landmarks[i].achievements.length; j++) {
        if (projectGuide.landmarks[i].achievements[j].label === currentAchievement) {
          if (j === projectGuide.landmarks[i].achievements.length - 1) {
            if (i === projectGuide.landmarks.length - 1) {
              return goToHomeDashboard(projectGuide);
            }
            const next = i + 1;
            landmark = projectGuide.landmarks[next];
            [achievement] = projectGuide.landmarks[next].achievements;
            path = `/projet/guide/${rootPath}/${landmark.end_point}/${achievement.end_point}`;
            return path;
          }
          landmark = projectGuide.landmarks[i];
          const next = j + 1;
          achievement = projectGuide.landmarks[i].achievements[next];
          path = `/projet/guide/${rootPath}/${landmark.end_point}/${achievement.end_point}`;
          return path;
        }
      }
    }
  }
  return '/guide';
}
export function nextLandmark(guide, landmarkLabel, achievementLabel) {
  let path;
  if (guide.status === 'finished') {
    path = linearGetPath(guide, landmarkLabel, achievementLabel);
    window.location.href = path;
  } else {
    getGuidePath(guide);
  }
}
