// Определение типа StaticImageData для использования с импортированными SVG и другими типами изображений
declare module '*.svg' {
  import { StaticImageData } from 'next/image';
  const content: StaticImageData;
  export default content;
}

declare module '*.png' {
  import { StaticImageData } from 'next/image';
  const content: StaticImageData;
  export default content;
}
