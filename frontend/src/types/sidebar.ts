export interface RouteItem {
  path: string,
  name: string,
  icon?: React.ReactElement,
  hasNestedRoutes: boolean,
  nestedRoutes?: RouteItem[],  
  roles: string[]
}