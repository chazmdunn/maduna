export type Token = {
    address: string;
    feesUSD: number;
    id: string;
    name: string;
    priceUSD: number;
    priceUSDChange: number;
    standard: string;
    symbol: string;
    totalVolumeUSD: number;
    txCount: bigint;
    volumeUSD: number;
    volumeUSD1d: number;
    volumeUSD7d: number;
  };

  export interface SphereData {
    color: string;
    logo: string;  
    scale: number; 
    name: string; 
    priceChange: number; 
  }
  
  