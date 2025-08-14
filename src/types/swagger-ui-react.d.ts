declare module 'swagger-ui-react' {
  import React from 'react';
  
  interface SwaggerUIProps {
    url?: string;
    spec?: object;
    docExpansion?: 'list' | 'full' | 'none';
    onComplete?: (system: any) => void;
    requestInterceptor?: (request: any) => any;
    responseInterceptor?: (response: any) => any;
    [key: string]: any;
  }
  
  const SwaggerUI: React.FC<SwaggerUIProps>;
  export default SwaggerUI;
}