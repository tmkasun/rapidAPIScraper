import  ballerina/http;
import  ballerina/url;
import  ballerina/lang.'string;

public client class Client {
    http:Client clientEp;
    public isolated function init(http:ClientConfiguration clientConfig =  {}, string serviceUrl = "/") returns error? {
        http:Client httpEp = check new (serviceUrl, clientConfig);
        self.clientEp = httpEp;
    }
    remote isolated function 'App\ details(string id, string store, string? language = ()) returns error? {
        string  path = string `/details`;
        map<anydata> queryParam = {language: language, id: id, store: store};
        path = path + getPathForQueryParam(queryParam);
         _ = check self.clientEp-> get(path, targetType=http:Response);
    }
    remote isolated function autocomplete(string term, string store, string? language = ()) returns error? {
        string  path = string `/autocomplete`;
        map<anydata> queryParam = {language: language, term: term, store: store};
        path = path + getPathForQueryParam(queryParam);
         _ = check self.clientEp-> get(path, targetType=http:Response);
    }
    remote isolated function 'User\ reviews(string id, string store, string? language = ()) returns error? {
        string  path = string `/reviews`;
        map<anydata> queryParam = {language: language, id: id, store: store};
        path = path + getPathForQueryParam(queryParam);
         _ = check self.clientEp-> get(path, targetType=http:Response);
    }
    remote isolated function 'App\ search(string term, string store, string? language = ()) returns error? {
        string  path = string `/search`;
        map<anydata> queryParam = {language: language, term: term, store: store};
        path = path + getPathForQueryParam(queryParam);
         _ = check self.clientEp-> get(path, targetType=http:Response);
    }
}

isolated function  getPathForQueryParam(map<anydata>   queryParam)  returns  string {
    string[] param = [];
    param[param.length()] = "?";
    foreach  var [key, value] in  queryParam.entries() {
        if  value  is  () {
            _ = queryParam.remove(key);
        } else {
            if  string:startsWith( key, "'") {
                 param[param.length()] = string:substring(key, 1, key.length());
            } else {
                param[param.length()] = key;
            }
            param[param.length()] = "=";
            if  value  is  string {
                string updateV =  checkpanic url:encode(value, "UTF-8");
                param[param.length()] = updateV;
            } else {
                param[param.length()] = value.toString();
            }
            param[param.length()] = "&";
        }
    }
    _ = param.remove(param.length()-1);
    if  param.length() ==  1 {
        _ = param.remove(0);
    }
    string restOfPath = string:'join("", ...param);
    return restOfPath;
}
