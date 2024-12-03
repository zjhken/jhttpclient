export class JHttpClient {
	fetchOptions: RequestInit = {}
	private url = ""
	private headers: [string, string][] = []
	private queries: [string, string][] = []
	private abortController: AbortController | undefined = undefined
	private timeoutMilli = 0

	static createRequest(url: string) {
		let http = new JHttpClient()
		http.url = url
		return http
	}

	static beforeSendFn: (() => Promise<void>) | null = null

	method(method: string): JHttpClient {
		this.fetchOptions.method = method
		return this
	}

	addHeader(key: string, value: string): JHttpClient {
		this.headers = [...this.headers, [key, value]]
		return this
	}

	/**
	 * In HTTP RFC2616, header are allow to be duplicated
	 * In this client, headers are stored in array form because the oder of heasers matters
	 * So this set method will change all value with the same key
	 * @param key 
	 * @param value if there are duplicated headers, they will combine together with value like v1, v2
	 */
	setHeader(key: string, value: string): JHttpClient {
		this.headers.forEach(([oldKey, _], index) => {
			if (oldKey === key) {
				this.headers[index] = [key, value]
			}
		})
		return this
	}

	getHeadersAsMap(): Map<string, string> {
		const m = new Map()
		for (let header of this.headers) {
			const key = header[0]
			const value = header[1]
			if (m.has(key)) {
				m.set(key, `${m.get(key)}, ${value}`)
			} else {
				m.set(key, value)
			}
		}
		return m
	}

	addQuery(key: string, value: string): JHttpClient {
		this.queries = [...this.queries, [key, value]]
		return this
	}

	/**
	 * HTTP query param is allow to be duplicated
	 * So this set method will change all value with the same key
	 * @param key 
	 * @param value 
	 */
	setQuery(key: string, value: string): JHttpClient {
		this.queries.forEach(([oldKey, _], index) => {
			if (oldKey === key) {
				this.queries[index] = [key, value]
			}
		})
		return this
	}

	getQueriesAsMap(): Map<string, string[]> {
		const m = new Map()
		for (let header of this.headers) {
			const key = header[0]
			const value = header[1]
			if (m.has(key)) {
				m.set(key, [...m.get(key), value])
			} else {
				m.set(key, [value])
			}
		}
		return m
	}

	setBody(body: BodyInit): JHttpClient {
		this.fetchOptions.body = body
		return this
	}

	setConnectionTimeout(milliseconds: number): JHttpClient {
		this.abortController = new AbortController()
		this.timeoutMilli = milliseconds
		return this
	}

	async send() {
		if (JHttpClient.beforeSendFn !== null) {
			await JHttpClient.beforeSendFn()
		}
		if (this.headers.length > 0) {
			this.fetchOptions.headers = this.headers
		}
		if (this.queries.length > 0) {
			if (!this.url.includes("?")) {
				this.url = this.url.concat("?")
			}
			for (const query of this.queries) {
				this.url = this.url.concat(`${query[0]}=${query[1]}`)
			}
		}
		if (this.abortController) {
			this.fetchOptions.signal = this.abortController.signal
			setTimeout(() => this.abortController?.abort(), this.timeoutMilli)
		}
		return fetch(this.url, this.fetchOptions);
	}
}

let oldFetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response> = function (_input: RequestInfo | URL, _init?: RequestInit | undefined) {
	console.log("oldFetch is empty")
	return new Promise((resolv, _reject) => {
		resolv(new Response)
	})
}

/**
 * should not use this
 * @param _input 
 * @param _init 
 * @returns 
 */
async function interceptHttpReqGlobally(func: () => Promise<void>) {
	oldFetch = window.fetch
	async function newFetch(input: RequestInfo | URL, init?: RequestInit) {
		await func()
		return oldFetch(input, init)
	}
	window.fetch = newFetch
}

export class CommonHeaders {
	static CONTENT_LENGTH = "Content-Length"
	static HOST = "Host"
}

