// @ts-ignore
import icblast from "@infu/icblast";
import { Token } from "./types/tokens";

let ic = icblast({
  local: false,
});

export const getTokens = async () => {
  let ps = await ic("ggzvv-5qaaa-aaaag-qck7a-cai");
  const tokens : Token [] =  await ps.getAllTokens();
  return tokens;
};


export async function icpswap_historic_prices({ token, start, len }) {
  let can = await ic("moe7a-tiaaa-aaaag-qclfq-cai");
  let cdata = await can.getTokenChartData(token, start, len);

  if (!cdata.length) throw new Error("Can't find token");

  let pdata = await can.getTokenPricesData(token, start, 86400, len);

  let max = Math.max(cdata.length, pdata.length);

  let rez = Array(max - 1)
    .fill(0)
    .map((_, i) => {
      let { volumeUSD } = cdata[i] ? cdata[i] : {};
      let { low, high, close, open } = pdata[i] ? pdata[i] : {};

      if (cdata[i].timestamp != pdata[i].timestamp)
        throw new Error("Timestamp mismatch");

      return {
        date: cdata[i]
          ? new Date(Number(cdata[i].timestamp) * 1000).toLocaleDateString(
              "en-US"
            )
          : null,
        volumeUSD,
        close,
        low,
        high,
        open,
      };
    });

  return rez;
}


