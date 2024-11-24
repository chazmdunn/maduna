const AGGREGATOR_PAGE_SIZE = 10;
const SNS_AGGREGATOR_CANISTER_URL = 'https://3r4gx-wqaaa-aaaaq-aaaia-cai.icp0.io';
const AGGREGATOR_CANISTER_VERSION = 'v1';

const AGGREGATOR_URL = `${SNS_AGGREGATOR_CANISTER_URL}/${AGGREGATOR_CANISTER_VERSION}/sns`;

const aggregatorPageUrl = (page) => `list/page/${page}/slow.json`;

export const querySnsAggregator = async (page = 0) => {
    const response = await fetch(`${AGGREGATOR_URL}/${aggregatorPageUrl(page)}`);

    if (!response.ok) {
        // If the error is after the first page, is because there are no more pages it fails
        if (page > 0) {
            return [];
        }

        throw new Error('Error loading SNS projects from aggregator canister');
    }

    const data = await response.json();

    if (data.length === AGGREGATOR_PAGE_SIZE) {
        const nextPageData = await querySnsAggregator(page + 1);
        return [...data, ...nextPageData];
    }

    return data;
};
