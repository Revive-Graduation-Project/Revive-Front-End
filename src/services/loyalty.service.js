import { api } from './api';

//DEPRECTAED API CALLS

// Get loyalty points
export const getLoyaltyPoints = () => {
  return api.get('/loyalty/points');
};

// Redeem reward
export const redeemReward = (rewardId) => {
  return api.post(`/loyalty/redeem/${rewardId}`);
};
