import { Stack, Link } from '@chakra-ui/react';
import { nav_links } from '@/data/nav_links';
import ActiveLink from '@/components/ActiveLink';
import { useRouter } from 'next/router';

export default function NavLinks() {

    const { locale, asPath } = useRouter()

    return (
        <Stack spacing={4} isInline alignItems="center" d={{ base: "none", lg: "flex" }}>
            {nav_links.map(link => (
                <ActiveLink href={link.href} root={link.root} key={link.key}>
                    {(!!link.root && asPath.includes(link.root)) ? <></> : <Link>{link.text[locale]}</Link>}
                </ActiveLink>
            ))}
        </Stack>
    );
}