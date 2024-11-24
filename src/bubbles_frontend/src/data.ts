
// @ts-ignore
import icblast from '@infu/icblast';

let ic = icblast({
    local: false
})

let can = await ic("moe7a-tiaaa-aaaag-qclfq-cai");

let ps = await ic("ggzvv-5qaaa-aaaag-qck7a-cai");
let tokens = await ps.getAllTokens();

console.log("Tokens data: ", tokens);

    async function icpswap_historic_prices({token, start, len}) {

        let cdata = await can.getTokenChartData(
          token,
          start,
          len
          );
      
        if (!cdata.length) throw new Error("Can't find token");
      
        let pdata = await can.getTokenPricesData(
          token,
          start,
          86400,
          len
          );
      
      
      
        let max = Math.max(cdata.length, pdata.length);
      
      
        let rez = Array(max-1).fill(0).map((_, i) => {
          let {volumeUSD} = cdata[i]?cdata[i]:{};
          let {low, high, close, open} = pdata[i]?pdata[i]:{};
      
          if (cdata[i].timestamp != pdata[i].timestamp) throw new Error("Timestamp mismatch")
      
          return {
          date : cdata[i]?new Date(Number(cdata[i].timestamp)*1000).toLocaleDateString("en-US"):null,
          volumeUSD,
          close,
          low,
          high,
          open,
          }
      
        });
       
        return rez;
        
      }

export {tokens, icpswap_historic_prices};




