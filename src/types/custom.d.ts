declare module "*.svg" {
  const content: {
    src: string;
  };
  export default content;
}

declare module "*.png" {
  const content: string;
  export default content;
}
