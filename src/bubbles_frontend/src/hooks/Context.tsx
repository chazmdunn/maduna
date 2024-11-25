import {
    createContext,
    useContext,
    useEffect,
    useState,
    FC,
} from "react";
import {
    AuthClient,
    AuthClientCreateOptions,
    AuthClientLoginOptions,
} from "@dfinity/auth-client";
import { canisterId as iiCanId } from "../../../declarations/internet_identity";
import { Actor, ActorSubclass, HttpAgent, Identity } from "@dfinity/agent";
// @ts-ignore
import icblast from '@infu/icblast';
import { getTokens } from "../data";
import { host, network } from "./constants";
import { Token } from "../types/tokens";


interface AuthContextType {
    isAuthenticated: boolean | null;
    tokens: Token[] | null;
    login: () => void;
    logout: () => void;
}

const InitialContext: AuthContextType = {
    isAuthenticated: null,
    tokens: null,
    login: () => { },
    logout: () => { },
};

const AuthContext = createContext<AuthContextType>(InitialContext);

interface DefaultOptions {
    createOptions: AuthClientCreateOptions;
    loginOptions: AuthClientLoginOptions;
}

const defaultOptions: DefaultOptions = {
    createOptions: {
        idleOptions: {
            disableIdle: true,
        },
    },
    loginOptions: {
        identityProvider:
            network === "ic"
                ? "https://identity.ic0.app/#authorize"
                : `http://${iiCanId}.localhost:4943`,
    },
};

export const useAuthClient = (options = defaultOptions) => {

    const [tokens, setTokens] = useState<Token[] | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [authClient, setAuthClient] = useState<AuthClient | null>(null);



    useEffect(() => {
        AuthClient.create(options.createOptions).then(async (client) => {
            updateClient(client);
        });
    }, []);



    const login = () => {
        authClient?.login({
            ...options.loginOptions,
            onSuccess: () => {
                updateClient(authClient);
            },
        });
    };


    async function updateClient(client: AuthClient) {
        const isAuthenticated = await client.isAuthenticated();
        setIsAuthenticated(isAuthenticated);

        setAuthClient(client);

        const _identity = client.getIdentity();

        let agent = await HttpAgent.create({
            host: host,
            identity: _identity,
        });

        if (network === "local") {
            agent.fetchRootKey();
        }
        const _tokens = await getTokens();
        setTokens(_tokens);

    }



    async function logout() {
        await authClient?.logout();
        await updateClient(authClient);
    }

    return {
        isAuthenticated,
        login,
        logout,
        tokens

    };
};

interface LayoutProps {
    children: React.ReactNode;
}

export const AuthProvider: FC<LayoutProps> = ({ children }) => {
    const auth = useAuthClient();

    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);