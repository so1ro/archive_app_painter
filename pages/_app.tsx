import React from "react"
import dynamic from 'next/dynamic'
import { AppProps } from 'next/app'

import { useEffect } from 'react'
import { useRouter } from 'next/router'
import * as Fathom from 'fathom-client'

import { UserProvider } from '@auth0/nextjs-auth0'
import { ChakraProvider } from "@chakra-ui/react"
import { UserMetadataProvider } from '@/context/useUserMetadata'
import { ArchiveStateProvider } from '@/context/useArchiveState'
import Layout from '@/components/Layout'
import SimpleReactLightbox from 'simple-react-lightbox-pro'
import "focus-visible/dist/focus-visible"

// import '@/styles/globals.css'
import "@fontsource/merriweather/400.css"
import "@fontsource/merriweather/700.css"
import "@fontsource/merriweather/900.css"
import theme from '@/styles/themes'

function App({ Component, pageProps }: AppProps) {

  const router = useRouter()

  // Fathom
  useEffect(() => {
    Fathom.load(process.env.NEXT_PUBLIC_FATHOM_SITEID, {
      includedDomains: ['archive-app-suit-git-fathom-so1ro.vercel.app'],
    })

    function onRouteChangeComplete() { Fathom.trackPageview() }
    router.events.on('routeChangeComplete', onRouteChangeComplete)

    return () => {
      router.events.off('routeChangeComplete', onRouteChangeComplete)
    }
  }, [])
  // Fathom

  return (
    <UserProvider>
      <UserMetadataProvider>
        <ChakraProvider theme={theme}>
          <ArchiveStateProvider>
            <React.StrictMode>
              <SimpleReactLightbox>
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </SimpleReactLightbox>
            </React.StrictMode>
          </ArchiveStateProvider>
        </ChakraProvider>
      </UserMetadataProvider>
    </UserProvider>
  )
}

export default App
