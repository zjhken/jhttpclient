declare class JHttpClient {
    fetchOptions: RequestInit;
    private url;
    private headers;
    private queries;
    private abortController;
    private timeoutMilli;
    static createRequest(url: string): JHttpClient;
    static beforeSendFn: (() => Promise<void>) | null;
    method(method: string): JHttpClient;
    addHeader(key: string, value: string): JHttpClient;
    /**
     * In HTTP RFC2616, header are allow to be duplicated
     * In this client, headers are stored in array form because the oder of heasers matters
     * So this set method will change all value with the same key
     * @param key
     * @param value if there are duplicated headers, they will combine together with value like v1, v2
     */
    setHeader(key: string, value: string): JHttpClient;
    getHeadersAsMap(): Map<string, string>;
    addQuery(key: string, value: string): JHttpClient;
    /**
     * HTTP query param is allow to be duplicated
     * So this set method will change all value with the same key
     * @param key
     * @param value
     */
    setQuery(key: string, value: string): JHttpClient;
    getQueriesAsMap(): Map<string, string[]>;
    setBody(body: BodyInit): JHttpClient;
    setConnectionTimeout(milliseconds: number): JHttpClient;
    send(): Promise<Response>;
}
declare class CommonHeaders {
    static CONTENT_LENGTH: string;
    static HOST: string;
}

export { CommonHeaders, JHttpClient };
