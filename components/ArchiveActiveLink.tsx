import React from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

export default function ArchiveActiveLink({ href, children }: { href: string, children: any }) {

    const router = useRouter()
    const childClassName = children.props.className || ''
    const className = `${childClassName} ${router.asPath === encodeURI(href) && 'active'}`

    return <NextLink href={href} passHref>{React.cloneElement(children, { className })}</NextLink>
}