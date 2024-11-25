import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { icpswap_historic_prices } from "./data";
import Sphere from "./Sphere";
import { useEffect, useState } from "react";
import { querySnsAggregator } from "./snses";
import { useAuth } from "./hooks/Context";
import { SphereData, Token } from "./types/tokens";
import { SNS_AGGREGATOR_CANISTER_URL } from "./hooks/constants";

const Bubbles: React.FC = () => {
  const { tokens } = useAuth();
  const [criterea, setCriterea] = useState<string>("priceChangeUSD");
  const [rankedTokens, setRankedTokens] = useState<Token[] | null>(null);
  const [data, setData] = useState<SphereData[] | null>(null);
  const [snses, setSnses] = useState<any[] | null>(null);

  useEffect(() => {
    (async () => {
      const snses = await querySnsAggregator();
      setSnses(snses);
    })();
  }, []);

  useEffect(() => {
    if (tokens) {
    //   getTokenData();
      filterAndRankTokens(tokens);
    }
  }, [tokens]);

//   const getTokenData = async () => {
//     let token = tokens.find((x) => x.symbol == "CHAT");
//     let data = await icpswap_historic_prices({
//       token: token.address, // Take pool id from the table above
//       start: 0,
//       len: 365 * 3, // in days
//     });
//     console.log("Data: ", data);
//   };

  const filterAndRankTokens = (tokens: Token[]) => {
    const filteredTokens = tokens.filter(
      (token) =>
        token.totalVolumeUSD > 0 &&
        token.volumeUSD1d > 0 &&
        token.priceUSDChange !== 0 &&
        token.txCount > 0
    );

    const sortedTokens = filteredTokens.sort(
      (a, b) => b.totalVolumeUSD - a.totalVolumeUSD
    );

    setRankedTokens(sortedTokens.slice(0, 60));
  };

  useEffect(() => {
    if (rankedTokens) {
      formatData(rankedTokens);
    }
  }, [rankedTokens, criterea]);

  const formatData = async (tokens: Token[]) => {
    if (!criterea) return;

    const critereaValues = tokens.map((token) => {
      switch (criterea) {
        case "priceChangeUSD":
          return token.priceUSDChange;
        case "totalVolume":
          return token.totalVolumeUSD;
        case "volume1d":
          return token.volumeUSD1d;
        case "volume7days":
          return token.volumeUSD7d;
        default:
          return 0;
      }
    });

    const minValue = Math.min(...critereaValues);
    const maxValue = Math.max(...critereaValues);

    const range = maxValue - minValue || 1;

    const data = tokens.map((token) => {
      const value = (() => {
        switch (criterea) {
          case "priceChangeUSD":
            return token.priceUSDChange;
          case "totalVolume":
            return token.totalVolumeUSD;
          case "volume1d":
            return token.volumeUSD1d;
          case "volume7days":
            return token.volumeUSD7d;
          default:
            return 0; // Fallback for unexpected criterea
        }
      })();

      // Normalize scale between 1 and 5
      const scale = 1 + ((value - minValue) / range) * 4;

      const logo = getSNSTokenLogo(token.symbol, snses) || "pmndrs.png";

      return {
        color: "#444",
        logo: logo,
        scale: Math.max(scale, 1),
        name: token.symbol,
        priceChange: token.priceUSDChange,
      };
    });

    setData(data);
  };

  const getSNSTokenLogo = (symbol: string, snsCanistersData: any): string | null => {
    if (!snsCanistersData) return null;
    for (const canister of snsCanistersData) {
      const metadata = canister.icrc1_metadata;

      if (metadata) {
        for (const meta of metadata) {
          if (meta[0] === "icrc1:symbol" && meta[1]?.Text === symbol) {
            return SNS_AGGREGATOR_CANISTER_URL + canister.meta?.logo || null;
          }
        }
      }
    }
    return null;
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-400">
      {/* Criteria Selection Buttons */}
      <div className="flex justify-center mb-4">
        {["priceChangeUSD", "totalVolume", "volume1d", "volume7days"].map((criteriaOption) => (
          <button
            key={criteriaOption}
            onClick={() => setCriterea(criteriaOption)}
            className={`px-4 py-2 mx-2 rounded-md text-white font-semibold transition-all ${
              criterea === criteriaOption
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 hover:bg-gray-500"
            }`}
          >
            {criteriaOption.replace(/([A-Z])/g, " $1").trim()}
          </button>
        ))}
      </div>

      {/* 3D Canvas */}
      <Canvas
        orthographic
        camera={{ position: [0, 0, 100], zoom: 30 }}
        style={{ width: "100vw", height: "100vh" }}
      >
        <Physics interpolate timeStep={1 / 60} gravity={[0, 0, 0]}>
          {data?.map((props, i) => (
            <Sphere key={i} {...props} />
          ))}
        </Physics>
      </Canvas>
    </div>
  );
};

export default Bubbles;
