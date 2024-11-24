import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { data, icpswap_historic_prices, tokens } from './data';
import Sphere from './Sphere';
import { useEffect } from 'react';
import { querySnsAggregator } from './snses';



const Bubbles: React.FC = () => {
    // console.log("Tokens: ", tokens)

    useEffect(() => {
        (async () => {
            const snses = await querySnsAggregator()
            console.log("SNSes: ", snses)
        })();
    }, []);

    useEffect(() => {
        if (tokens) {
            getTokenData()
        }
    }, [tokens, icpswap_historic_prices]);

    const getTokenData = async () => {
        let token = tokens.find(x => x.symbol == "CHAT");
        console.log("Token: ", token)
        let data = await icpswap_historic_prices({
            token: token.address,// Take pool id from the table above
            start: 0,
            len: 365 // in days
        })
        console.log("Data: ", data)
    }

    return (
        <Canvas
            orthographic
            camera={{ position: [0, 0, 100], zoom: 30 }}
            style={{ width: '100vw', height: '100vh' }}
        >
            <Physics /*debug*/ interpolate timeStep={1 / 60} gravity={[0, 0, 0]}>
                {data.map((props, i) => (
                    <Sphere key={i} {...props} />
                ))}
            </Physics>
        </Canvas>
    );
};

export default Bubbles;
