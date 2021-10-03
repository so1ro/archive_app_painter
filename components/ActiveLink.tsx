import React from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

export default function ActiveLink({ href, root, children }: { href: string, root: string | null, children: any }) {
    const router = useRouter()

    let className = children.props.className || ''
    const currentPaths = router.pathname.split('/')

    if (router.pathname === href || currentPaths[1] === root) {
        className = `${className} active`
    }

    return <NextLink href={href} passHref>{React.cloneElement(children, { className })}</NextLink>
}