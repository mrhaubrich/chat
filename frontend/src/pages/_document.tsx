import theme from '@/components/theme';
import { ColorModeScript } from '@chakra-ui/react';
import { Head, Html, Main, NextScript } from 'next/document';

export default function Document(context: any) {
  // console.log(context);
  // // await handleSession(context.req);
  return (
    <Html lang="pt-br">
      <Head />
      <body>
        <ColorModeScript type='cookie' initialColorMode={theme.config.initialColorMode} />
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
