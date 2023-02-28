import { InjectionToken } from "@angular/core";

const getSubDomain = () => {
  let hostName = window.location.hostname;
  if(hostName.split(".").length < 3){
    return "www"
  }
  return hostName.split(".")[0];
}

export const SUB_DOMAIN = new InjectionToken<string>("subdomainprovider" , {
  providedIn: "root",
  factory: ():string => {
      return getSubDomain();
  }
});