// export const data = [
//   { color: "#444", logo: "three.png", scale: 1.5, name: "from", priceChange: 2.5 },
//   { color: "#444", logo: "react.png", scale: 2, name: "the", priceChange: -1.3 },
//   { color: "#ff4060", logo: "pmndrs.png", scale: 3, name: "journey", priceChange: 0.8 },
//   { color: "#444", logo: "three.png", scale: 1.5, name: "of", priceChange: 1.1 },
//   { color: "#444", logo: "react.png", scale: 2, name: "the", priceChange: -0.6 },
//   { color: "#ffdf10", logo: "pmndrs.png", scale: 5, name: "sun", priceChange: 3.2 },
//   { color: "#444", logo: "three.png", scale: 3, name: "through", priceChange: -2.0 },
//   { color: "#444", logo: "react.png", scale: 1.5, name: "the", priceChange: 1.7 },
//   { color: "#ff4060", logo: "pmndrs.png", scale: 3, name: "twelve", priceChange: 0.4 },
//   { color: "#ff4060", logo: "react.png", scale: 2, name: "signs", priceChange: -1.0 },
//   { color: "#444", logo: "three.png", scale: 1, name: "come", priceChange: 2.8 },
//   { color: "#444", logo: "react.png", scale: 3, name: "the", priceChange: -0.9 },
//   { color: "#ff4060", logo: "pmndrs.png", scale: 4, name: "legend", priceChange: 1.3 },
//   // { color: '#444', image: 'react.png', scale: 3, text: 'of' },
//   // { color: '#444', image: 'three.png', scale: 1.5, text: 'the' },
//   // { color: '#ff4060', image: 'react.png', scale: 3, text: 'twelve' },
//   // { color: '#ff4060', image: 'pmndrs.png', scale: 4, text: 'labours' },
//   // { color: '#444', image: 'react.png', scale: 2, text: 'of' },
//   // { color: '#ff4060', image: 'pmndrs.png', scale: 4, text: 'hercules' },
//   // { color: '#444', image: 'three.png', scale: 1.5, text: 'from' },
//   // { color: '#444', image: 'react.png', scale: 2, text: 'the' },
//   // { color: '#ff4060', image: 'pmndrs.png', scale: 3, text: 'journey' },
//   // { color: '#444', image: 'three.png', scale: 1.5, text: 'of' },
//   // { color: '#444', image: 'react.png', scale: 2, text: 'the' },
//   // { color: '#ffdf10', image: 'pmndrs.png', scale: 5, text: 'sun' },
//   // { color: '#444', image: 'three.png', scale: 3, text: 'through' },
//   // { color: '#444', image: 'react.png', scale: 1.5, text: 'the' },
//   // { color: '#ff4060', image: 'pmndrs.png', scale: 3, text: 'twelve' },
//   // { color: '#ff4060', image: 'react.png', scale: 2, text: 'signs' },
//   // { color: '#444', image: 'three.png', scale: 1, text: 'come' },
//   // { color: '#444', image: 'react.png', scale: 3, text: 'the' },
//   // { color: '#ff4060', image: 'pmndrs.png', scale: 4, text: 'legend' },
//   // { color: '#444', image: 'react.png', scale: 3, text: 'of' },
//   // { color: '#444', image: 'three.png', scale: 1.5, text: 'the' },
//   // { color: '#ff4060', image: 'react.png', scale: 3, text: 'twelve' },
//   // { color: '#ff4060', image: 'pmndrs.png', scale: 4, text: 'labours' },
//   // { color: '#444', image: 'react.png', scale: 2, text: 'of' },
//   // { color: '#ff4060', image: 'pmndrs.png', scale: 4, text: 'hercules' },
//   // { color: '#444', image: 'three.png', scale: 1.5, text: 'from' },
//   // { color: '#444', image: 'react.png', scale: 2, text: 'the' },
//   // { color: '#ff4060', image: 'pmndrs.png', scale: 3, text: 'journey' },
//   // { color: '#444', image: 'three.png', scale: 1.5, text: 'of' },
//   // { color: '#444', image: 'react.png', scale: 2, text: 'the' },
//   // { color: '#ffdf10', image: 'pmndrs.png', scale: 5, text: 'sun' },
//   // { color: '#444', image: 'three.png', scale: 3, text: 'through' },
//   // { color: '#444', image: 'react.png', scale: 1.5, text: 'the' },
//   // { color: '#ff4060', image: 'pmndrs.png', scale: 3, text: 'twelve' },
//   // { color: '#ff4060', image: 'react.png', scale: 2, text: 'signs' },
//   // { color: '#444', image: 'three.png', scale: 1, text: 'come' },
//   // { color: '#444', image: 'react.png', scale: 3, text: 'the' },
//   // { color: '#ff4060', image: 'pmndrs.png', scale: 4, text: 'legend' },
//   // { color: '#444', image: 'react.png', scale: 3, text: 'of' },
//   // { color: '#444', image: 'three.png', scale: 1.5, text: 'the' },
//   // { color: '#ff4060', image: 'react.png', scale: 3, text: 'twelve' },
//   // { color: '#ff4060', image: 'pmndrs.png', scale: 4, text: 'labours' },
//   // { color: '#444', image: 'react.png', scale: 2, text: 'of' },
//   // { color: '#ff4060', image: 'pmndrs.png', scale: 4, text: 'hercules' },
//   // { color: '#444', image: 'three.png', scale: 1.5, text: 'from' },
//   // { color: '#444', image: 'react.png', scale: 2, text: 'the' },
//   // { color: '#ff4060', image: 'pmndrs.png', scale: 3, text: 'journey' },
//   // { color: '#444', image: 'three.png', scale: 1.5, text: 'of' },
//   // { color: '#444', image: 'react.png', scale: 2, text: 'the' },
//   // { color: '#ffdf10', image: 'pmndrs.png', scale: 5, text: 'sun' },
//   // { color: '#444', image: 'three.png', scale: 3, text: 'through' },
//   // { color: '#444', image: 'react.png', scale: 1.5, text: 'the' },
//   // { color: '#ff4060', image: 'pmndrs.png', scale: 3, text: 'twelve' },
//   // { color: '#ff4060', image: 'react.png', scale: 2, text: 'signs' },
//   // { color: '#444', image: 'three.png', scale: 1, text: 'come' },
//   // { color: '#444', image: 'react.png', scale: 3, text: 'the' },
//   // { color: '#ff4060', image: 'pmndrs.png', scale: 4, text: 'legend' },
//   // { color: '#444', image: 'react.png', scale: 3, text: 'of' },
//   // { color: '#444', image: 'three.png', scale: 1.5, text: 'the' },
//   // { color: '#ff4060', image: 'react.png', scale: 3, text: 'twelve' },
//   // { color: '#ff4060', image: 'pmndrs.png', scale: 4, text: 'labours' },
//   // { color: '#444', image: 'react.png', scale: 2, text: 'of' },
//   // { color: '#ff4060', image: 'pmndrs.png', scale: 4, text: 'hercules' },
// ];
