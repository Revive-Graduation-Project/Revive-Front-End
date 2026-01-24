import { create } from "zustand";

/*
  Loyalty Store:
  - Manages loyalty points and rewards
  - Extendable for advanced reward levels, redemption rules
*/
const useLoyaltyStore = create((set) => ({
  points: 0,
  rewards: [],
  addPoints: (pts) => set((state) => ({ points: state.points + pts })),
  redeemReward: (reward) =>
    set((state) => ({
      points: state.points - reward.cost,
      rewards: [...state.rewards, reward],
    })),
}));

export default useLoyaltyStore;
