// pages/_app.js
import theme from '@/components/theme';
import { ChakraProvider } from '@chakra-ui/react';
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from 'react-query';


const queryClient = new QueryClient();

type MyAppProps = {
  Component: React.ComponentType;
  pageProps: any;
}

// 3. Pass the `theme` prop to the `ChakraProvider`
function MyApp({ Component, pageProps: { session, ...pageProps } }: MyAppProps) {
  return (
    <SessionProvider session={session} refetchInterval={5 * 60}>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </QueryClientProvider>
    </SessionProvider>
  )
}

export default MyApp