export const data = [
    { color: '#444', image: 'three.png', scale: 1.5, text: 'from' },
    { color: '#444', image: 'react.png', scale: 2, text: 'the' },
    { color: '#ff4060', image: 'pmndrs.png', scale: 3, text: 'journey' },
    { color: '#444', image: 'three.png', scale: 1.5, text: 'of' },
    { color: '#444', image: 'react.png', scale: 2, text: 'the' },
    { color: '#ffdf10', image: 'pmndrs.png', scale: 5, text: 'sun' },
    { color: '#444', image: 'three.png', scale: 3, text: 'through' },
    { color: '#444', image: 'react.png', scale: 1.5, text: 'the' },
    { color: '#ff4060', image: 'pmndrs.png', scale: 3, text: 'twelve' },
    { color: '#ff4060', image: 'react.png', scale: 2, text: 'signs' },
    { color: '#444', image: 'three.png', scale: 1, text: 'come' },
    { color: '#444', image: 'react.png', scale: 3, text: 'the' },
    { color: '#ff4060', image: 'pmndrs.png', scale: 4, text: 'legend' },
    // { color: '#444', image: 'react.png', scale: 3, text: 'of' },
    // { color: '#444', image: 'three.png', scale: 1.5, text: 'the' },
    // { color: '#ff4060', image: 'react.png', scale: 3, text: 'twelve' },
    // { color: '#ff4060', image: 'pmndrs.png', scale: 4, text: 'labours' },
    // { color: '#444', image: 'react.png', scale: 2, text: 'of' },
    // { color: '#ff4060', image: 'pmndrs.png', scale: 4, text: 'hercules' },
    // { color: '#444', image: 'three.png', scale: 1.5, text: 'from' },
    // { color: '#444', image: 'react.png', scale: 2, text: 'the' },
    // { color: '#ff4060', image: 'pmndrs.png', scale: 3, text: 'journey' },
    // { color: '#444', image: 'three.png', scale: 1.5, text: 'of' },
    // { color: '#444', image: 'react.png', scale: 2, text: 'the' },
    // { color: '#ffdf10', image: 'pmndrs.png', scale: 5, text: 'sun' },
    // { color: '#444', image: 'three.png', scale: 3, text: 'through' },
    // { color: '#444', image: 'react.png', scale: 1.5, text: 'the' },
    // { color: '#ff4060', image: 'pmndrs.png', scale: 3, text: 'twelve' },
    // { color: '#ff4060', image: 'react.png', scale: 2, text: 'signs' },
    // { color: '#444', image: 'three.png', scale: 1, text: 'come' },
    // { color: '#444', image: 'react.png', scale: 3, text: 'the' },
    // { color: '#ff4060', image: 'pmndrs.png', scale: 4, text: 'legend' },
    // { color: '#444', image: 'react.png', scale: 3, text: 'of' },
    // { color: '#444', image: 'three.png', scale: 1.5, text: 'the' },
    // { color: '#ff4060', image: 'react.png', scale: 3, text: 'twelve' },
    // { color: '#ff4060', image: 'pmndrs.png', scale: 4, text: 'labours' },
    // { color: '#444', image: 'react.png', scale: 2, text: 'of' },
    // { color: '#ff4060', image: 'pmndrs.png', scale: 4, text: 'hercules' },
    // { color: '#444', image: 'three.png', scale: 1.5, text: 'from' },
    // { color: '#444', image: 'react.png', scale: 2, text: 'the' },
    // { color: '#ff4060', image: 'pmndrs.png', scale: 3, text: 'journey' },
    // { color: '#444', image: 'three.png', scale: 1.5, text: 'of' },
    // { color: '#444', image: 'react.png', scale: 2, text: 'the' },
    // { color: '#ffdf10', image: 'pmndrs.png', scale: 5, text: 'sun' },
    // { color: '#444', image: 'three.png', scale: 3, text: 'through' },
    // { color: '#444', image: 'react.png', scale: 1.5, text: 'the' },
    // { color: '#ff4060', image: 'pmndrs.png', scale: 3, text: 'twelve' },
    // { color: '#ff4060', image: 'react.png', scale: 2, text: 'signs' },
    // { color: '#444', image: 'three.png', scale: 1, text: 'come' },
    // { color: '#444', image: 'react.png', scale: 3, text: 'the' },
    // { color: '#ff4060', image: 'pmndrs.png', scale: 4, text: 'legend' },
    // { color: '#444', image: 'react.png', scale: 3, text: 'of' },
    // { color: '#444', image: 'three.png', scale: 1.5, text: 'the' },
    // { color: '#ff4060', image: 'react.png', scale: 3, text: 'twelve' },
    // { color: '#ff4060', image: 'pmndrs.png', scale: 4, text: 'labours' },
    // { color: '#444', image: 'react.png', scale: 2, text: 'of' },
    // { color: '#ff4060', image: 'pmndrs.png', scale: 4, text: 'hercules' },
    // { color: '#444', image: 'three.png', scale: 1.5, text: 'from' },
    // { color: '#444', image: 'react.png', scale: 2, text: 'the' },
    // { color: '#ff4060', image: 'pmndrs.png', scale: 3, text: 'journey' },
    // { color: '#444', image: 'three.png', scale: 1.5, text: 'of' },
    // { color: '#444', image: 'react.png', scale: 2, text: 'the' },
    // { color: '#ffdf10', image: 'pmndrs.png', scale: 5, text: 'sun' },
    // { color: '#444', image: 'three.png', scale: 3, text: 'through' },
    // { color: '#444', image: 'react.png', scale: 1.5, text: 'the' },
    // { color: '#ff4060', image: 'pmndrs.png', scale: 3, text: 'twelve' },
    // { color: '#ff4060', image: 'react.png', scale: 2, text: 'signs' },
    // { color: '#444', image: 'three.png', scale: 1, text: 'come' },
    // { color: '#444', image: 'react.png', scale: 3, text: 'the' },
    // { color: '#ff4060', image: 'pmndrs.png', scale: 4, text: 'legend' },
    // { color: '#444', image: 'react.png', scale: 3, text: 'of' },
    // { color: '#444', image: 'three.png', scale: 1.5, text: 'the' },
    // { color: '#ff4060', image: 'react.png', scale: 3, text: 'twelve' },
    // { color: '#ff4060', image: 'pmndrs.png', scale: 4, text: 'labours' },
    // { color: '#444', image: 'react.png', scale: 2, text: 'of' },
    // { color: '#ff4060', image: 'pmndrs.png', scale: 4, text: 'hercules' },
];