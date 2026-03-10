export type WalletAsset =
  | 'COIN'
  | 'TICKET_FREE'
  | 'TICKET_PREMIUM'
  | 'SEASON_XP'
  | 'GEM'
  | 'REWARD_CREDIT';

export type TicketClass = 'FREE' | 'PREMIUM';

export interface WalletBalance {
  asset: WalletAsset;
  amount: number;
}

export interface GameVariant {
  id: string;
  gameId: string;
  slug: string;
  name: string;
  ticketClass: TicketClass;
  rewardEligible: boolean;
  estimatedDurationSec: number;
  activeRulesetVersion: string;
  probabilityVersionId: string | null;
  transparencyText: string;
}

export interface Game {
  id: string;
  slug: string;
  name: string;
  description: string;
  variants: GameVariant[];
}

export interface ApiResponse<T> {
  data?: T;
  error?: { code: string; message: string };
}
