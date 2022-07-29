class Navigate  {
  navigateTo = (navigation: any, screen: string, parameters: any) => {
    navigation.navigate(screen, { parameters });
  };
}
export default new Navigate();