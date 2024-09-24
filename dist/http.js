"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// http.ts
var http_exports = {};
__export(http_exports, {
  CommonHeaders: () => CommonHeaders,
  JHttpClient: () => JHttpClient
});
module.exports = __toCommonJS(http_exports);
var _JHttpClient = class _JHttpClient {
  constructor() {
    this.fetchOptions = {};
    this.url = "";
    this.headers = [];
    this.queries = [];
    this.abortController = void 0;
    this.timeoutMilli = 0;
  }
  static create(url) {
    let http = new _JHttpClient();
    http.url = url;
    return http;
  }
  method(method) {
    this.fetchOptions.method = method;
    return this;
  }
  addHeader(key, value) {
    this.headers = [...this.headers, [key, value]];
    return this;
  }
  /**
   * In HTTP RFC2616, header are allow to be duplicated
   * In this client, headers are stored in array form because the oder of heasers matters
   * So this set method will change all value with the same key
   * @param key 
   * @param value if there are duplicated headers, they will combine together with value like v1, v2
   */
  setHeader(key, value) {
    this.headers.forEach(([oldKey, _], index) => {
      if (oldKey === key) {
        this.headers[index] = [key, value];
      }
    });
    return this;
  }
  getHeadersAsMap() {
    const m = /* @__PURE__ */ new Map();
    for (let header of this.headers) {
      const key = header[0];
      const value = header[1];
      if (m.has(key)) {
        m.set(key, `${m.get(key)}, ${value}`);
      } else {
        m.set(key, value);
      }
    }
    return m;
  }
  addQuery(key, value) {
    this.queries = [...this.queries, [key, value]];
    return this;
  }
  /**
   * HTTP query param is allow to be duplicated
   * So this set method will change all value with the same key
   * @param key 
   * @param value 
   */
  setQuery(key, value) {
    this.queries.forEach(([oldKey, _], index) => {
      if (oldKey === key) {
        this.queries[index] = [key, value];
      }
    });
    return this;
  }
  getQueriesAsMap() {
    const m = /* @__PURE__ */ new Map();
    for (let header of this.headers) {
      const key = header[0];
      const value = header[1];
      if (m.has(key)) {
        m.set(key, [...m.get(key), value]);
      } else {
        m.set(key, [value]);
      }
    }
    return m;
  }
  setBody(body) {
    this.fetchOptions.body = body;
    return this;
  }
  setConnectionTimeout(milliseconds) {
    this.abortController = new AbortController();
    this.timeoutMilli = milliseconds;
    return this;
  }
  send() {
    return __async(this, null, function* () {
      if (_JHttpClient.beforeSendFn !== null) {
        yield _JHttpClient.beforeSendFn();
      }
      if (this.headers.length > 0) {
        this.fetchOptions.headers = this.headers;
      }
      if (this.queries.length > 0) {
        if (!this.url.includes("?")) {
          this.url = this.url.concat("?");
        }
        for (const query of this.queries) {
          this.url = this.url.concat(`${query[0]}=${query[1]}`);
        }
      }
      if (this.abortController) {
        this.fetchOptions.signal = this.abortController.signal;
        setTimeout(() => {
          var _a;
          return (_a = this.abortController) == null ? void 0 : _a.abort();
        }, this.timeoutMilli);
      }
      return fetch(this.url, this.fetchOptions);
    });
  }
};
_JHttpClient.beforeSendFn = null;
var JHttpClient = _JHttpClient;
var CommonHeaders = class {
};
CommonHeaders.CONTENT_LENGTH = "Content-Length";
CommonHeaders.HOST = "Host";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CommonHeaders,
  JHttpClient
});
//# sourceMappingURL=http.js.map